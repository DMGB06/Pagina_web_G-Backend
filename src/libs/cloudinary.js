const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET
);

/**
 * 📤 Subir imagen a Cloudinary
 * @param {string} filePath - Ruta del archivo local
 * @returns {Promise<string|null>} URL de la imagen subida o `null` si hay error
 */
const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      console.error("No se proporcionó una ruta de archivo.");
      return null;
    }

    console.log("Subiendo imagen desde:", filePath);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "Prueba",
      resource_type: "image", 
      use_filename: true,
      unique_filename: false,
    });

    console.log("Imagen subida con éxito:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error subiendo la imagen a Cloudinary:", error.message);
    return null;
  }
};



const deleteImageFromCloudinary = async (imageUrl, folder = "products") => {
  try {
    if (!imageUrl) return;

    const publicId = imageUrl
      .split("/")
      .pop()
      .split(".")[0]; // Saca el public_id de la URL

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch (error) {
    console.error("Error al eliminar imagen:", error.message);
    throw error;
  }
};


// Exportar la función
module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };
