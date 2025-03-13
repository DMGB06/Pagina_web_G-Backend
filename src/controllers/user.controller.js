const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const Membership = require("../models/membership.model");
const MembershipType = require("../models/membershipType.model");
const { createAccesToken } = require("../libs/jwt.js");
const { TOKEN_SECRET } = require("../config.js");

// obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Ocultamos la contraseña
      .populate({
        path: "membership",
        populate: {
          path: "membershipType",
          select: "name price duration",
        },
        select: "startDate endDate status",
      });

    // Aquí aseguramos que siempre devuelva un objeto válido aunque no tenga membresía
    const sanitizedUsers = users.map((user) => ({
      ...user.toObject(),
      membership: user.membership || null, // Si no tiene, enviamos `null`
    }));

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error("🔥 Error fetching users: ", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//obtener un usuario por id
const getuser = async (req, res) => {
  try {
    const searchParam = req.params.id; // Puede ser ID, email o nombre
    let user;

    // Si el parámetro parece un ID de MongoDB (24 caracteres hexadecimales)
    if (searchParam.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(searchParam)
        .select("-password")
        .populate({
          path: "membership",
          populate: {
            path: "membershipType",
            select: "name price duration",
          },
          select: "startDate endDate status",
        });
    }
    // Si el parámetro contiene un "@" lo tratamos como un email
    else if (searchParam.includes("@")) {
      user = await User.findOne({ email: searchParam })
        .select("-password")
        .populate({
          path: "membership",
          populate: {
            path: "membershipType",
            select: "name price duration",
          },
          select: "startDate endDate status",
        });
    }
    // Si no es un ID ni un email, lo tratamos como un nombre (búsqueda parcial)
    else {
      user = await User.findOne({
        username: { $regex: searchParam, $options: "i" },
      })
        .select("-password")
        .populate({
          path: "membership",
          populate: {
            path: "membershipType",
            select: "name price duration",
          },
          select: "startDate endDate status",
        });
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete user
const deleteuser = async (req, res) => {
  try {
    const searchParam = req.params.id; // puede ser id, email o nombre
    let user;

    //busca si es un id
    if (searchParam.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findByIdAndDelete(searchParam);
    }
    // si no es un id lo tratamos de buscar como un email
    else if (searchParam.includes("@")) {
      user = await User.findOneAndDelete({ email: searchParam });
    }
    // si no es ni un id ni un email se le trata como un nombre
    else {
      user = await User.findOneAndDelete({ username: searchParam });
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error({ message: "Error deleting user", error });
    res.status(500).json({ message: "Server error" });
  }
};

const createUser = async (req, res) => {
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
    //const token = await createAccesToken({ id: userSaved._id });

    // Enviar el token en las cookies
    //res.cookie("token", token);

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

// update user

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "La contraseña actual es incorrecta" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({ message: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = { createUser, getuser, getUsers, deleteuser, updateUser };
