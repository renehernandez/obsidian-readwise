export class ObsidianReadwiseSettings {
	syncOnBoot: boolean = false;
    lastUpdateTimestamp: number;
	disableNotifications: boolean = false;
    headerTemplate: string;

    static defaultSettings(): ObsidianReadwiseSettings {
        return {
            syncOnBoot: false,
            disableNotifications: false,
            headerTemplate: "",
            lastUpdateTimestamp: 0
        }
    }
}