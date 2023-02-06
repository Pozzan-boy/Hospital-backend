import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    entryDate: {
        type: String,
        required: true
    },
    salary: {
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

export default mongoose.model('Doctor', DoctorSchema);