import type { IFileSystemHandler } from "../src/fileSystem";
import type { IDateFactory, IDateHandler } from "../src/date";

const moment = require("moment");
const fs = require('fs');
const path = require('path');

export function fileSystemHandler(): IFileSystemHandler {
    return {
        normalizePath: (path: string) => path,
        read: async (path: string) => {
            return fs.readFileSync(path).toString();
        },
        write: async (path: string) => {},
        exists: async (path: string) => true,
        pluginsDir: () => resolvePathToData("plugins")
    }
}

export function resolvePathToData(filePath: string): string {
    return path.resolve(path.join("tests/data", filePath));
}

export class TestDateHandler implements IDateHandler {
    private date: any;

    constructor(date: any) {
        this.date = date;
    }

    fromNow(): string {
        return moment(this.date).fromNow();
    }

    format(format?: string): string {
        return moment(this.date).format(format);
    }

    utc(): IDateHandler {
        return new TestDateHandler(moment(this.date).utc());
    }
}

export class TestDateFactory implements IDateFactory {
    createHandler(date: any): IDateHandler {
        return new TestDateHandler(date);
    }
}