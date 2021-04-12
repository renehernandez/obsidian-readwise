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

    context('TryGet returning value', () => {
        before(() => {
            tokenManager = new TokenManager(new LocalStorageMock(true));
        });

        it('it returns the stored value', () => {
            let [found, token] = tokenManager.TryGet()

            assert.equal(token, "Hello World");
            assert.isTrue(found);
        });
    });

    context('TryGet returning nulls', () => {
        before(() => {
            tokenManager = new TokenManager(new LocalStorageMock(false));
        });

        it('it returns the null', () => {
            let [found, token] = tokenManager.TryGet()

            assert.equal(token, null);
            assert.isFalse(found);
        });
    });
})