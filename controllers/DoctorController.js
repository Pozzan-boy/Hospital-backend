import DoctorModel from '../models/Doctor.js';
import { validationResult } from 'express-validator';

export const getAllDoctors = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const doctors = await DoctorModel.find().skip(req.headers.from).limit(req.headers.count);

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

export const getDoctor = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const doctorId = req.params.id;

        const doctor = await DoctorModel.findById(doctorId);
        if(!doctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }

        return res.json(doctor);

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const searchDoctors = async (req, res) => {
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const numTypes =["age", "salary" , "height", "weight", "placeCount", "number", "floor"];
        const key = Object.keys(req.query)[0];
        if (numTypes.indexOf(key) !== -1) {
            req.query[key] = +req.query[key]
        } else {
            req.query[key] = {
                '$regex' : req.query[key], 
                '$options' : 'i'
            }
        }
        
        const doctors = await DoctorModel.find(req.query);

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({
                message: 'Doctors not found'
            })
        }

        return res.json(doctors);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const editDoctor = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const doctorId = req.params.id;

        DoctorModel.findOneAndUpdate(
            {
                _id: doctorId
            },
            {
                ...req.body
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Doctor not found'
                    });
                }

                res.json(doc);
            }
        );

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const deleteDoctor = async (req, res) => {

    try {
        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const doctorId = req.params.id;

        DoctorModel.findOneAndDelete(
            {
                _id: doctorId
            },
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Doctor not found'
                    });
                }

                UserModel.deleteMany(
                    {
                        key: doctorId
                    },
                    (err, doc) => {
                        if(err) {
                            console.log(err);
                            return res.status(500).json({
                                message: 'Error'
                            });
                        }
                })
                res.status(200).json(doc);
            }
        );

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const deleteManyDoctors = async (req, res) => {
    
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }
        
        const doctorsId = req.body.doctors;
        
        DoctorModel.deleteMany(
            {
                _id: {
                    $in: doctorsId
                }
            },
            (err, doc) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(doc.deletedCount === 0) {
                    return res.status(404).json({
                        message: 'Doctors not found'
                    });
                }

                UserModel.deleteMany(
                    {
                        key: {
                            $in: doctorsId
                        }
                    },
                    (err, doc) => {
                        if(err) {
                            console.log(err);
                            return res.status(500).json({
                                message: 'Error'
                            });
                        }
                })

                res.status(200).json(doc);
            }
        );

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}