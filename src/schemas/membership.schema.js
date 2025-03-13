const z = require("zod");

const createMembershipSchema = z.object({
  user: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de usuario inválido"), // Validación de ID

  membershipType: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de membresía inválido"), // Validación de ID de membresía

  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de inicio inválida",
    }) // Validación de fecha de inicio
    .optional(),

  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha de vencimiento inválida",
    }) // Validación de fecha de vencimiento
    .optional(), 
  status: z.enum(["Activa", "Expirada"]).default("Activa"), // Solo permite Activa o Expirada
});

module.exports = { createMembershipSchema };
