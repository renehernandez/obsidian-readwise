import type { IFileSystemHandler } from "./fileSystem";
import Log from "./log";


export class AuthorsMapping {

    fsHandler: IFileSystemHandler;
    filename: string
    path: string

    constructor(filename: string, fsHandler: IFileSystemHandler) {
        this.filename = filename;
        this.fsHandler = fsHandler;
    }

    public async initialize(): Promise<void> {
        this.path = this.fsHandler.normalizePath(`${this.fsHandler.pluginsDir()}/obsidian-readwise/${this.filename}`);

        if (!(await this.fsHandler.exists(this.path))) {
            Log.debug(`Creating authors mapping at ${this.path}`);
            await this.fsHandler.write(this.path, "{}");
        }
    }

    public async load(): Promise<Map<string, string>> {
        let content = JSON.parse(await (this.fsHandler.read(this.path)));

        return new Map(Object.entries(content));
    }

}