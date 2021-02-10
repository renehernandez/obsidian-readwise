import type { DateTime } from "luxon";
import type { Notice } from "obsidian";

export class Document {
    public id: number;
    public title: string;
    public author: string;
    public num_highlights: number;
    public updated: DateTime;
    public highlights_url: string;
    public source_url: string;
}

export class Highlight {
    public id: number;
    public text: string;
    public note: string;
    public url: string;
}