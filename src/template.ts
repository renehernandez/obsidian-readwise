import type { Document } from "./api/models";
import nunjucks from "nunjucks";
import Log from "./log";
import type { IFileSystemHandler } from "./fileSystem";

export class Template {

    templatePath: string
    fsHandler: IFileSystemHandler

    constructor(templatePath: string, handler: IFileSystemHandler) {
        this.templatePath = templatePath;
        this.fsHandler = handler;
    }

    public async templatize(doc: Document): Promise<string> {
        var template: string = this.defaultTemplate();
        if (this.templatePath != null) {
            if (!this.templatePath.endsWith('.md')) {
                this.templatePath += '.md'
            }
            Log.debug(`Loading template from ${this.templatePath}`)
            template = await this.fsHandler.read(this.templatePath);
        }

        Log.debug("Evaluating template with doc")
        return nunjucks.renderString(template, new TemplatedDocument(doc));
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

class TemplatedDocument {
    public title: string;
    public author: string;
    public updated: string;
    public source_url: string;
    public category: string;

    constructor(doc: Document) {
        this.title = doc.title;
        this.author = doc.author;
        this.updated = doc.updated;
        this.source_url = doc.source_url;
        this.category = doc.category;
    }
}