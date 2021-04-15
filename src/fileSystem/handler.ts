import * as obsidian from "obsidian";
import type { IFileSystemHandler } from "./interface";

export class FileSystemHandler implements IFileSystemHandler {
    adapter: obsidian.FileSystemAdapter;

    constructor(adapter: obsidian.FileSystemAdapter) {
        this.adapter = adapter;
    }

    public normalizePath(path: string): string {
        return obsidian.normalizePath(path);
    }

    public async read(path: string): Promise<string> {
        return await this.adapter.read(path);
    }

    public async write(path: string, data: string): Promise<void> {
        await this.adapter.write(path, data);
    }

    public async exists(path: string): Promise<boolean> {
        return await this.adapter.exists(path);
    }
}
