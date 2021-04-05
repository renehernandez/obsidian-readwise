import type { Document } from './api/models';
import type { Template } from './template';
import Log from "./log";
import type { App } from "obsidian";

const path = require("path");

export class FileDoc {

    doc: Document;
    app: App;
    template: Template

    constructor(doc: Document, template: Template, app: App) {
        this.doc = doc;
        this.template = template;
        this.app = app;
    }

    public async createOrUpdate() {
        const fileName: string = path.join(`${this.sanitizeName()}.md`);

        if (!(await this.app.vault.adapter.exists(fileName))) {
            Log.debug(`Document ${fileName} not found. Creating it`);

            this.app.vault.adapter.write(fileName, await this.template.templatize(this.doc))
        }
        else {
            Log.debug(`Document ${fileName} found. Updating highlights`);

            var content = await this.app.vault.adapter.read(fileName);

            this.doc.highlights.forEach(hl => {
                if (!content.contains(`%% highlight_id: ${hl.id} %%`)) {
                    content += `\n${hl.text} %% highlight_id: ${hl.id} %%\n`
                }
            });

            this.app.vault.adapter.write(fileName, content);
        }
    }

    public sanitizeName(): string {
        return this.doc.title.replace(/[/\\:]/, '-')
    }
}