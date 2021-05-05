export interface ObsidianReadwiseSettings {
    syncOnBoot: boolean;
    lastUpdate: number;
	disableNotifications: boolean;
    headerTemplatePath: string;
    highlightStoragePath: string;
    highlightTemplatePath: string;
}

export class ObsidianReadwiseSettingsGenerator {

    static withData(data: any): ObsidianReadwiseSettings {
        return Object.assign({}, ObsidianReadwiseSettingsGenerator.defaultSettings(), data);
    }

    static defaultSettings(): ObsidianReadwiseSettings {
        return {
            syncOnBoot: false,
            disableNotifications: false,
            headerTemplatePath: "",
            highlightTemplatePath: "",
            highlightStoragePath: "",
            lastUpdate: Date.now()
        }
    }
}
