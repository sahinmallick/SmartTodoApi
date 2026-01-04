export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Received data is not valid",
      errors: error.errors,
    });
  }
};
