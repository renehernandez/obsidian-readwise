import "mocha";
import { assert } from "chai";
import { AuthorsMapping } from "../src/authorsMapping";
import { fileSystemHandler, resolvePathToData } from "./helpers";

describe("AuthorsMapping", () => {
    const handler = fileSystemHandler();

    context("load", () => {
        it('loads the authors data into object', async () => {
            const mapping = new AuthorsMapping(resolvePathToData('authors.json'), handler);

            const obj = await mapping.load()
            console.log("Obj:", obj);

            assert.equal(obj.get("perell.com"), "David Perell");
        });
    });
});