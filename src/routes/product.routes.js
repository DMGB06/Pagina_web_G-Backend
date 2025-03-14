const express = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
} = require("../controllers/product.controller");
const { validatorSchema } = require("../middlewares/validator.middleware");
const { createProductSchema, updateProductSchema } = require("../schemas/product.shema");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Crear un producto (solo admin)
router.post("/products", authMiddleware, adminMiddleware, validatorSchema(createProductSchema), createProduct);

// Obtener todos los productos (cualquier usuario autenticado)
router.get("/products", getProducts);

// Obtener un producto por ID (cualquier usuario autenticado)
router.get("/products/:id", authMiddleware, getProduct);

// Actualizar un producto (solo admin)
router.put("/products/:id", authMiddleware, adminMiddleware,validatorSchema(updateProductSchema), updateProduct);

// eliminar un producto (solo admin)
router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
