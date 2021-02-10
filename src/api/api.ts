import type { DateTime } from "luxon";
import { Result } from "../result";
import { debug, error } from "../log";
import fetch from "node-fetch";

export enum DocumentCategory {
    Article  = "articles",
    Tweet = "tweets"
}

export class ReadwiseApi {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async getUpdatedDocuments(category: DocumentCategory, since: DateTime): Promise<Result<Document[], Error>> {
        const url = new URL("https://readwise.io/api/v2/books/");
        const params = {
            category: category,
            page_size: '1000'
        };
        if (since !== undefined) {
            Object.assign(params, {updated__gt: since.toISO()});
        }
        url.search = new URLSearchParams(params).toString()

        debug(url.toString());

        try {
            const result = await fetch(url.toString(), {
                headers: {
                    Authorization: `Token ${this.token}`,
                    "Content-Type": "application/json",
                    Origin: 
                },
            });

            if (result.ok) {
                const documents = (await result.json()) as Document[];
                if (documents.length > 0) {
                    debug({message: "Found updated documents", context: documents});
                }
                else {
                    debug("There are no documents updated");
                }

                return Result.Ok(documents);
            }

            return Result.Err(new Error(await result.text()));
        }
        catch (e) {
            return Result.Err(e);
        }
    }

    defaultOptions(): object {
        return {

        };
    }

    headers(): Headers {
        return new Headers({
            Authorization: `Token ${this.token}`,
            "Content-Type": "application/json"
        });
    }
}