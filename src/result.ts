export class Result<T, E> {
    private ok?: T;
    private error?: E;

    static Capture<T>(closure: () => T): Result<T, Error> {
        try {
            return Result.Ok<T, Error>(closure());
        } catch (e) {
            return Result.Err<T, Error>(e);
        }
    }

    static Ok<T, E>(value: T): Result<T, E> {
        let result = new Result<T, E>();
        result.ok = value;
        return result;
    }

    static Err<T, E>(err: E): Result<T, E> {
        let result = new Result<T, E>();
        result.error = err;
        return result;
    }

    static All<T, E>(...results: Result<T[], E>[]): Result<T[], E> {
        results.forEach(result => {
            if (result.isErr()) {
                return result.intoErr()
            }
        });

        let merged: T[] = results.flatMap(result => result.unwrap());

        return Result.Ok(merged);
    }

    public isOk(): boolean {
        return this.ok != null;
    }

    public isErr(): boolean {
        return this.error != null;
    }

    public unwrap(): T {
        if (!this.isOk()) {
            throw new Error("Called 'unwrap' on a Result with an error.");
        }

        return this.ok;
    }

    public unwrapErr(): E {
        if (!this.isErr()) {
            throw new Error("Called 'unwrapErr' on a Result with a value.");
        }

        return this.error;
    }

    public map<U>(func: (ok: T) => U): Result<U, E> {
        if (this.isOk()) {
            return Result.Ok<U, E>(func(this.ok));
        } else {
            return this.intoErr<U>();
        }
    }

    public unwrapOr(val: T): T {
        return this.isOk() ? this.ok : val;
    }

    public intoErr<T2>(): Result<T2, E> {
        return Result.Err(this.error);
    }
  }