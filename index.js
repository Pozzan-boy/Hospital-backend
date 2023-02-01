import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from './models/User.js';

mongoose
    .connect('mongodb+srv://admin:1q2w3e4r@cluster0.x48lxgt.mongodb.net/hospital?retryWrites=true&w=majority')
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB connection error', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({login: req.body.login});
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
                _id: user._id
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
});

app.post('/auth/register/doctor', (req, res) => {

});

app.listen(3001, (err) => {
    if (err) {
        return console.log(err);        
    }

    console.log('Server started...');
});