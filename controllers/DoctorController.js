import DoctorModel from '../models/Doctor.js';


export const getAllDoctors = async (req, res) => {
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const doctors = await DoctorModel.find();

        if(doctors != null && doctors.length > 0) {
            return res.status(200).json(doctors);
        }
        return res.status(404).json({
            message: 'Doctors not found'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}