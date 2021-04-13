import type { Document } from './api/models';
import type { Template } from './template';
import Log from "./log";
import { FileSystemAdapter, normalizePath } from "obsidian";

export class FileDoc {

    doc: Document;
    fsAdapter: FileSystemAdapter;
    template: Template

    constructor(doc: Document, template: Template, fsAdapter: FileSystemAdapter) {
        this.doc = doc;
        this.template = template;
        this.fsAdapter = fsAdapter;
    }

    public async createOrUpdate() {
        const file = this.filePath();

        var content = '';

        if (!(await this.fsAdapter.exists(file))) {
            Log.debug(`Document ${file} not found. Will be created`);

            content = await this.template.templatize(this.doc);
        }
        else {
            Log.debug(`Document ${file} found. Updating highlights`);
            content = await this.fsAdapter.read(file);
        }

        this.doc.highlights.forEach(hl => {
            if (!content.contains(`%% highlight_id: ${hl.id} %%`)) {
                content += `\n${hl.text} %% highlight_id: ${hl.id} %%\n`
            }
        });

        this.fsAdapter.write(file, content);
    }

    public filePath(): string {
        return normalizePath(`${this.fsAdapter.getBasePath()}/${this.sanitizeName()}.md`);
    }

    public sanitizeName(): string {
        return this.doc.title.replace(/[/\\:]/, '-')
    }
}