export class TokenManager {

    localStorage: any;

    constructor(localStorage?: any) {
        this.localStorage = localStorage || window.localStorage;
    }

    TryGet(): [boolean, string] {
        const token = this.Get();

        if (token === null || token.length == 0) {
            return [false, null];
        }

        return [true, token];
    }

    Get(): string {
        return this.localStorage.getItem('readwise_token');
    }

    Upsert(token: string) {
        this.localStorage.setItem('readwise_token', token);
    }
}