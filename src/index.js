require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const cloudinary = require("./libs/cloudinary"); // Importa configuración de Cloudinary

const app = express();
const port = process.env.PORT || 3000;

// Importar rutas
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const membershipTypesRoutes = require("./routes/membershipType.routes.js");
const membershipsRoutes = require("./routes/membership.routes.js");
const categoryRoutes = require("./routes/category.routes.js");
const productRoutes = require("./routes/product.routes.js"); 
const orderRoutes = require("./routes/order.routes.js")

//   Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Configuración de subida de archivos
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/" // Carpeta temporal donde se almacenan archivos antes de subirlos
  })
);

//   Rutas
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", membershipTypesRoutes);
app.use("/api", membershipsRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes); 
app.use("/api", orderRoutes);

/*--   Conexión a la Base de Datos --*/
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((error) => console.error("Error de conexión:", error));

// --   Iniciar el Servidor --
app.listen(port, () => console.log(`🔥 Servidor corriendo en http://localhost:${port}`));
