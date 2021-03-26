import { Notice, Plugin } from "obsidian";
import { DateTime } from "luxon";
import { ObsidianReadwiseSettings, ObsidianReadwiseSettingsTab } from './settings';
import { PluginState, StatusBar } from './status';
import { ReadwiseApi } from './api/api';
import type { Document, Highlight } from './api/models';
import { getTokenPath, getSecretsDirPath } from './utils';
import ReadwiseApiTokenModal from "./modals/enterApiToken/tokenModal";
import Log from "./log";
import type { Result } from "./result";

const fs = require("fs");
const path = require("path");

export default class ObsidianReadwisePlugin extends Plugin {
	public settings: ObsidianReadwiseSettings;
	public intervalID: number;

	private state: PluginState = PluginState.idle;
	private statusBar: StatusBar;
    private api: ReadwiseApi;

    setState(state: PluginState) {
        this.state = state;
        this.statusBar.display();
    }

    getState(): PluginState {
        return this.state;
    }

	async onload() {
        let statusBarEl = this.addStatusBarItem();
        this.statusBar = new StatusBar(statusBarEl, this);
        this.api = null

        await this.loadSettings();

        this.setState(PluginState.idle);
        this.addSettingTab(new ObsidianReadwiseSettingsTab(this.app, this));

		this.registerInterval(
            window.setInterval(() => this.statusBar.display(), 1000)
        );

		this.addCommand({
            id: "sync",
            name: "Sync highlights from Readwise",
            callback: async () => this.syncReadwise(),
        });

        try {
            await this.createSecretsDirIfNotPresent();
            const apiInitialized = await this.initializeApi();

            if (!apiInitialized) {
                Log.debug("Starting Modal to ask for token")
                const tokenModal = new ReadwiseApiTokenModal(this.app);
                await tokenModal.waitForClose;
                const token = tokenModal.token;

                if (token.length == 0) {
                    alert(
                        "Provided token was empty, please configure it in the settings to sync with Readwise"
                    );
                    return;
                }

                await this.initializeApiWithToken(token)
            }
        } catch (e) {
            Log.error({message: e.message, context: e});
            this.displayError(`Unexpected error: ${e.message}`);

            return;
        }

		if (this.settings.syncOnBoot) {
			await this.syncReadwise(this.settings.lastUpdate).then(filesSynced => {
				this.setState(PluginState.idle);
				let message =  filesSynced > 0
					? `Readwise: Synced new changes. ${filesSynced} files synced`
					: `Readwise: Everything up-to-date`;
				this.displayMessage(message);
			});
		}
	}

	async onunload() {
		await this.saveSettings();
	}

	async loadSettings() {
		this.settings = await this.loadData() || new ObsidianReadwiseSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

    async syncReadwise(since?: DateTime, to?: DateTime): Promise<number> {
        const documentsResults = await this.getNewHighlightsInDocuments()

        if (documentsResults.isErr()) {
            const error = documentsResults.unwrapErr();

            Log.error({message: error.message, context: error});
            this.displayError(`Unexpected error: ${error.message}`);
            return 0;
        }

        const documents = documentsResults.unwrap();
        this.updateNotes(documents);

        this.setState(PluginState.sync)
        this.settings.lastUpdate = DateTime.local();

        await this.saveSettings();

        return documents.length;
	}

    async getNewHighlightsInDocuments(since?: DateTime, to?: DateTime): Promise<Result<Document[], Error>> {
        this.setState(PluginState.checking)

        return await this.api.getDocumentsWithHighlights(since, to);
    }

    async updateNotes(documents: Document[]) {

    }

    async initializeApi(): Promise<boolean> {
        try {
            const token = await this.getApiToken();
            if (token.length == 0) {
                return false
            }
            this.api = new ReadwiseApi(token);
            return true;
        }
        catch (e) {
            Log.error({message: e.message, context: e})
            return false;
        }
    }

    async initializeApiWithToken(token: string): Promise<boolean> {
        const tokenPath = getTokenPath();

        await this.app.vault.adapter.write(tokenPath, token, () => true);

        if (token.length == 0) {
            return false;
        }

        this.api = new ReadwiseApi(token);
        return true
    }

    async getApiToken(): Promise<string> {
        const tokenPath = getTokenPath();

        return await this.app.vault.adapter.read(tokenPath)
    }

    async createSecretsDirIfNotPresent() {
        const secretsDir = getSecretsDirPath();

        if (!(await this.app.vault.adapter.exists(secretsDir))) {
            Log.debug("Creating secrets dir")
            await this.app.vault.adapter.mkdir(secretsDir);
        }
    }

	//#region displaying / formatting messages
	displayMessage(message: string, timeout: number = 4 * 1000): void {
		this.statusBar.displayMessage(message.toLowerCase(), timeout);

		if (!this.settings.disableNotifications) {
			new Notice(message);
		}

		Log.debug(message);
	}

	displayError(message: string, timeout: number = 0): void {
        new Notice(message);
        this.statusBar.displayMessage(message.toLowerCase(), timeout);

        Log.debug(message)
    }

	//#endregion
}
