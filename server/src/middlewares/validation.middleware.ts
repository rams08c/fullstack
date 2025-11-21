import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Generic validation middleware factory
 * @param dtoClass - The DTO class to validate against
 * @returns Express middleware function
 */
export function validationMiddleware<T extends object>(
    dtoClass: new () => T
) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Transform plain object to class instance
            const dtoInstance = plainToInstance(dtoClass, req.body);

            // Validate the instance
            const errors: ValidationError[] = await validate(dtoInstance, {
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
        } catch (error) {
            next(error);
        }
    };
}
