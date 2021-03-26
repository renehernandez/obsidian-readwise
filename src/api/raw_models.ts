import type { DateTime } from "luxon";

export interface IDocument {
    id: number;
    title: string;
    author: string;
    num_highlights: number;
    updated: DateTime;
    highlights_url: string;
    source_url: string;
}

export interface IHighlight {
    id: number;
    book_id: number;
    text: string;
    note: string;
    url: string;
}