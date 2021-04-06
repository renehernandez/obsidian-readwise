export interface IDocument {
    id: number;
    title: string;
    author: string;
    num_highlights: number;
    updated: string;
    highlights_url: string;
    source_url: string;
    category: string;
}

export interface IHighlight {
    id: number;
    book_id: number;
    text: string;
    note: string;
    url: string;
    location: number;
}
