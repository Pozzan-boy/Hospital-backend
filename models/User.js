import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: false,
        unique: true
    },
    role: {
        type: String,
        required: true
    }
}, 
{
    timestamps: true,
});

export default mongoose.model('User', UserSchema);