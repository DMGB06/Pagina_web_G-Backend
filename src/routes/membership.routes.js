const express = require("express");

const {createMembership,getAllMemberships,getUserMembership,deleteMembership,} = require("../controllers/memberships.controller");

const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const { validatorSchema } = require("../middlewares/validator.middleware");
const { createMembershipSchema } = require("../schemas/membership.schema");

// Creación del router para gestionar membresías
const router = express.Router();

// rutas protegidas (solo Admins)
router.post("/memberships", authMiddleware, adminMiddleware, validatorSchema(createMembershipSchema), createMembership); // Crear nueva membresía
router.delete("/memberships/:id", authMiddleware, adminMiddleware, deleteMembership); // Eliminar una membresía
// rutas públicas
router.get("/memberships", authMiddleware, adminMiddleware, getAllMemberships); // Obtener todas las membresías (Solo admins)
router.get("/memberships/user", authMiddleware, getUserMembership); // Obtener la membresía del usuario autenticado

module.exports = router;
