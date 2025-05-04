export const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parse(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
};
