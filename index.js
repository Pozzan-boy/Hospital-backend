import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import * as UserController from './controllers/UserController.js';
import * as DoctorController from './controllers/DoctorController.js';
import checkAuth from './utils/checkAuth.js';

mongoose
    .connect('mongodb+srv://admin:1q2w3e4r@cluster0.x48lxgt.mongodb.net/hospital?retryWrites=true&w=majority')
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB connection error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/auth/login', UserController.login);

app.get('/doctor/getAllDoctors', checkAuth, DoctorController.getAllDoctors);

// app.post('/auth/register/doctor', (req, res) => {

// });

app.listen(3001, (err) => {
    if (err) {
        return console.log(err);        
    }

    console.log('Server started...');
});