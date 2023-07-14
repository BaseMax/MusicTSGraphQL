import { BaseException } from "./base.exception";

export class AlreadyExistsException<K> extends BaseException {
    constructor(entity: string, key: K) {
        super("ALREADY_EXISTS", `entity ${entity} already exists `, { key });
    }
}
