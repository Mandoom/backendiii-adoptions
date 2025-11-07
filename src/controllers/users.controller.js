import { usersService } from "../services/index.js"
// uplaoder
import uploader from '../utils/uploader.js'; 

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
}
const uploadDocuments = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    // req.files contiene un array de archivos subidos
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ status: "error", error: "No documents uploaded" });
    }

    // Construye un array de objetos { name, reference } a partir de los archivos
    const newDocs = req.files.map(file => ({
        name: file.originalname,
        reference: file.path   // ruta absoluta o relativa al archivo
    }));

    // Combina con los documentos existentes
    const updatedDocs = (user.documents || []).concat(newDocs);

    await usersService.update(userId, { documents: updatedDocs });
    return res.send({ status: "success", message: "Documents uploaded", payload: newDocs });
};

export default {
    // ... otros métodos
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadDocuments
};