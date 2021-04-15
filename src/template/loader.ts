import type { IFileSystemHandler } from "src/fileSystem";
import nunjucks from "nunjucks";
import Log from "../log";
import type { ITemplateType } from "./templateTypes";

export class TemplateLoader {
    private path: string;
    private fsHandler: IFileSystemHandler;
    private templateType: ITemplateType;

    constructor(
        path: string,
        fsHandler: IFileSystemHandler,
        templateType: ITemplateType
    ) {
        this.path = path;
        this.fsHandler = fsHandler;
        this.templateType = templateType;
    }

    async load(): Promise<nunjucks.Template> {
        let content = await this.selectTemplate();

        let env = nunjucks.configure({ autoescape: false });

        return nunjucks.compile(content, env);
    }

    async selectTemplate(): Promise<string> {
        let content: string = this.templateType.defaultTemplate();

        if (this.path !== null && this.path !== "") {
            if (!this.path.endsWith(".md")) {
                this.path += ".md";
            }
            Log.debug(`Loading template content from ${this.path}`);
            content = await this.fsHandler.read(this.path);
        } else {
            Log.debug(`Using default ${this.templateType.type()}`);
        }

        return content;
    }
}
