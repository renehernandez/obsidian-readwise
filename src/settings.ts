import type { DateTime } from "luxon";
import { App, Notice, PluginSettingTab, Setting } from "obsidian";
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
        this.syncArticles();
        this.syncTweets();
        this.syncIntervalSetting();
        this.syncOnBoot();
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

    syncArticles() {
        new Setting(this.containerEl)
            .setName('Sync Articles highlights')
            .setDesc('Whether highlights from articles in Readwise should be synced')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.syncArticles)
                .onChange(async (value) => {
                    this.plugin.settings.syncArticles = value;
                    await this.plugin.saveSettings();
            }));
    }

    syncTweets() {
        new Setting(this.containerEl)
            .setName('Sync tweets')
            .setDesc('Whether tweets in Readwise should be synced')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.syncTweets)
                .onChange(async (value) => {
                    this.plugin.settings.syncTweets = value;
                    await this.plugin.saveSettings();
            }));
    }

    syncIntervalSetting() {
		new Setting(this.containerEl)
			.setName('Sync Interval')
			.setDesc('Sync against the Readwise API every X hours. To disable automatic sync, specify a negative value or zero (default)')
			.addText(toggle => toggle
				.setValue(String(this.plugin.settings.syncInterval))
				.onChange(async (value) => {
					if (!isNaN(Number(value))) {
						this.plugin.settings.syncInterval = Number(value);

						if (this.plugin.settings.syncInterval > 0) {
							this.plugin.disableAutoSync(); // call clearInterval() before setting up a new one
							this.plugin.enableAutoSync();
							new Notice(
								`Automatic sync enabled! Every ${this.plugin.settings.syncInterval} hours.`
							);
						}
						else if (this.plugin.settings.syncInterval <= 0 && this.plugin.intervalID) {
							this.plugin.disableAutoSync();
							new Notice("Automatic sync disabled!");
						}

						await this.plugin.saveSettings();
					}
					else {
						new Notice("Please specify a valid number.");
					}
			}));
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

export class ObsidianReadwiseSettings {
	syncInterval: number = 0;
	syncOnBoot: boolean = false;
    lastUpdate: DateTime;
	disableNotifications: boolean = false;
    syncArticles: boolean = true;
    syncTweets: boolean = true;
}