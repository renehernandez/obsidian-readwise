import type { Document, Highlight } from "../api/models";

export class TemplatedDocument {
    public title: string;
    public author: string;
    public updated: string;
    public source_url: string;
    public category: string;

    constructor(doc: Document) {
        this.title = doc.title;
        this.author = doc.author;
        this.updated = doc.updated;
        this.source_url = doc.source_url;
        this.category = doc.category;
    }
}

export class TemplatedHighlight {
    public text: string;
    public note: string;
    public id: number;
    public location: number;

    constructor(highlight: Highlight) {
        this.text = highlight.text;
        this.id = highlight.id;
        this.note = highlight.note;
        this.location = highlight.location;
    }
}
