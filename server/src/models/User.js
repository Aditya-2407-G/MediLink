import mongoose, {Schema} from "mongoose";

const userSchema  = new Schema({
    
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['doctor', 'user', 'admin'],
        default: 'user'
    },
    refreshToken:{
        type: String,
    }

})

export const User = mongoose.model('User', userSchema);