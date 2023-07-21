import { BaseException } from "./base.exception";

export class UnauthorizedException extends BaseException {
    constructor() {
        super("UNAUTHORIZED", "Authorization failed");
    }
}
