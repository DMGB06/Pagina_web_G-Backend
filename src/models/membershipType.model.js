const mongoose = require("mongoose");

const membershipType = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true, 
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }   
});

const MembershipType = mongoose.model("MembershipType", membershipType)
module.exports = MembershipType