import type { Document } from './api/models';
import type { Template } from './template';
import Log from "./log";
import type { IFileSystemHandler } from './fileSystem';

export class FileDoc {

    doc: Document;
    template: Template
    fsHandler: IFileSystemHandler

    constructor(doc: Document, template: Template, handler: IFileSystemHandler) {
        this.doc = doc;
        this.template = template;
        this.fsHandler = handler;
    }

    public async createOrUpdate() {
        const file = this.filePath();

        var content = '';

        if (!(await this.fsHandler.exists(file))) {
            Log.debug(`Document ${file} not found. Will be created`);

            content = await this.template.templatize(this.doc);
        }
        else {
            Log.debug(`Document ${file} found. Updating highlights`);
            content = await this.fsHandler.read(file);
        }

        this.doc.highlights.forEach(hl => {
            if (!content.includes(`%% highlight_id: ${hl.id} %%`)) {
                content += `\n${hl.text} %% highlight_id: ${hl.id} %%\n`
            }
        });

        await this.fsHandler.write(file, content);
    }

    public filePath(): string {
        return this.fsHandler.normalizePath(`${this.fsHandler.getBasePath()}/${this.sanitizeName()}.md`);
    }

    public sanitizeName(): string {
        return this.doc.title.replace(/[/\\:]/, '-')
    }
}