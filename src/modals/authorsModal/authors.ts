import { App, Modal } from "obsidian";
import type { ObsidianReadwiseSettings } from "src/settings";
import AuthorsMappingModalContent from "./authorsMappingModalContent.svelte";

export default class ReadwiseAuthorsMappingModal extends Modal {
    public waitForClose: Promise<void>;
    private resolvePromise: () => void;
    private modalContent: AuthorsMappingModalContent;
    private settings: ObsidianReadwiseSettings;

    constructor(app: App, settings: ObsidianReadwiseSettings) {
        super(app);

        this.settings = settings;

        this.waitForClose = new Promise(
            (resolve) => (this.resolvePromise = resolve)
        );

        this.titleEl.innerText = "Setup Readwise API token";

        this.modalContent = new AuthorsMappingModalContent({
            target: this.contentEl,
            props: {
                onSubmit: (value: string) => {
                    this.close();
                },
            },
        });

        this.open();
    }

    onClose() {
        super.onClose();
        this.modalContent.$destroy();
        this.resolvePromise();
    }
}
