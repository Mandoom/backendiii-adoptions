import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name:{
        type: String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        default:'user'
    },
    pets:{
        type:[
            {
                _id:{
                    type:mongoose.SchemaTypes.ObjectId,
                    ref:'Pets'
                }
            }
        ],
        default:[]
    },
    // <-- NUEVOS CAMPOS -->
    documents: {
        type: [{
            name: String,      // nombre del documento
            reference: String  // ruta al archivo subido
        }],
        default: []
    },
    last_connection: {
        type: Date,
        default: null       // se actualizará al hacer login/logout
    }
})

const userModel = mongoose.model(collection,schema);

export default userModel;