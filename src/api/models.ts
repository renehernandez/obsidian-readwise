import type { DateTime } from "luxon";
import type { IDocument, IHighlight } from "./raw_models";

export class Document {
    public id: number;
    public title: string;
    public author: string;
    public num_highlights: number;
    public updated: DateTime;
    public highlights_url: string;
    public source_url: string;

    public highlights: Highlight[]

    constructor(raw: IDocument) {
        this.id = raw.id;
        this.title = raw.title;
        this.author = raw.author;
        this.num_highlights = raw.num_highlights;
        this.updated = raw.updated;
        this.highlights_url = raw.highlights_url;
        this.source_url = raw.source_url
    }

    static Parse(idocs: IDocument[]): Document[] {
        return Array.from(idocs).map(idoc => new Document(idoc))
    }
}

export class Highlight {
    public id: number;
    public book_id: number;
    public text: string;
    public note: string;
    public url: string;

    constructor(raw: IHighlight) {
        this.id = raw.id;
        this.book_id = raw.book_id;
        this.note = raw.note;
        this.text = raw.text;
        this.url = raw.url;
    }

    static Parse(ihighs: IHighlight[]): Highlight[] {
        return Array.from(ihighs).map(ihigh => new Highlight(ihigh));
    }
}