const { ZodError } = require("zod");

const validatorSchema = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema || typeof schema.parse !== "function") {
        console.error("Schema inválido o no definido en validatorSchema.");
        return res.status(500).json({ message: "Error interno de validación. Schema inválido." });
      }

      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          errors: error.errors.map((err) => err.message),
        });
      }

      console.error("Error no manejado en validatorSchema:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };
};

module.exports = { validatorSchema };
