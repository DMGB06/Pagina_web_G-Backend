const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Evita espacios innecesarios
  },
  price: {
    type: Number,
    required: true, 
    min: 0, // No puede haber precios negativos
  },
  stock: {
    type: Number,
    required: true, 
    min: 0, // No puede haber stock negativo
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Llamado para coincidir con el llamado de Category
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaCYt_Skg_DdS56k7TJ6K6bjyh2l-8W_3_WA&s",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Para le fecha de creacion
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
