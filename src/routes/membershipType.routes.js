const express = require("express");
const {
  createMembershipType,
  getMembershipsType,
  getMembershipType,
  deleteMembershipType,
  updateMembershipType,
} = require("../controllers/membershipType.controller");

const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware")
const {validatorSchema} = require("../middlewares/validator.middleware") 
const {createMembershipTypeSchema, updateMembershipTypeSchema} = require("../schemas/membershipType.schema")

//Creacion del router para poder navega
const router = express.Router();

//Rutas para el crud
//Rutas protegidas para solo admin
router.post("/membership-types", authMiddleware,adminMiddleware,validatorSchema(createMembershipTypeSchema), createMembershipType); //crea
router.delete("/membership-types/:id",authMiddleware,adminMiddleware, deleteMembershipType);//eliminar por id
router.put("/membership-types/:id",authMiddleware, adminMiddleware, validatorSchema(updateMembershipTypeSchema), updateMembershipType);//actualizar

//Rutas publicas
router.get("/membership-types", getMembershipsType);// obtener todas las membresias
router.get("/membership-types/:id", getMembershipType);//obtener una sola

module.exports = router;


