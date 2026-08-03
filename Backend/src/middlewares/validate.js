/**
 * Validation middleware using Zod.
 * @param {import('zod').ZodSchema} schema 
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors
      }
    });
  }
};
