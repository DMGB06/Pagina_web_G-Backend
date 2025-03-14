require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require('fs');

const cloudinary = require("./libs/cloudinary");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Asegurarse que existe la carpeta tmp
if (!fs.existsSync('./tmp')) {
  fs.mkdirSync('./tmp');
}

// Upload config
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "./tmp/"
}));

// Rutas
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/membershipType.routes"));
app.use("/api", require("./routes/membership.routes"));
app.use("/api", require("./routes/category.routes"));
app.use("/api", require("./routes/product.routes"));
app.use("/api", require("./routes/order.routes"));

// DB Connect
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((error) => {
    console.error(" Error de conexión a MongoDB:", error);
    process.exit(1);
  });

// Server Listen
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
