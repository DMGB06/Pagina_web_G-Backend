const Category = require("../models/category.model");
const Product = require("../models/product.model");

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const existCategory = await Category.findOne({ name: name.trim().toLowerCase() });

    if (existCategory) {
      return res.status(400).json({ message: "Ya existe la categoría" });
    }

    const newCategory = new Category({
      name: name.trim().toLowerCase(),
    });

    const categorySave = await newCategory.save();

    res.status(200).json({
      id: categorySave._id,
      name: categorySave.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const productsInCategory = await Product.exists({ category: id });
    if (productsInCategory) {
      return res.status(400).json({
        message: "No se puede eliminar esta categoría porque está asignada a uno o más productos",
      });
    }

    await Category.findByIdAndDelete(id);
    
    res.json({ message: "Categoría eliminada correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }

    // Verifica si ya existe una categoría con el mismo nombre
    const existNameCategory = await Category.findOne({ name: name.trim().toLowerCase() });
    if (existNameCategory && existNameCategory._id.toString() !== id) {
      return res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
    }

    const categoryUpdate = await Category.findByIdAndUpdate(
      id,
      { name: name.trim().toLowerCase() },
      { new: true }
    );

    if (!categoryUpdate) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
 
    res.json({
      message: "Categoría actualizada correctamente",
      category: categoryUpdate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "No se encontró la categoría" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories.length > 0 ? categories : []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { createCategory, deleteCategory, updateCategory, getCategory, getCategories };
