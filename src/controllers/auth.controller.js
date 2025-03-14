const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createAccesToken } = require("../libs/jwt.js");
const { TOKEN_SECRET } = require("../config.js");

const register = async (req, res) => {
  const { username, email, password, role, membership } = req.body;

  try {
    // Verificar si el email ya está en uso
    const existgUser = await User.findOne({ email });

    if (existgUser) {
      return res.status(400).json(["The email is already in use"]);
    }
    // Encriptar la contraseña
    const passwordhash = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: passwordhash,
      role,
      membership,
    });

    const userSaved = await newUser.save(); // Guardar en la base de datos

    // Crear token con el ID del usuario

    const token = await createAccesToken({ id: userSaved._id });
    // Enviar el token en las cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo usa secure en producción
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None para cross-origin (Vercel + Render)
    });
    
    // Enviar datos al frontend
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: userSaved.role,
      membership: userSaved.membership,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(["Server error"]);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find a user
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json(["User not found"]);

    //Compare user password
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json(["Incorrect password"]);

    // find a user token
    const token = await createAccesToken({ id: userFound._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo usa secure en producción
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // None para cross-origin (Vercel + Render)
    });
    
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      membership: userFound.membership,
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  
  
  return res.status(200).json({ message: "Sesión cerrada exitosamente" });
};


const profile = (req, res) => {
  res.send("profile");
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No autorizado" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No autorizado" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "No encontrado" });
  
    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
    });   
  });
};

module.exports = { register, login, logout, profile, verifyToken};