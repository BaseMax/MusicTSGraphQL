export class BaseException extends Error {
    constructor(
        public readonly code: string,
        public readonly message: string,
        public readonly data?: any,
        public readonly base?: Error
    ) {
        new Error();
        super(message);
    }
}
