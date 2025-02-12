const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { search, trace } = require("../routes/user.routes");

// obtener todos los usuarios
const getusers = async (req, res) => {
    try {
        const user = await User.find().select("-password")
        res.json(user)
    } catch (error) {
        console.error("Error feching users: ", error);
        res.status(500).json({message: " Server error"})
    }
};

//obtener un usuario por id
const getuser = async (req, res) =>{
    try {
        const searchParam = req.params.id; // Puede ser ID, email o nombre
        let user;

        // Si el parámetro parece un ID de MongoDB (24 caracteres hexadecimales)
        if (searchParam.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(searchParam).select("-password");
        } 
        // Si el parámetro contiene un "@" lo tratamos como un email
        else if (searchParam.includes("@")) {
            user = await User.findOne({ email: searchParam }).select("-password");
        } 
        // Si no es un ID ni un email, lo tratamos como un nombre (búsqueda parcial)
        else {
            user = await User.findOne({ username: { $regex: searchParam, $options: "i" } }).select("-password");
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
        const searchParam  = req.params.id; // puede ser id, email o nombre
        let user;
        
        //busca si es un id 
        if(searchParam.match(/^[0-9a-fA-F]{24}$/)){
            user = await User.findByIdAndDelete(searchParam)
        }
        // si no es un id lo tratamos de buscar como un email
        else if(searchParam.includes("@")){
            user = await User.findOneAndDelete({email:  searchParam })
        }
        // si no es ni un id ni un email se le trata como un nombre
        else {
            user = await User.findOneAndDelete({username: searchParam})
        }
    
        if (!user) return res.status(400).json({ message: "User not found" });
        
        res.json({ message: "User deleted successfully", user });

    } catch (error) {
        console.error({message: "Error deleting user", error})
        res.status(500).json({ message: "Server error"})
    }
};

// update user 
const updateuser = async (req, res) => {
    try {
        const {email, password} = req.body; // se requiere para poder tanto comparar el email y hashear la

        // primero se busca por el id para luego ver si existe el email
        const user = await User.findById(req.params.id)
        if(!user) return res.status(400).json({message: "user not found"})

        // es para evitar que el email se duplique si lo esta modificando
        if(email && email !== user.email){
            const emailexisting = await User.findOne({email});
            if(emailexisting){return res.status(400).json({message: "email ya existente"})}
        }    
    
        //hashear la contraseña si esque esta modificando la contraseña
        if (password){
            req.body.password = await bcrypt.hash(password, 10);
        }

        //se actualiza ya con todos los parametros
        const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    
        res.json({message:"Usuario actualizado correctamente", userUpdate})
    } catch (error) {
        console.error({message: "Error updating user: ", error})
        res.status(500).json({message: "Server Error"})
    }
}; 
 
module.exports = { getuser, getusers, deleteuser, updateuser };