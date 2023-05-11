import mongoose from "mongoose";

const HealingSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward',
        required: false
    },
    diagnos: {
        type: String,
        required: true
    },
    diagnosDescription: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    preparations: {
        type: [String],
        required: false
    },
    healingInstruction: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export default mongoose.model('Healing', HealingSchema);