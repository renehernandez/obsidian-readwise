import { App, PluginSettingTab, Setting } from "obsidian";
import type ObsidianReadwisePlugin from '.';
import type { TokenManager } from "./tokenManager";


export class ObsidianReadwiseSettingsTab extends PluginSettingTab {
    private tokenManager: TokenManager;
    private plugin: ObsidianReadwisePlugin;

	constructor(app: App, plugin: ObsidianReadwisePlugin) {
		super(app, plugin);
		this.plugin = plugin;
        this.tokenManager = plugin.tokenManager;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Readwise Settings'});

        this.apiTokenSetting();
        this.syncOnBoot();
        this.highlightStoragePath();
        this.headerTemplatePath();
        this.highlightTemplatePath();
        this.notificationSettings();
	}

    apiTokenSetting() {
        const desc = document.createDocumentFragment();
        desc.createEl("span", null, (span) => {
            span.innerText =
                "Specify API Token to download highlights from Readwise. You can find the token ";

            span.createEl("a", null, (link) => {
                link.href = "https://readwise.io/access_token";
                link.innerText = "here!";
            });
        });

		new Setting(this.containerEl)
			.setName('Readwise API Token')
			.setDesc(desc)
			.addText(text => {
                const token = this.tokenManager.get();

                if (token !== null) {
                    text.setValue(token);
                }

                text
                .setPlaceholder('<READWISE_TOKEN>')
				.onChange(token => {
                    this.tokenManager.upsert(token);
                });
        });
    }

    syncOnBoot() {
        new Setting(this.containerEl)
            .setName('Sync on Startup')
            .setDesc('Automatically sync updated highlights when Obsidian starts')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.syncOnBoot)
                .onChange(async (value) => {
                    this.plugin.settings.syncOnBoot = value;
                    await this.plugin.saveSettings();
            }));
    }

    highlightStoragePath() {
        new Setting(this.containerEl)
        .setName('Highlight storage path')
        .setDesc('Path to the directory used to store the notes')
        .addText(text => text
            .setValue(this.plugin.settings.highlightStoragePath)
            .onChange(async (value) => {
                this.plugin.settings.highlightStoragePath = value;
                await this.plugin.saveSettings();
            }))
    }

    syncOnInterval() {
        new Setting(this.containerEl)
            .setName('Sync on Interval')
            .setDesc('Sync updated highlights on interval. To disable automatic sync specify a negative value or zero (default')
            .addText(value => {
                if (!isNaN(Number(value))) {
                    this.plugin.settings.autoSyncInterval = Number(value);
                    await this.plugin.saveSettings();
                }
                .setValue(this.plugin.settings.autoSyncInterval)
                .onChange(async (value) => {
                    this.plugin.settings.syncOnBoot = value;
                    
            }
        }));
    }

    headerTemplatePath() {
        new Setting(this.containerEl)
            .setName('Custom Header Template Path')
            .setDesc('Path to template note that overrides how the note header is written')
            .addText(text => text
                .setValue(this.plugin.settings.headerTemplatePath)
                .onChange(async (value) => {
                    this.plugin.settings.headerTemplatePath = value;
                    await this.plugin.saveSettings();
            }));
    }

    highlightTemplatePath() {
        new Setting(this.containerEl)
            .setName('Custom Highlight Template Path')
            .setDesc('Path to template note that overrides how the highlights are written')
            .addText(text => text
                .setValue(this.plugin.settings.highlightTemplatePath)
                .onChange(async (value) => {
                    this.plugin.settings.highlightTemplatePath = value;
                    await this.plugin.saveSettings();
            }));
    }

    notificationSettings() {
        new Setting(this.containerEl)
            .setName('Disable Notifications')
            .setDesc('Disable notifications for plugin operations to minimize distraction (refer to status bar for updates)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.disableNotifications)
                .onChange(async (value) => {
                    this.plugin.settings.disableNotifications = value;
                    await this.plugin.saveSettings();
            }));
    }
}
