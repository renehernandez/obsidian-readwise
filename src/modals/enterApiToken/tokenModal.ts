import { App, Modal } from "obsidian";
import EnterApiTokenModalContent from "./enterApiTokenModalContent.svelte";

export default class ReadwiseApiTokenModal extends Modal {
    public token: string;
    public waitForClose: Promise<void>;
    private resolvePromise: () => void;
    private modalContent: EnterApiTokenModalContent;

    constructor(app: App) {
        super(app);

        this.token = "";
        this.waitForClose = new Promise(
            (resolve) => (this.resolvePromise = resolve)
        );

        this.titleEl.innerText = "Setup Readwise API token";

        this.modalContent = new EnterApiTokenModalContent({
            target: this.contentEl,
            props: {
                onSubmit: (value: string) => {
                    this.token = value;
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
