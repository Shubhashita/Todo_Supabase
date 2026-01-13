const validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(
                {
                    ...req.body,
                    ...req.params,
                    ...req.query,
                    // ...(req.user ? { userId: req.user.id } : {})
                }
            );

            if (error) {
                return res.status(400).json({
                    message: error.details[0].message
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                reason: error.message
            });
        }
    };
};

module.exports = { validate };
