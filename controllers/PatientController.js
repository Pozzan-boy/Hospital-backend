import PatientModel from '../models/Patient.js';
import UserModel from '../models/User.js';
import { validationResult } from 'express-validator';

export const getAllPatients = async (req, res) => {
    try {
        if (req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const patients = await PatientModel.find().skip(req.headers.from).limit(req.headers.count);

        if (patients != null && patients.length > 0) {
            return res.status(200).json(patients);
        }
        return res.status(404).json({
            message: 'Patients not found'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const addPatient = async (req, res) => {
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
        const birthDate = req.body.birthDate;
        const sex = req.body.sex;
        const height = req.body.height;
        const weight = req.body.weight;
        const email = req.body?.email;
        const phone = req.body?.phone;

        const doc = new PatientModel({
            name,
            surname,
            birthDate,
            sex,
            height,
            weight,
            email,
            phone
        })

        const patient = await doc.save();

        res.json(patient);

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const getPatient = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'patient' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const patientId = req.params.id;

        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        return res.json(patient);

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const getMyInfo = async (req, res) => {
    try {
        if(req.role !== 'patient') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const patientId = req._key;
        console.log(patientId);

        const patient = await PatientModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                message: 'Patient not found'
            });
        }

        return res.json(patient);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const searchPatients = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
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
        
        const patients = await PatientModel.find(req.query);

        if (!patients || patients.length === 0) {
            return res.status(404).json({
                message: 'Patients not found'
            })
        }

        return res.json(patients);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const editPatient = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor' && req.role !== 'patient') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const patientId = req.params.id;

        PatientModel.findOneAndUpdate(
            {
                _id: patientId
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
                        message: 'Patient not found'
                    });
                }

                res.json(doc);
            }
        )

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const deletePatient = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const patientId = req.params.id;

        PatientModel.findOneAndDelete(
            {
                _id: patientId
            },
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Patient not found'
                    });
                }

                UserModel.deleteMany(
                    {
                        key: patientId
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
        )

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const deleteManyPatients = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const patientsId = req.body.patients;

        PatientModel.deleteMany(
            {
                _id: {
                    $in: patientsId
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
                        message: 'Patients not found'
                    });
                }

                UserModel.deleteMany(
                    {
                        key: {
                            $in: patientsId
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