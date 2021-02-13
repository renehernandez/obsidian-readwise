import type { DateTime } from 'luxon';
import type ObsidianReadwisePlugin from '.';
import Log from './log';

export enum PluginState {
    idle,
    sync,
    checking,
}

export class StatusBar {
	private messages: StatusBarMessage[] = [];
    private currentMessage: StatusBarMessage;
    private lastMessageTimestamp: number;
    private statusBarEl: HTMLElement;
    private plugin: ObsidianReadwisePlugin;

	constructor(statusBarEl: HTMLElement, plugin: ObsidianReadwisePlugin) {
        this.statusBarEl = statusBarEl;
        this.plugin = plugin;
    }

    displayMessage(message: string, timeout: number) {
        this.messages.push({
            message: `readwise: ${message.slice(0, 100)}`,
            timeout: timeout,
        });
        this.display();
	}

	display() {
        if (this.messages.length > 0 && !this.currentMessage) {
            this.currentMessage = this.messages.shift();
            this.statusBarEl.setText(this.currentMessage.message);
            this.lastMessageTimestamp = Date.now();
        } else if (this.currentMessage) {
            let messageAge = Date.now() - this.lastMessageTimestamp;
            if (messageAge >= this.currentMessage.timeout) {
                this.currentMessage = null;
                this.lastMessageTimestamp = null;
            }
        } else {
            this.displayState();
        }
	}

    private displayState() {
        let state = this.plugin.getState();

        switch (state) {
            case PluginState.idle:
                this.displayFromNow(this.plugin.settings.lastUpdate);
                break;
            case PluginState.checking:
                this.statusBarEl.setText("readwise: checking if there are new highlights to sync");
                break;
            case PluginState.sync:
                this.statusBarEl.setText("readwise: syncing new highlights");
                break;
        }
    }

    private displayFromNow(timestamp: DateTime): void {
        if (timestamp) {
            let moment = (window as any).moment;
            let fromNow = moment(timestamp).fromNow();
            this.statusBarEl.setText(`readwise: last update ${fromNow}..`);
        } else {
            this.statusBarEl.setText(`readwise: ready`);
        }
    }
}

export interface StatusBarMessage {
    message: string;
    timeout: number;
}