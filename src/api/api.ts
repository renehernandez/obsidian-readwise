import type { DateTime } from "luxon";
import { Result } from "../result";
import Log from "../log";
import type { IDocument, IHighlight } from "./raw_models";
import { Document, Highlight } from "./models";

export class ReadwiseApi {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getDocumentsWithHighlights(since: DateTime, to: DateTime): Promise<Result<Document[], Error>> {
        const documentsResult = await this.getUpdatedDocuments(since, to);
        if (documentsResult.isErr()) {
            return documentsResult.intoErr();
        }

        const documents = documentsResult.unwrap();

        const highlightsResult = await this.getNewHighlightsInDocuments(since, to);
        if (highlightsResult.isErr()) {
            return highlightsResult.intoErr();
        }

        const highlights = highlightsResult.unwrap();

        documents.forEach(doc => {
            doc.highlights = highlights.filter(high => high.book_id == doc.id);
        });

        return Result.Ok(documents);
    }

    async getUpdatedDocuments(since: DateTime, to: DateTime): Promise<Result<Document[], Error>> {
        let url = `https://readwise.io/api/v2/books/`;
        const params = {
            page_size: '1000'
        };

        if (since !== undefined) {
            Object.assign(params, {updated__gt: since});
        }

        if (to !== undefined) {
            Object.assign(params, {updated__lt: to});
        }

        url += "?" + new URLSearchParams(params)

        Log.debug(`url: ${url}`);

        try {
            const response = await fetch(url, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: `Token ${this.token}`
                }),
            });

            if (response.ok) {
                const documents = Document.Parse((await response.json()) as IDocument[]);
                if (documents.length > 0) {
                    Log.debug(`Found ${documents.length} docs with new highlights`);
                }
                return Result.Ok(documents);
            }

            return Result.Err(new Error(await response.text()));
        }
        catch (e) {
            return Result.Err(e);
        }
    }

    async getNewHighlightsInDocuments(since: DateTime, to: DateTime): Promise<Result<Highlight[], Error>> {
        let url = "https://readwise.io/api/v2/highlights/";

        const params = {
            page_size: '1000'
        };

        if (since !== undefined) {
            Object.assign(params, {updated__gt: since});
        }

        if (to !== undefined) {
            Object.assign(params, {updated__lt: to});
        }

        url += "?" + new URLSearchParams(params)

        Log.debug(`url: ${url}`);

        try {
            const response = await fetch(url, {
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: `Token ${this.token}`
                }),
            });

            if (response.ok) {
                const highlights = Highlight.Parse((await response.json()) as IHighlight[]);
                if (highlights.length > 0) {
                    Log.debug(`Found ${highlights.length} new highlights`);
                }
                return Result.Ok(highlights);
            }

            return Result.Err(new Error(await response.text()));
        }
        catch (e) {
            return Result.Err(e);
        }
    }
}