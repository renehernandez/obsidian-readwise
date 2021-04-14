import type { IDateFactory, IDateHandler } from "./interface";

export class DateHandler implements IDateHandler {
    private moment: any;
    private date: any;

    constructor(date: any) {
        this.moment = window.moment;
        this.date = date;
    }

    fromNow(): string {
        return this.moment(this.date).fromNow();
    }

    format(format?: string): string {
        return this.moment(this.date).format(format);
    }

    utc(): IDateHandler {
        return new DateHandler(this.moment(this.date).utc());
    }
}

export class DateFactory implements IDateFactory {
    createHandler(date: any): IDateHandler {
        return new DateHandler(date);
    }
}
