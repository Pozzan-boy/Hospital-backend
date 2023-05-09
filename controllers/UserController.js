import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import { validationResult } from 'express-validator';
import DoctorModel from '../models/Doctor.js';
import PatientModel from '../models/Patient.js';

export const login = async (req, res) => {
    try {

        if(req.headers.authorization !== undefined) {
            const codedToken = req.headers.authorization.replace(/Bearer\s?/, '');
            try {
                const decoded = jwt.verify(codedToken, 'pass123');
                const user = await UserModel.findById(decoded._id);
                const {...userData} = user._doc;
                return res.json({
                    ...userData,
                    token: codedToken
                });
            } catch(e) {
                return res.status(404).json({
                    message: 'Login fail!'
                });
            }
        }

        const user = await UserModel.findOne({login: req.body.login, role: req.body.role});
        if (!user) {
            return res.status(404).json({
                message: 'Login fail'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(404).json({
                message: 'Login fail'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                status: 'succes',
                role: user.role,
                key: user.key
            },
            'pass123',
            {
                expiresIn: '30d'
            }
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        res.status(500).json({
            message: 'Login fail'
        });
    }
};

export const doctorRegister = async (req, res) => {
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

        const key = req.body.key;
        const doctor = DoctorModel.findById(key);
        if(!doctor) {
            return res.status(404).json({
                message: 'Doctor not found!'
            });
        }

        const login = req.body.login;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        const role = req.body.role;
        
        const doc = new UserModel({
            login,
            passwordHash,
            role,
            key
        });

        const user = await doc.save();
        
        res.status(200).json({
            message: 'Success'
        });

    } catch (err) {
        res.status(500).json({
            message: 'Doctor register error',
        });
    }
};

export const checkDoctorAccount = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const key = req.params.key;
        const doctorAccount = await UserModel.findOne({key, role: 'doctor'});
        if(!doctorAccount) {
            return res.status(404).json({
                message: 'Doctor account not found!'
            });
        }

        res.status(200).json({
            login: doctorAccount._doc.login,
            message: 'Account exists'
        })

    } catch (err) {
        res.status(500).json({
            message: 'Doctor account checking error',
        });
    }
}

export const updateDoctorAccount = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const key = req.params.key;
        const doctorAccount = await UserModel.findOne({key, role: 'doctor'});
        if(!doctorAccount) {
            return res.status(404).json({
                message: 'Doctor account not found!'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.oldPassword, doctorAccount._doc.passwordHash);
        if(!isValidPass) {
            return res.status(404).json({
                message: 'Login fail'
            });
        }

        const newLogin = req.body.newLogin || doctorAccount._doc.login;
        let newHash;
        if (req.body.newPassword) {
            const salt = await bcrypt.genSalt(10);
            newHash = await bcrypt.hash(req.body.password, salt);
        } else {
            newHash = doctorAccount._doc.passwordHash;
        }
        
        await UserModel.findOneAndUpdate({key},
            {
                login: newLogin,
                password: newHash
            });

        res.status(200).json({
            messge: 'Success'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            message: 'Doctor account update error',
        });
    }
}

export const patientRegister = async (req, res) => {
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

        const key = req.body.key;
        const patient = PatientModel.findById(key);
        if(!patient) {
            return res.status(404).json({
                message: 'Patient not found!'
            });
        }

        const login = req.body.login;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        const role = req.body.role;

        const doc = new UserModel({
            login,
            passwordHash,
            role,
            key
        });

        const user = await doc.save();

        res.status(200).json({
            message: 'Success'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Patient register error',
        });
    }
}

export const checkPatientAccount = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor' && req.role !== 'patient') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const key = req.params.key;
        const patientAccount = await UserModel.findOne({key, role: 'patient'});
        if(!patientAccount) {
            return res.status(404).json({
                message: 'Patient account not found!'
            });
        }

        res.status(200).json({
            login: patientAccount._doc.login,
            message: 'Account exists'
        })

    } catch (err) {
        res.status(500).json({
            message: 'Patient account checking error',
        });
    }
}

export const updatePatientAccount = async (req, res) => {
    try {
        if(req.role !== 'admin' && req.role !== 'doctor' && req.role !== 'patient') {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

        const key = req.params.key;
        const patientAccount = await UserModel.findOne({key, role: 'ptient'});
        if(!patientAccount) {
            return res.status(404).json({
                message: 'Patient account not found!'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.oldPassword, patientAccount._doc.passwordHash);
        if(!isValidPass) {
            return res.status(404).json({
                message: 'Login fail'
            });
        }

        const newLogin = req.body.newLogin || doctorAccount._doc.login;
        let newHash;
        if (req.body.newPassword) {
            const salt = await bcrypt.genSalt(10);
            newHash = await bcrypt.hash(req.body.password, salt);
        } else {
            newHash = patientAccount._doc.passwordHash;
        }
        
        await UserModel.findOneAndUpdate({key},
            {
                login: newLogin,
                password: newHash
            });

        res.status(200).json({
            messge: 'Success'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            message: 'Patient account update error',
        });
    }
}
