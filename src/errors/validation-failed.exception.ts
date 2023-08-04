import { ValidationError } from "class-validator";
import { BaseException } from "./base.exception";

import type { ValidationError as ClassValidatorValidationError } from "class-validator";

type IValidationError = Pick<
    ClassValidatorValidationError,
    "property" | "value" | "constraints" | "children"
>;

function formatValidationErrors(
    validationError: IValidationError
): IValidationError {
    return {
        property: validationError.property,
        ...(validationError.value && { value: validationError.value }),
        ...(validationError.constraints && {
            constraints: validationError.constraints,
        }),
        ...(validationError.children &&
            validationError.children.length !== 0 && {
                children: validationError.children.map((child) =>
                    formatValidationErrors(child)
                ),
            }),
    };
}
export class ValidationFailedException extends BaseException {
    constructor(message: string, errors: ValidationError[]) {
        super("VALIDATION_FAILED", message, errors.map(formatValidationErrors));
    }
}
