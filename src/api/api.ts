import type { DateTime } from "luxon";
import { Result } from "../result";
import Log from "../log";
import fetch from "node-fetch";
import { ProxyServer } from "./proxy";

export enum DocumentCategory {
    Article  = "articles",
    Tweet = "tweets"
}

export class ReadwiseApi {
    private proxy: ProxyServer;

    constructor(token: string) {
        this.proxy = new ProxyServer(token);
    }

    async getUpdatedDocuments(category: DocumentCategory, since: DateTime): Promise<Result<Document[], Error>> {
        const params = {
            category: category,
            page_size: '1000'
        };
        if (since !== undefined) {
            Object.assign(params, {updated__gt: since});
        }

        try {
            const response = await this.proxy.get('books', params);

            if (response.ok) {
                const documents = (await response.json()) as Document[];
                if (documents.length > 0) {
                    Log.debug({message: "Found updated documents", context: documents});
                }
                else {
                    Log.debug("There are no documents updated");
                }

                return Result.Ok(documents);
            }

            return Result.Err(new Error(await response.text()));
        }
        catch (e) {
            return Result.Err(e);
        }
    }
}