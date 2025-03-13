const { v2: cloudinary } = require("cloudinary");
require("dotenv").config(); // ✅ Cargar variables de entorno

// 🔧 Configurar Cloudinary
cloudinary.config({
  cloud_name: "dhkwkavdd",
  api_key: "672943187974484",
  api_secret: "WcLOL5t9xMi0MbM6Fns5tSaLbGc",
});

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "LOADED" : "NOT LOADED"
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

    console.log("✅ Imagen subida con éxito:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("❌ Error subiendo la imagen a Cloudinary:", error.message);
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
    console.error("❌ Error al eliminar imagen:", error.message);
    throw error;
  }
};


// ✅ Exportar la función
module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };
