export interface ObsidianReadwiseSettings {
    syncOnBoot: boolean;
    lastUpdate: number;
	disableNotifications: boolean;
    headerTemplate: string;

}

export class ObsidianReadwiseSettingsGenerator {

    static withData(data: any): ObsidianReadwiseSettings {
        return Object.assign({}, ObsidianReadwiseSettingsGenerator.defaultSettings(), data);
    }

    static defaultSettings(): ObsidianReadwiseSettings {
        return {
            syncOnBoot: false,
            disableNotifications: false,
            headerTemplate: "",
            lastUpdate: Date.now()
        }
    }
}