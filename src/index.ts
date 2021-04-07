import { Notice, Plugin } from "obsidian";
import { ObsidianReadwiseSettings } from './settings';
import { ObsidianReadwiseSettingsTab } from './settingsTab';
import { PluginState, StatusBar } from './status';
import { ReadwiseApi } from './api/api';
import type { Document } from './api/models';
import { getTokenPath, getSecretsDirPath } from './utils';
import ReadwiseApiTokenModal from "./modals/enterApiToken/tokenModal";
import Log from "./log";
import type { Result } from "./result";
import { Template } from "./template";
import { FileDoc } from "./fileDoc";


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
            name: "Sync highlights",
            callback: async () => this.syncReadwise(this.settings.lastUpdateTimestamp)
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
			await this.syncReadwise(this.settings.lastUpdateTimestamp);
		}
	}

	async onunload() {
		await this.saveSettings();
	}

	async loadSettings() {
        this.settings = Object.assign({}, ObsidianReadwiseSettings.defaultSettings(), await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

    async syncReadwise(since?: number, to?: number) {
        const documentsResults = await this.getNewHighlightsInDocuments(since, to)

        if (documentsResults.isErr()) {
            const error = documentsResults.unwrapErr();

            Log.error({message: error.message, context: error});
            this.displayError(`Unexpected error: ${error.message}`);
            return 0;
        }

        const documents = documentsResults.unwrap();

        if (documents.length > 0) {
            await this.updateNotes(documents);
        }

        this.settings.lastUpdateTimestamp = Date.now();

        await this.saveSettings();

        this.setState(PluginState.idle);
        let message = documents.length > 0
            ? `Readwise: Synced new changes. ${documents.length} files synced`
            : `Readwise: Everything up-to-date`;
        this.displayMessage(message);
	}

    async getNewHighlightsInDocuments(since?: number, to?: number): Promise<Result<Document[], Error>> {
        this.setState(PluginState.checking)

        return await this.api.getDocumentsWithHighlights(since, to);
    }

    async updateNotes(documents: Document[]) {
        this.setState(PluginState.syncing)
        const template = new Template(this.settings.headerTemplate, this.app);

        documents.forEach(doc => {
            const fileDoc = new FileDoc(doc, template, this.app);

            fileDoc.createOrUpdate();
        });

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

        await this.app.vault.adapter.write(tokenPath, token);

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
