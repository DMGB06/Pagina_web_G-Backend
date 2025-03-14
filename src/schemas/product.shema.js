const z = require("zod");

const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .trim(),

  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "El precio debe ser un número válido")
  ),

  stock: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "El stock debe ser un número válido")
  ),

  category: z.string().length(24, "ID de categoría inválido").trim(),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres")
    .trim(),

  image: z.string().url().optional(),
});

const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .trim(),

  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "El precio debe ser un número válido")
  ),

  stock: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "El stock debe ser un número válido")
  ),

  category: z.string().length(24, "ID de categoría inválido").trim(),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres")
    .trim(),

  image: z.string().url().optional(),
});

module.exports = { createProductSchema, updateProductSchema };
