export interface IDateHandler {
    fromNow(): string;

    format(format?: string): string;

    utc(): IDateHandler;
}

export interface IDateFactory {
    createHandler(date: any): IDateHandler;
}
