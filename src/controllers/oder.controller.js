const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model.js");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (!userId) return res.status(401).json({ message: "No autorizado" });

    const { products } = req.body;

    let totalPrice = 0;
    const cartItems = [];

    for (let item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${item.product} no encontrado.`,
        });
      }

      if (product.stock <= item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Lo sentimos no hay stock suficiente para ${product.name}`,
        });
      }

      totalPrice += product.price * item.quantity;

      cartItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      user: userId,
      products: cartItems,
      totalPrice,
      status: "Pagado",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la orden",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user products.product");

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener todas las órdenes", error });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    console.log(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener tus órdenes",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userId = req.user.id;

    const order = await Order.findById(req.params.id)
      .populate("products.product")                // Popula los productos
      .populate("user", "username email");       

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    const isAdmin = user.role === "admin";
    const isOwner = order.user.id.toString() === userId.toString();

    console.log(isAdmin)
    
    if(isAdmin){
      return res.json(order);
   }

    if (!isOwner ) {
      return res.status(403).json({ 
        message: "No tienes permiso para ver esta orden"})
    }

    res.json(order)

  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta orden" });
    }

    // OJO: Si eliminas la orden, quizá quieras devolver el stock
    for (let item of order.products) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }

    await Order.findByIdAndDelete(order._id);

    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
};

// Exportación de funciones
module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  deleteOrder,
};
