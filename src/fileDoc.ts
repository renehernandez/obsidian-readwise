import type nunjucks from "nunjucks";

import type { Document } from './api/models';
import Log from "./log";
import type { IFileSystemHandler } from './fileSystem';
import type { HeaderTemplateRenderer, HighlightTemplateRenderer } from "./template";

export class FileDoc {

    doc: Document;
    headerRenderer: HeaderTemplateRenderer
    highlightRenderer: HighlightTemplateRenderer
    fsHandler: IFileSystemHandler

    constructor(doc: Document, header: HeaderTemplateRenderer, highlight: HighlightTemplateRenderer, handler: IFileSystemHandler) {
        this.doc = doc;
        this.headerRenderer = header;
        this.highlightRenderer = highlight;
        this.fsHandler = handler;
    }

    public async createOrUpdate() {
        const file = this.filePath();

        var content = '';

        if (!(await this.fsHandler.exists(file))) {
            Log.debug(`Document ${file} not found. Will be created`);

            content = await this.headerRenderer.render(this.doc);
        }
        else {
            Log.debug(`Document ${file} found. Loading content and updating highlights`);
            content = await this.fsHandler.read(file);
        }

        this.doc.highlights.forEach(hl => {
            if (!content.includes(`highlight_id: ${hl.id}`)) {
                content += `\n${this.highlightRenderer.render(hl)}\n`
            }
        });

        await this.fsHandler.write(file, content);
    }

    public filePath(): string {
        return this.fsHandler.normalizePath(`${this.sanitizeName()}.md`);
    }

    public sanitizeName(): string {
        return this.doc.title.replace(/[/\\:]/, '-')
    }
}