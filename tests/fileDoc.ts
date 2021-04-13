import "mocha";
import { assert } from "chai";
import { FileDoc } from '../src/fileDoc';
import { Template } from "../src/template";
import type { IFileSystemHandler } from "../src/fileSystem";

describe("File Doc", () => {
    const handler: IFileSystemHandler = {
        getBasePath: () => "/base",
        normalizePath: (path: string) => path,
        read: async (path: string) => "",
        write: async (path: string) => {},
        exists: async (path: string) => true
    }

    context("sanitizeName", () => {
        var fileDoc: FileDoc;

        beforeEach(() => {
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
            new Template(null, handler),
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
    });

    context('filePath', () => {
        let fileDoc: FileDoc;

        beforeEach(() => {
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
            new Template(null, handler),
            handler
            );
        });

        it("generates the fileDoc path", () => {
            assert.equal(fileDoc.filePath(), "/base/Hello World.md");
        });
    });
});