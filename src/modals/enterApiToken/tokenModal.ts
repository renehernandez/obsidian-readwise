import { App, Modal } from "obsidian";
import type { TokenManager } from "src/tokenManager";
import EnterApiTokenModalContent from "./enterApiTokenModalContent.svelte";

export default class ReadwiseApiTokenModal extends Modal {
    public waitForClose: Promise<void>;
    private resolvePromise: () => void;
    private modalContent: EnterApiTokenModalContent;
    private tokenManager: TokenManager;

    constructor(app: App, tokenManager: TokenManager) {
        super(app);

        this.tokenManager = tokenManager;
        this.waitForClose = new Promise(
            (resolve) => (this.resolvePromise = resolve)
        );

        this.titleEl.innerText = "Setup Readwise API token";

        this.modalContent = new EnterApiTokenModalContent({
            target: this.contentEl,
            props: {
                onSubmit: (value: string) => {
                    this.tokenManager.upsert(value);
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
