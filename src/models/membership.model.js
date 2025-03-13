const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    membershipType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipType",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Activa", "Expirada"],
      required: true,
      default: "Activa",
    },
  },
  {
    timestamps : true //actualiza automaticamente los creatAt y el updateAt
  }
);

const Membership = mongoose.model("Membership", membershipSchema)
module.exports = Membership // asi se exporta