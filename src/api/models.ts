import type { IDateFactory } from "src/date";
import type { IDocument, IHighlight } from "./raw_models";

export class Document {
    public id: number;
    public title: string;
    public author: string;
    public num_highlights: number;
    public updated: string;
    public highlights_url: string;
    public source_url: string;
    public category: string;

    public highlights: Highlight[];

    constructor(raw: IDocument, factory: IDateFactory) {
        this.id = raw.id;
        this.title = raw.title;
        this.author = raw.author;
        this.num_highlights = raw.num_highlights;
        this.updated = factory.createHandler(raw.updated).format("YYYY-MM-DD");
        this.highlights_url = raw.highlights_url;
        this.source_url = raw.source_url;
        this.category = raw.category;
    }

    static Parse(idocs: IDocument[], factory: IDateFactory): Document[] {
        return Array.from(idocs).map((idoc) => new Document(idoc, factory));
    }
}

export class Highlight {
    public id: number;
    public book_id: number;
    public text: string;
    public note: string;
    public url: string;
    public location: number;
    public updated: string;

    constructor(raw: IHighlight) {
        this.id = raw.id;
        this.book_id = raw.book_id;
        this.note = raw.note;
        this.text = raw.text;
        this.url = raw.url;
        this.location = raw.location;
        this.updated = raw.updated;
    }

    static Parse(ihighs: IHighlight[]): Highlight[] {
        return Array.from(ihighs).map((ihigh) => new Highlight(ihigh));
    }
}
