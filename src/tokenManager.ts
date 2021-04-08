export class TokenManager {

    localStorage: any;

    constructor() {
        this.localStorage = (window as any).localStorage;
    }

    Get(): string {
        return this.localStorage.getItem('readwise_token');
    }

    Upsert(token: string) {
        this.localStorage.setItem('readwise_token', token);
    }
}