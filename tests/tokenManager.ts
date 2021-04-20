import "mocha";
import { assert } from "chai";
import { TokenManager } from '../src/tokenManager';
import { before } from "mocha";

class LocalStorageMock {
    returnsValue: boolean;
    constructor(returnsValue: boolean) {
        this.returnsValue = returnsValue;
    }

    getItem(name: string): string {
        if (this.returnsValue) {
            return "Hello World"
        }

        return null;
    }
}

describe("TokenManager", () => {
    var tokenManager: TokenManager;

    context('get returning value', () => {
        before(() => {
            tokenManager = new TokenManager(new LocalStorageMock(true));
        });

        it('it returns the stored value', () => {
            const token = tokenManager.get()

            assert.equal(token, "Hello World");
        });
    });

    context('get returning null', () => {
        before(() => {
            tokenManager = new TokenManager(new LocalStorageMock(false));
        });

        it('it returns the null', () => {
            const token = tokenManager.get()

            assert.equal(token, null);
        });
    });
})