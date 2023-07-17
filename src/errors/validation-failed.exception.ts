import { ValidationError } from "class-validator";
import { BaseException } from "./base.exception";

export class ValidationFailedException extends BaseException {
    constructor(message: string, errors: ValidationError[]) {
        super("VALIDATION_FAILED", message, errors);
    }
}
