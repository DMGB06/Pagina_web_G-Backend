const z = require("zod");

const createCategorySchema = z.object({
  name: z
    .string({
      required_error: "El nombre de la categoría es obligatorio",
    })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }) 
    .max(50, { message: "El nombre debe tener máximo 50 caracteres" }) 
    .trim(), 
});

module.exports = { createCategorySchema };
