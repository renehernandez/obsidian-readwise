import type { Document } from "./api/models";
import nunjucks from "nunjucks";
import type { App } from "obsidian";
import Log from "./log";

export class Template {

    path: string
    app: App

    constructor(path: string, app: App) {
        this.path = path;
        this.app = app;
    }

    public async templatize(doc: Document): Promise<string> {
        var template: string = this.defaultTemplate();
        if (this.path != null) {
            Log.debug(`Loading template from ${this.path}`)
            template = await this.app.vault.adapter.read(this.path);
        }

        Log.debug("Evaluating template with doc")
        return nunjucks.renderString(template, doc);
    }

    defaultTemplate(): string {
        return `- **URL:** {{ source_url }}
- **Author:** {{ author }}
- **Tags:** #{{ category }}
- **Date:** [[{{ updated }}]]
---
`;
    }
}