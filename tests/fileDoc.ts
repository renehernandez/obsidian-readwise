import "mocha";
import { assert } from "chai";
import { FileDoc } from '../src/fileDoc';
import { HeaderTemplateRenderer, HighlightTemplateRenderer } from "../src/template";
import { fileSystemHandler } from "./helpers";

describe("File Doc", () => {
    const handler = fileSystemHandler();

    context("sanitizeName", () => {
        var fileDoc: FileDoc;

        beforeEach(async () => {
            fileDoc = new FileDoc({
                id: 1,
                title: "Hello_Worl'd-",
                author: 'Rene Hernandez',
                num_highlights: 2,
                highlights: null,
                source_url: '',
                updated: "2021-03-18",
                highlights_url: '',
                category: 'article'
            },
                await HeaderTemplateRenderer.create(null, handler),
                await HighlightTemplateRenderer.create(null, handler),
                handler
            );
        });

        it("value is not modified", () => {
            assert.equal(fileDoc.sanitizeName(), "Hello_Worl'd-");
        });

        it("replaces :", () => {
            fileDoc.doc.title = "Hello: World";

            assert.equal(fileDoc.sanitizeName(), 'Hello- World')
        });

        it("replaces \\", () => {
            fileDoc.doc.title = "Hello 1\\ World";

            assert.equal(fileDoc.sanitizeName(), 'Hello 1- World')
        });

        it("replaces /", () => {
            fileDoc.doc.title = "Hello/World";

            assert.equal(fileDoc.sanitizeName(), 'Hello-World')
        });

        it("Removes query params, slashes and protocol from URL (http and https)", () => {
            fileDoc.doc.title = "https://example.com/2021-04-26/article-name-12?foo=bar&key=value";

            assert.equal(fileDoc.sanitizeName(), "example_com-2021-04-26-article-name-12");

            fileDoc.doc.title = "http://example.com/2021-04-26/article-name-13?foo=bar&key=value";

            assert.equal(fileDoc.sanitizeName(), "example_com-2021-04-26-article-name-13");
        });
    });

    context('filePath', () => {
        let fileDoc: FileDoc;

        beforeEach(async () => {
            fileDoc = new FileDoc({
                id: 1,
                title: "Hello World",
                author: 'Rene Hernandez',
                num_highlights: 2,
                highlights: null,
                source_url: '',
                updated: "2021-03-18",
                highlights_url: '',
                category: 'article'
            },
            await HeaderTemplateRenderer.create(null, handler),
            await HighlightTemplateRenderer.create(null, handler),
            handler
            );
        });

        it("generates the fileDoc path if unspecified", () => {
            assert.equal(fileDoc.preparePath(), "Hello World.md");
        });

        it("generates a specified fileDoc path", () => {
            assert.equal(fileDoc.preparePath('foo/bar'), "foo/bar/Hello World.md");
        });

        it("Handles trailing slash in a specified fileDoc path", () => {
            assert.equal(fileDoc.preparePath('foo/bar/'), "foo/bar/Hello World.md");
        });

    });
});
