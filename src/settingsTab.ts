import { App, PluginSettingTab, Setting } from "obsidian";
import type ObsidianReadwisePlugin from '.';


export class ObsidianReadwiseSettingsTab extends PluginSettingTab {
	private plugin: ObsidianReadwisePlugin;

	constructor(app: App, plugin: ObsidianReadwisePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Readwise Settings'});

        this.apiTokenSetting();
        this.syncOnBoot();
        this.headerTemplate();
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
			.addText(async (text) => {
                try {
                    text.setValue(await this.plugin.getApiToken())
                }
                catch (e) {
                    /* Throw away read error if file does not exist. */
                }

                text.setPlaceholder('<READWISE_TOKEN>')
				text.onChange(async (value) => {
                    await this.plugin.initializeApiWithToken(value);
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

    headerTemplate() {
        new Setting(this.containerEl)
            .setName('Custom Note Header Template')
            .setDesc('Overrides the default Header for notes')
            .addText(text => text
                .setValue(this.plugin.settings.headerTemplate)
                .onChange(async (value) => {
                    this.plugin.settings.headerTemplate = value;
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
