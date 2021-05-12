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
import PromiseQueue from "./promiseQueue";


export default class ObsidianReadwisePlugin extends Plugin {
	public settings: ObsidianReadwiseSettings;
    public tokenManager: TokenManager;
	public timeoutIdSync: number;

	private state: PluginState = PluginState.idle;
    private api: ReadwiseApi;
    private mode: AppMode;
    private promiseQueue: PromiseQueue;


    setState(state: PluginState) {
        this.state = state;
        this.mode.display();
    }

    getState(): PluginState {
        return this.state;
    }

	async onload() {
        this.tokenManager = new TokenManager();
        this.mode = this.app.isMobile ? new MobileMode(this) : new DesktopMode(this);
        this.mode.onload();
        this.promiseQueue = new PromiseQueue();

        await this.loadSettings();

        this.setState(PluginState.idle);
        this.addSettingTab(new ObsidianReadwiseSettingsTab(this.app, this));

		this.addCommand({
            id: "sync",
            name: "Sync highlights",
            callback: () => this.promiseQueue.addTask(() => this.syncReadwise(this.settings.lastUpdate)),
        });

		if (this.settings.syncOnBoot) {
			await this.syncReadwise(this.settings.lastUpdate);
		}

        if (this.settings.autoSyncInterval > 0) {
            const now = new Date();
            const diff = this.settings.autoSyncInterval - (Math.round(((now.getTime() - this.settings.lastUpdate) / 1000) / 3600 ));

            this.startAutoSync(diff <= 0 ? 0 : diff);
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
        if (!(await this.initializeApi())) {
            return;
        }
        const documentsResults = await this.getNewHighlightsInDocuments(since, to)

        if (documentsResults.isErr()) {
            const error = documentsResults.unwrapErr();

            Log.error({message: error.message, context: error});
            this.mode.displayError(`Unexpected error: ${error.message}`);
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
        this.mode.displayMessage(message);
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

            fileDoc.createOrUpdate(this.settings.highlightStoragePath);
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

    startAutoSync(hours?: number) {
        this.timeoutIdSync = window.setTimeout(
            () => {
                this.promiseQueue.addTask(() => this.syncReadwise(this.settings.lastUpdate));
                this.startAutoSync();
            },
            (hours ?? this.settings.autoSyncInterval) * 3_600_000
        );
    }

    clearAutoSync(): boolean {
        if (this.timeoutIdSync) {
            window.clearTimeout(this.timeoutIdSync);
            return true;
        }
        return false;
    }
}

interface AppMode {
    onload(): void;
    display(): void;
    displayMessage(message: string): void;
    displayError(message: string): void;
}

class DesktopMode implements AppMode {
    private statusBar: StatusBar;
    private plugin: ObsidianReadwisePlugin;

    constructor(plugin: ObsidianReadwisePlugin) {
        this.plugin = plugin;
    }

    onload() {
        this.statusBar = new StatusBar(this.plugin.addStatusBarItem(), this.plugin, new DateFactory());
        this.plugin.registerInterval(
            window.setInterval(() => this.statusBar.display(), 1000)
        );
    }

    display(): void {
        this.statusBar.display();
    }

    displayMessage(message: string): void {
        if (!this.plugin.settings.disableNotifications) {
			new Notice(message);
		}

		this.statusBar.displayMessage(message.toLowerCase(), 4 * 1000);

		Log.debug(message);
	}

    displayError(message: string): void {
        new Notice(message);

        this.statusBar.displayMessage(message.toLowerCase(), 0);

        Log.debug(message)
    }
}


class MobileMode implements AppMode {
    private plugin: ObsidianReadwisePlugin;

    constructor(plugin: ObsidianReadwisePlugin) {
        this.plugin = plugin;
    }

    onload() {
        return;
    }

    display(): void {
        return;
    }

    displayMessage(message: string): void {
		if (!this.plugin.settings.disableNotifications) {
			new Notice(message);
		}

		Log.debug(message);
	}

    displayError(message: string): void {
        new Notice(message);

        Log.debug(message)
    }
}
