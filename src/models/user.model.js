const mongoose = require("mongoose");       

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        trim: true },
    email: { 
        type: String, 
        required: true,     
        trim: true, 
        unique: true },
    password: { 
        type: String, 
        required: true },
    role: { 
        type: String, 
        enum: ["cliente", "admin"], 
        default: "cliente" },
    membership:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "memberships",
        default: null
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User; // asi se exporta