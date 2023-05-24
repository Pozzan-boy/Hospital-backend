import WardModel from '../models/Ward.js';
import DoctorModel from '../models/Doctor.js';
import { validationResult } from 'express-validator';

export const getAllWards = async (req, res) => {
    try {
        if (req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const wards = await WardModel.find().populate('chief').skip(req.headers.from).limit(req.headers.count);
        console.log(wards);

        if (wards != null && wards.length > 0) {
            return res.status(200).json(wards);
        }
        return res.status(404).json({
            message: 'Wards not found'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const addWard = async (req, res) => {
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

        const number = req.body.number;
        const floor = req.body.floor;
        const department = req.body.department;
        const purpose = req.body.purpose;
        const placeCount = req.body.placeCount;
        let chief = req.body?.chief;

        if (chief !== undefined) {
            chief = await DoctorModel.findById(chief);
            if (!chief) {
                return res.status(404).json({
                    message: 'Doctor not found'
                })
            }
        }

        const doc = new WardModel({
            number,
            floor,
            department,
            purpose,
            placeCount,
            chief
        })

        const ward = await doc.save();

        res.json(ward);

    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const getWard = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const wardId = req.params.id;

        const ward = await WardModel.findById(wardId);
        if (!ward) {
            return res.status(404).json({
                message: 'Ward not found'
            });
        }

        return res.json(ward);

    } catch(err) {
        res.status(500).json({
            message: 'Error'
        });
    }
}

export const editWard = async (req, res) => {
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

        const wardId = req.params.id;

        let chief = req.body?.chief;
        if (chief !== undefined) {
            chief = await DoctorModel.findById(chief);
            if (!chief) {
                
                return res.status(404).json({
                    message: 'Doctor not found'
                })
            }
        }

        WardModel.findOneAndUpdate(
            {
                _id: wardId
            },
            {
                ...req.body
            },
            {
                returnDocument: 'after'
            }).populate('chief').exec(
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Ward not found'
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

export const deleteWard = async (req, res) => {
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const wardId = req.params.id;

        WardModel.findOneAndDelete(
            {
                _id: wardId
            },
            (err, doc) => {
                if(err) {
                    return res.status(500).json({
                        message: 'Error'
                    });
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'Ward not found'
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

export const deleteManyWards = async (req, res) => {
    try {
        if(req.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const wardsId = req.body.wards;

        WardModel.deleteMany(
            {
                _id: {
                    $in: wardsId
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
                        message: 'Wards not found'
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