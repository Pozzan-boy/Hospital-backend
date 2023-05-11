import mongoose from "mongoose";

const WardSchema = new mongoose.Schema({
    number: {
        type: Number,
        validate: {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        },
        required: true
    },
    floor: {
        type: Number,
        validate: {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        },
        required: true
    },
    department: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    placeCount: {
        type: Number,
        validate: {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        },
        required: true
    },
    chief: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false
    }
},
{
    timestamps: true
});

export default mongoose.model('Ward', WardSchema);