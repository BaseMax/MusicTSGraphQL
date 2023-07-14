import { BaseException } from "./base.exception";

export class NotFoundException<L> extends BaseException {
    constructor(entity: string, locator?: L) {
        super("NOT_FOUND", `${entity} not found`, { locator });
    }
}
