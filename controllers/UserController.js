import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const login = async (req, res) => {
    try {
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