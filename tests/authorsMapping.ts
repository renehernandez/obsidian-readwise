import "mocha";
import { assert } from "chai";
import { AuthorsMapping } from "../src/authorsMapping";
import { fileSystemHandler, resolvePathToData } from "./helpers";

describe("AuthorsMapping", () => {
    const handler = fileSystemHandler();

    context("load", () => {
        it('loads the authors data into object', async () => {
            const authorsMapping = new AuthorsMapping('authors.json', handler);
            await authorsMapping.initialize();
            const mapping = await authorsMapping.load();

            assert.equal(mapping.get("perell.com"), "David Perell");
        });
    });
});