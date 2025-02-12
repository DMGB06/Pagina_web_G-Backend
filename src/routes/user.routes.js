const express = require("express");
const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware.js");
const {getuser, getusers, deleteuser, updateuser} = require("../controllers/user.controller.js"); 

const router = express.Router();


router.get("/users/:id", authMiddleware, adminMiddleware, getuser)// ruta para obtener un usuario por id

router.get("/users", authMiddleware, adminMiddleware, getusers)//ruta para obtener todos los usuarios

router.delete("/users/:id", authMiddleware, adminMiddleware, deleteuser) // ruta para eliminar usuario

router.put("/users/:id", authMiddleware, updateuser) // ruta para editar usuario

module.exports = router;