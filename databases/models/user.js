import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    name : String,
    email: String,
    password: String,
    profileImage: String,
    authType : {
        type : String,
        enum : ['normal' , 'google'],
        default: 'normal'
    }
    
}, {
    timestamps: true,
});

export const UserModel = mongoose.model('User', userSchema);