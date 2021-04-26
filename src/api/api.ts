import { Result } from "../result";
import Log from "../log";
import type { IDocument, IHighlight } from "./raw_models";
import { Document, Highlight } from "./models";
import type { IDateFactory } from "src/date";

export class ReadwiseApi {
    private token: string;
    private dateFactory: IDateFactory;

    constructor(token: string, factory: IDateFactory) {
        this.token = token;
        this.dateFactory = factory;
    }

    async getDocumentsWithHighlights(
        since?: number,
        to?: number
    ): Promise<Result<Document[], Error>> {
        const documentsResult = await this.getUpdatedDocuments(since, to);
        if (documentsResult.isErr()) {
            return documentsResult.intoErr();
        }

        const documents = documentsResult.unwrap();

        console.log(documents);

        const highlightsResult = await this.getNewHighlightsInDocuments(
            since,
            to
        );
  
        if (highlightsResult.isErr()) {
            return highlightsResult.intoErr();
        }

        const highlights = highlightsResult.unwrap();
        console.log(highlights);

        documents.forEach((doc) => {
            doc.highlights = highlights.filter(
                (high) => high.book_id == doc.id
            );
            doc.highlights.sort((a, b) => a.location - b.location);
        });

        return Result.Ok(documents);
    }

    async getUpdatedDocuments(
        since?: number,
        to?: number
    ): Promise<Result<Document[], Error>> {
        let url = `https://readwise.io/api/v2/books/`;
        const params = {
            page_size: "1000",
        };

        if (this.isValidTimestamp(since)) {
            Object.assign(params, {
                updated__gt: this.dateFactory
                    .createHandler(since)
                    .utc()
                    .format(),
            });
        }

        if (this.isValidTimestamp(to)) {
            Object.assign(params, {
                updated__lt: this.dateFactory.createHandler(to).utc().format(),
            });
        }

        url += "?" + new URLSearchParams(params);

        try {
            const response = await fetch(url, {
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.token}`,
                }),
            });

            if (response.ok) {
                const content = await response.json();
                const documents = Document.Parse(
                    content.results as IDocument[],
                    this.dateFactory
                );
                if (documents.length > 0) {
                    Log.debug(
                        `Found ${documents.length} docs with new highlights`
                    );
                } else {
                    Log.debug("No updated documents");
                }
                return Result.Ok(documents);
            } else {
                Log.debug(`The documents API call at ${url} failed`);
            }

            return Result.Err(new Error(await response.text()));
        } catch (e) {
            return Result.Err(e);
        }
    }

    async getNewHighlightsInDocuments(
        since?: number,
        to?: number
    ): Promise<Result<Highlight[], Error>> {
         let url = "https://readwise.io/api/v2/highlights/";

         const params = {
             page_size: "1000",
         };

         if (this.isValidTimestamp(since)) {
             Object.assign(params, {
                 updated__gt: this.dateFactory
                     .createHandler(since)
                     .utc()
                     .format(),
             });
         }

         if (this.isValidTimestamp(to)) {
             Object.assign(params, {
                 updated__lt: this.dateFactory.createHandler(to).utc().format(),
             });
         }

        url += "?" + new URLSearchParams(params);

        Log.debug(`Requesting ${url}`);

        try {
            const response = await fetch(url, {
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization: `Token ${this.token}`,
                }),
            });

            if (response.ok) {
                const content = await response.json();
                const highlights = Highlight.Parse(
                    content.results as IHighlight[]
                );
                if (highlights.length > 0) {
                    Log.debug(`Found ${highlights.length} new highlights`);
                } else {
                    Log.debug("No new highlights found");
                }
                return Result.Ok(highlights);
            } else {
                Log.debug(`The highlights API call at ${url} failed`);
            }

            return Result.Err(new Error(await response.text()));
        } catch (e) {
            return Result.Err(e);
        }
    }

    isValidTimestamp(timestamp?: number): boolean {
        return timestamp !== undefined && timestamp > 0;
    }
}
