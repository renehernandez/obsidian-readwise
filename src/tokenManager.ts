export class TokenManager {

    localStorage: any;

    constructor(localStorage?: any) {
        this.localStorage = localStorage || window.localStorage;
    }

    get(): string {
        const token = this.localStorage.getItem('readwise_token');

        if (token === null || token.length == 0) {
            return null;
        }

        return token;
    }

    upsert(token: string) {
        this.localStorage.setItem('readwise_token', token);
    }
}