import { BaseException } from "./base.exception";

export class PermissionDeniedException extends BaseException {
    constructor(message: string, availableFor?: any) {
        super("PERMISSION_DENIED", message, availableFor);
    }
}
