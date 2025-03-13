const express = require("express");
const {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  getCategory
} = require("../controllers/category.controller");

const { validatorSchema } = require("../middlewares/validator.middleware");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const { createCategorySchema } = require("../schemas/category.schema"); // Corregido: Ahora usa el esquema correcto

const router = express.Router(); 


// Crear una nueva categoría (Solo Admins)
router.post(
  "/category",
  validatorSchema(createCategorySchema), // Validación de datos
  authMiddleware,
  adminMiddleware,
  createCategory
);

// Obtener todas las categorías
router.get("/category", getCategories);

// Obtener una categoría por ID
router.get("/category/:id", getCategory);

// Actualizar una categoría (Solo Admins)
router.put(
  "/category/:id",
  validatorSchema(createCategorySchema),
  authMiddleware,
  adminMiddleware,
  updateCategory
);

// esliminar una categoría (Solo Admins)
router.delete("/category/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router; 
