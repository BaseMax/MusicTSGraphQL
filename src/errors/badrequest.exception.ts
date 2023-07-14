import { BaseException } from "./base.exception";

export class BadRequestException extends BaseException {
    constructor(message: string, data?: any) {
        super("BAD_REQUEST", message, data);
    }
}
