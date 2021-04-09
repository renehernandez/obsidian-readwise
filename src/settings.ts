export class ObsidianReadwiseSettings {
	syncOnBoot: boolean = false;
    lastUpdate: number;
	disableNotifications: boolean = false;
    headerTemplate: string;

    static withData(data: any): ObsidianReadwiseSettings {
        return Object.assign({}, ObsidianReadwiseSettings.defaultSettings(), data);
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