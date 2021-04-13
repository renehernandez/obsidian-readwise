export interface IFileSystemHandler {
    getBasePath(): string;

    normalizePath(path: string): string;

    read(path: string): Promise<string>;

    write(path: string, data: string): Promise<void>;

    exists(path: string): Promise<boolean>;
}
