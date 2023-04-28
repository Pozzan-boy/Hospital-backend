import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    }
},
{
    timestamps: true
});

export default mongoose.model('Patient', PatientSchema);