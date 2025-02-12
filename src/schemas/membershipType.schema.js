const z = require("zod");

// Schema para CREAR una membresía (POST)
const createMembershipTypeSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long"),

  price: z
    .number({
      required_error: "Price is required",
    })
    .min(0, "Price must be at least 0"),

  duration: z
    .number({
      required_error: "Duration is required",
    })
    .min(1, "Duration must be at least 1 day"),
});

// Schema para ACTUALIZAR una membresía (PUT)
const updateMembershipTypeSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long")
    .optional(),
  price: z.number().min(0, "Price must be at least 0").optional(),
  duration: z.number().min(1, "Duration must be at least 1 day").optional(),
});

module.exports = {
  createMembershipTypeSchema,
  updateMembershipTypeSchema
};
