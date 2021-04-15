import type nunjucks from "nunjucks";

import type { IFileSystemHandler } from "src/fileSystem";
import type { Document, Highlight } from "../api/models";
import { TemplatedDocument, TemplatedHighlight } from "./models";
import { TemplateLoader } from "./loader";
import { HeaderTemplateType, HighlightTemplateType } from "./templateTypes";

abstract class BaseTemplateRenderer<T> {
    private fsHandler: IFileSystemHandler;
    protected template: nunjucks.Template;

    constructor(template: nunjucks.Template, handler: IFileSystemHandler) {
        this.template = template;
        this.fsHandler = handler;
    }

    abstract render(resource: T): string;
}

export class HeaderTemplateRenderer extends BaseTemplateRenderer<Document> {
    protected constructor(
        template: nunjucks.Template,
        handler: IFileSystemHandler
    ) {
        super(template, handler);
    }

    render(doc: Document): string {
        return this.template.render(new TemplatedDocument(doc));
    }

    static async create(
        path: string,
        handler: IFileSystemHandler
    ): Promise<HeaderTemplateRenderer> {
        let template = await new TemplateLoader(
            path,
            handler,
            new HeaderTemplateType()
        ).load();
        return new HeaderTemplateRenderer(template, handler);
    }
}

export class HighlightTemplateRenderer extends BaseTemplateRenderer<Highlight> {
    protected constructor(
        template: nunjucks.Template,
        handler: IFileSystemHandler
    ) {
        super(template, handler);
    }

    render(highlight: Highlight): string {
        let renderedContent = this.template.render(
            new TemplatedHighlight(highlight)
        );

        if (!renderedContent.includes(`highlight_id: ${highlight.id}`)) {
            renderedContent += `%% highlight_id: ${highlight.id} %%\n`;
        }

        return renderedContent;
    }

    static async create(
        path: string,
        handler: IFileSystemHandler
    ): Promise<HighlightTemplateRenderer> {
        let template = await new TemplateLoader(
            path,
            handler,
            new HighlightTemplateType()
        ).load();
        return new HighlightTemplateRenderer(template, handler);
    }
}
