"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Generic validation middleware factory
 * @param dtoClass - The DTO class to validate against
 * @returns Express middleware function
 */
function validationMiddleware(dtoClass) {
    return async (req, res, next) => {
        try {
            // Transform plain object to class instance
            const dtoInstance = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
            // Validate the instance
            const errors = await (0, class_validator_1.validate)(dtoInstance, {
                whitelist: true, // Strip properties that don't have decorators
                forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
                skipMissingProperties: false,
            });
            if (errors.length > 0) {
                // Format validation errors
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    constraints: error.constraints,
                    value: error.value,
                }));
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
                return;
            }
            // Replace req.body with validated instance
            req.body = dtoInstance;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
