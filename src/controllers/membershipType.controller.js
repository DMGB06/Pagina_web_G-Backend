const MembershipType = require("../models/membershipType.model");

//Crear una nueva membresía con validación para evitar duplicados
const createMembershipType = async (req, res) => {
  const { name, price, duration } = req.body;
  try {
    //Verificar si la membresía ya existe antes de crearla
    const existingMembership = await MembershipType.findOne({ name });
    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "Membership type already exists" });
    }

    const newMembershipType = new MembershipType({ name, price, duration});
    const savedMembershipType = await newMembershipType.save();

    res.status(200).json({  
      id: savedMembershipType._id,
      name: savedMembershipType.name,
      price: savedMembershipType.price,
      duration: savedMembershipType.duration,
      createdAt: savedMembershipType.createdAt
      
    });
  } catch (error) {
    console.error("Error creating membership type:", error);
    res.status(400).json({ message: "Error creating membership type", error });
  }
};

// Obtener todas las membresías (Usar 200 OK)
const getMembershipsType = async (req, res) => {
  try {
    const memberships = await MembershipType.find();
    res.status(200).json(memberships);
  } catch (error) {
    console.error("Error fetching memberships:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener una membresía por ID o por Nombre (Usar 200 OK)
const getMembershipType = async (req, res) => {
  try {
    const searchParam = req.params.id;
    let membershipType;

    if (searchParam.match(/^[0-9a-fA-F]{24}$/)) {
      membershipType = await MembershipType.findById(searchParam);
    } else {
      membershipType = await MembershipType.findOne({
        name: { $regex: searchParam, $options: "i" }
      });
    }

    if (!membershipType)
      return res.status(400).json({ message: "Membership type not found" });

    res.status(200).json(membershipType);

  } catch (error) {
    console.error("Error fetching membership type:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Actualizar una membresía (Usar 200 OK)
const updateMembershipType = async (req, res) => {
  try {
    const { name, price, duration } = req.body;

    const membershipType = await MembershipType.findById(req.params.id);
    if (!membershipType)
      return res.status(404).json({ message: "Membership type not found" });

    const updatedMembershipType = await MembershipType.findByIdAndUpdate(
      req.params.id,
      { name, price, duration },
      { new: true }
    );

    res.status(200).json({
      message: "Membership type updated successfully",
      updatedMembershipType,
    });
  } catch (error) {
    console.error("Error updating membership type:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Eliminar una membresía (Usar 200 OK)
const deleteMembershipType = async (req, res) => {
  try {
    const membershipType = await MembershipType.findById(req.params.id);

    if (!membershipType)
      return res.status(404).json({ message: "Membership type not found" });

    await MembershipType.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Membership type deleted successfully" });

  } catch (error) {
    console.error("Error deleting membership type:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMembershipType,
  getMembershipsType,
  getMembershipType,
  updateMembershipType,
  deleteMembershipType,
};
