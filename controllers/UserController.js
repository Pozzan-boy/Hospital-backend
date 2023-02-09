import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import { validationResult } from 'express-validator';
import DoctorModel from '../models/Doctor.js';

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
                role: user.role
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

        res.json(user);

    } catch (err) {
        res.status(500).json({
            message: 'Doctor register error',
        });
    }
};