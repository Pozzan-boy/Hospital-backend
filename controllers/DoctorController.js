import DoctorModel from '../models/Doctor.js';
import { validationResult } from 'express-validator';

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

export const addDoctor = async (req, res) => {

    try {

        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const name = req.body.name;
        const surname = req.body.surname;
        const age = req.body.age;
        const speciality = req.body.speciality;
        const entryDate = req.body.entryDate;
        const salary = req.body.salary;
        const email = req.body?.email;
        const phone = req.body?.phone;

        const doc = new DoctorModel({
            name,
            surname,
            age,
            speciality,
            entryDate,
            salary,
            email,
            phone
        })

        const doctor = await doc.save();

        res.json(doctor); 

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}