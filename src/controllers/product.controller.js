const Product = require("../models/product.model");
const cloudinary = require("../libs/cloudinary"); // AdminPage Importar configuración de Cloudinary
const fs = require("fs-extra"); // AdminPage Para eliminar archivos temporales
const Category = require("../models/category.model"); //Asegurar que se usa `v2`
require("dotenv").config(); // Cargar variables de entorno
const mongoose = require("mongoose");

const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../libs/cloudinary"); // Importa la función

const { createProductSchema } = require("../schemas/product.shema");

const createProduct = async (req, res) => {
  try {
    // AdminPage Convierte los valores ANTES de validarlos
    req.body.price = Number(req.body.price);
    req.body.stock = Number(req.body.stock);

    if (isNaN(req.body.price) || isNaN(req.body.stock)) {
      return res.status(400).json({
        error: ["El precio y el stock deben ser números válidos"],
      });
    }

    // AdminPage Primero validamos los datos
    const validatedData = createProductSchema.parse(req.body);
    console.log("AdminPage Datos validados:", validatedData);

    let imageUrl = null;

    if (req.files && req.files.image) {
      const uploadedImage = await uploadImageToCloudinary(
        req.files.image.tempFilePath
      );

      if (uploadedImage) {
        imageUrl = uploadedImage;
      } else {
        console.log("AdminPage Error: Cloudinary devolvió un resultado vacío");
      }
    } else {
      console.log("AdminPage No se recibió ninguna imagen");
    }

    // AdminPage Revisamos si el producto ya existe antes de crearlo
    const existProduct = await Product.findOne({ name: validatedData.name });
    if (existProduct) {
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese nombre" });
    }

    // AdminPageCrear el producto asegurando que siempre tenga un campo de imagen
    const newProduct = new Product({
      ...validatedData,
      image: imageUrl || "", // AdminPage Si no hay imagen, guarda un string vacío en lugar de null
    });

    console.log("AdminPageGuardando en la base de datos:", newProduct);

    const savedProduct = await newProduct.save();

    res.status(200).json({
      message: "Producto creado exitosamente",
      product: savedProduct,
    });
  } catch (error) {
    console.error("AdminPage Error creando producto:", error);
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    if (product.image) {
      await deleteImageFromCloudinary(product.image, "Prueba");
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    
    const { id } = req.params;
    const { name, price, stock, category, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    let imageUrl = product.image;

    // Si hay nueva imagen, subimos y eliminamos la anterior
    if (req.files && req.files.image) {
      // Elimina la imagen anterior de Cloudinary si existe
      if (product.image) {
        await deleteImageFromCloudinary(product.image, "Prueba");
      }

      // Subimos la nueva imagen
      imageUrl = await uploadImageToCloudinary(req.files.image.tempFilePath);
    }

    // Actualizamos el producto
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        stock,
        category,
        description,
        image: imageUrl,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Producto actualizado correctamente",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const product = await Product.findById(id).populate({
      path: "category",
      select: "name",
    });

    if (!product) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "category",
      select: "name",
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
};
