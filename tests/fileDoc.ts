import "mocha";
import { assert } from "chai";
import { FileDoc } from '../src/fileDoc';
import { DateTime } from "luxon";
import { Template } from "../src/template";

describe("File Doc", () => {
    context("sanitizeName", () => {
        var fileDoc: FileDoc;

        beforeEach(function() {
            fileDoc = new FileDoc({
                id: 1,
                title: "Hello_Worl'd-",
                author: 'Rene Hernandez',
                num_highlights: 2,
                highlights: null,
                source_url: '',
                updated: DateTime.local().toISODate(),
                highlights_url: '',
                category: 'article'
            },
            new Template(null, null),
            null
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
});