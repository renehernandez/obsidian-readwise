import { Notice, Plugin, FileSystemAdapter } from "obsidian";
import { ObsidianReadwiseSettings, ObsidianReadwiseSettingsGenerator } from './settings';
import { ObsidianReadwiseSettingsTab } from './settingsTab';
import { PluginState, StatusBar } from './status';
import { ReadwiseApi } from './api/api';
import type { Document } from './api/models';
import ReadwiseApiTokenModal from "./modals/enterApiToken/tokenModal";
import Log from "./log";
import type { Result } from "./result";
import { HeaderTemplateRenderer, HighlightTemplateRenderer } from "./template";
import { FileDoc } from "./fileDoc";
import { TokenManager } from "./tokenManager";
import { FileSystemHandler } from "./fileSystem";
import { DateFactory } from "./date";


export default class ObsidianReadwisePlugin extends Plugin {
	public settings: ObsidianReadwiseSettings;
    public tokenManager: TokenManager;
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
        if (!this.app.isMobile) {
            this.statusBar = new StatusBar(statusBarEl, this, new DateFactory());
        }
        this.tokenManager = new TokenManager();

        await this.loadSettings();

        this.setState(PluginState.idle);
        this.addSettingTab(new ObsidianReadwiseSettingsTab(this.app, this));

		this.registerInterval(
            window.setInterval(() => this.statusBar.display(), 1000)
        );

		this.addCommand({
            id: "sync",
            name: "Sync highlights",
            callback: async () => {
                if (!(await this.initializeApi())) {
                    return;
                }
                await this.syncReadwise(this.settings.lastUpdate);
        }});

        if (!(await this.initializeApi())) {
            return;
        }

		if (this.settings.syncOnBoot) {
			await this.syncReadwise(this.settings.lastUpdate);
		}
	}

	async onunload() {
		await this.saveSettings();
	}

	async loadSettings() {
        this.settings = ObsidianReadwiseSettingsGenerator.withData(await this.loadData());
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

        this.settings.lastUpdate = Date.now();

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
        const handler = new FileSystemHandler(this.app.vault.adapter as FileSystemAdapter);
        const header = await HeaderTemplateRenderer.create(this.settings.headerTemplatePath, handler);
        const highlight = await HighlightTemplateRenderer.create(this.settings.highlightTemplatePath, handler);

        documents.forEach(doc => {
            const fileDoc = new FileDoc(doc, header, highlight, handler);

            fileDoc.createOrUpdate();
        });

    }

    async initializeApi(): Promise<boolean> {
        let token = this.tokenManager.get()

        if (token === null) {
            Log.debug("Starting Modal to ask for token")
            const tokenModal = new ReadwiseApiTokenModal(this.app, this.tokenManager);
            await tokenModal.waitForClose;

            token = this.tokenManager.get();

            if (token === null) {
                alert(
                    "Token was empty or was not provided, please configure it in the settings to sync with Readwise"
                );
                return false;
            }
        }

        this.api = new ReadwiseApi(token, new DateFactory());
        return true
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
