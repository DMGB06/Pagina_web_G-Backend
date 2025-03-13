const  Membership = require("../models/membership.model");
const User = require("../models/user.model");
const MembershipType = require("../models/membershipType.model");

// Crear una nueva membresía y asignarla al usuario
const createMembership = async (req, res) => {
  try {
    const { user, membershipType, startDate } = req.body;

    // Verificar si el usuario existe
    const existingUser = await User.findById(user);
    if (!existingUser) return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificar si el tipo de membresía existe
    const existingMembershipType = await MembershipType.findById(membershipType);
    if (!existingMembershipType) return res.status(404).json({ message: "Tipo de membresía no encontrado" });

    // Calcular fechas
    const start = startDate ? new Date(startDate) : new Date();
    const durationInDays = existingMembershipType.duration * 30;
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + durationInDays);

    // Crear la membresía
    const newMembership = new Membership({
      user,
      membershipType,
      startDate: start,
      endDate,
      status: "Activa",
    });

    // 💾 Guardar la membresía en MongoDB
    await newMembership.save();

    // 🔄 **Actualizar el usuario con el ID de la membresía**
    existingUser.membership = newMembership._id;
    await existingUser.save();

    res.status(200).json({
      message: "Membresía creada con éxito y asignada al usuario",
      membership: newMembership,
    });

  } catch (error) {
    console.error("❌ ERROR AL CREAR MEMBRESÍA:", error);
    res.status(500).json({ message: "Error al crear la membresía", error: error.message });
  }
};


// Obtener todas las membresías (solo Admins)
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate("user membershipType");
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las membresías", error });
  }
};

// Obtener la membresía del usuario autenticado
const getUserMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ user: req.user.id }).populate("membershipType");
    if (!membership) return res.status(404).json({ message: "No tienes una membresía activa" });

    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la membresía", error });
  }
};

// Eliminar una membresía (solo Admins)
const deleteMembership = async (req, res) => {
  try {
    // 🔍 Buscar la membresía antes de eliminarla
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: "Membresía no encontrada" });

    // Eliminar la referencia en el usuario**
    await User.findByIdAndUpdate(membership.user, { membership: null });

    // Eliminar la membresía**
    await Membership.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Membresía eliminada con éxito y actualizada en el usuario" });

  } catch (error) {
    console.error("❌ ERROR AL ELIMINAR MEMBRESÍA:", error);
    res.status(500).json({ message: "Error al eliminar la membresía", error });
  }
};


module.exports = {
  createMembership,
  getAllMemberships,
  getUserMembership,
  deleteMembership,
};
