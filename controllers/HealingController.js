import HealingModel from '../models/Healing.js';
import PatientModel from '../models/Patient.js';
import DoctorModel from '../models/Doctor.js';
import WardModel from '../models/Ward.js';
import { validationResult } from 'express-validator';

export const getAllHealings = async (req, res) => {
    try {
        if (req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const helings = await HealingModel.find().populate(['patient', 'doctor', 'ward']).skip(req.headers.from).limit(req.headers.count);

        if (helings != null && helings.length > 0) {
            return res.status(200).json(helings);
        }
        return res.status(404).json({
            message: 'Healings not found'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const addHealing = async (req, res) => {
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

        const diagnos = req.body.diagnos;
        const diagnosDescription = req.body.diagnosDescription;
        const date = req.body.date;
        const preparations = req.body?.preparations;
        const healingInstruction = req.body.healingInstruction;
        const status = req.body.status;

        let patient = req.body.patient;
        let doctor = req.body.doctor;
        let ward = req.body?.ward;

        if (ward !== undefined) {
            ward = await WardModel.findById(ward);
            if (!ward) {
                return res.status(404).json({
                    message: 'Ward not found'
                })
            }
        }
        patient = await PatientModel.findById(patient);
        if (!patient) {
            return res.status(404).json({
                message: 'Patient not found'
            })
        }
        doctor = await DoctorModel.findById(doctor);
        if (!doctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            })
        }

        const doc = new HealingModel({
            patient,
            doctor,
            ward,
            diagnos,
            diagnosDescription,
            date,
            preparations,
            healingInstruction,
            status
        });

        const healing = await doc.save();

        res.json(healing);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const getHealing = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor' && req.role !== 'patient') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const healingId = req.params.id;

        const healing = await HealingModel.findById(healingId);
        if (!healing) {
            return res.status(404).json({
                message: 'Healing not found'
            });
        }

        return res.json(healing);

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const getMyHealing = async (req, res) => {
    try {
        if(req.role !== 'patient') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const patientId = req._key;
        console.log(patientId);

        const healing = await HealingModel.findOne({patient: patientId}).populate(['patient', 'doctor', 'ward']);
        if (!healing) {
            return res.status(404).json({
                message: 'Healing not found'
            });
        }
        console.log(healing);
        return res.json(healing);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const searchHealings = async (req, res) => {
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
        
        const healings = await HealingModel.find(req.query);

        if (!healings || healings.length === 0) {
            return res.status(404).json({
                message: 'Healings not found'
            })
        }

        return res.json(healings);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const editHealing = async (req, res) => {
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

        const healingId = req.params.id;

        let patient = req.body?.patient;
        let doctor = req.body?.doctor;
        let ward = req.body?.ward;

        if (patient !== undefined) {
            patient = await PatientModel.findById(patient);
            if (!patient) {
                return res.status(404).json({
                    message: 'Patient not found'
                })
            }
        }
        if (doctor !== undefined) {
            doctor = await DoctorModel.findById(doctor);
            if (!doctor) {
                return res.status(404).json({
                    message: 'Doctor not found'
                })
            }
        }
        if (ward !== undefined) {
            ward = await WardModel.findById(ward);
            if (!ward) {
                return res.status(404).json({
                    message: 'Ward not found'
                })
            }
        }

        HealingModel.findOneAndUpdate(
            {
                _id: healingId
            },
            {
                ...req.body
            },
            {
                returnDocument: 'after'
            }).populate(['patient', 'doctor', 'ward']).exec(
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Healing not found'
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

export const deleteHealing = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const healingId = req.params.id;

        HealingModel.findOneAndDelete(
            {
                _id: healingId
            },
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Healing not found'
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

export const deleteManyHealings = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const healingsId = req.body.healings;

        HealingModel.deleteMany(
            {
                _id: {
                    $in: healingsId
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
                        message: 'Healings not found'
                    });
                }

                res.json(doc);
            }
        );

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}