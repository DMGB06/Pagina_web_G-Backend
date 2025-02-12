const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");
const User = require("../models/user.model.js");

// Middleware para verificar si el usuario está autenticado (Tiene un token válido)
// next es para decir que continue
const authMiddleware = (req, res, next) => {
  try {
    // Verificar si req.cookies existe antes de acceder a token
    const token =
      (req.cookies ? req.cookies.token : null) ||
      (req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({ error: "Acceso denegado. No hay token." });
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
};

// Middleware para verificar si el usuario es Admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Acceso denegado. Se requiere rol de administrador." });
    }

    next(); // El usuario es admin, continúa con la ejecución
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
};

module.exports = { authMiddleware, adminMiddleware };
  