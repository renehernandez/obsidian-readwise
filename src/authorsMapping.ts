import type { IFileSystemHandler } from "./fileSystem";

export class AuthorsMapping {
    private path: string;
    private fsHandler: IFileSystemHandler;

    constructor(path: string, fsHandler: IFileSystemHandler) {
        this.path = path;
        this.fsHandler = fsHandler;
    }

    async load(): Promise<Map<string, string>> {
        if (!(await this.fsHandler.exists(this.path))) {
            await this.fsHandler.write(this.path, "{}");
        }

        let content = JSON.parse(await (this.fsHandler.read(this.path)));

        return new Map(Object.entries(content));
    }

}