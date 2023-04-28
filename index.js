import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import * as UserController from './controllers/UserController.js';
import * as DoctorController from './controllers/DoctorController.js';
import checkAuth from './utils/checkAuth.js';
import { addDoctorValidator, editDoctorValidator } from './validations/doctorValidation.js';
import { doctorRegisterValidator } from './validations/auth.js';

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

app.post('/doctor/add', checkAuth, addDoctorValidator, DoctorController.addDoctor);

app.get('/doctor/:id', checkAuth, DoctorController.getDoctor);

app.put('/doctor/edit/:id', checkAuth, editDoctorValidator, DoctorController.editDoctor);

app.delete('/doctor/delete/:id', checkAuth, DoctorController.deleteDoctor);

app.delete('/doctor/deleteMany', checkAuth, DoctorController.deleteManyDoctors);

app.post('/auth/register/doctor', checkAuth, doctorRegisterValidator, UserController.doctorRegister);

app.put('/doctor/updateAccount/:key', checkAuth, UserController.updateDoctorAccount);

app.get('/doctor/checkAccount/:key', checkAuth, UserController.checkDoctorAccount);

app.listen(3001, (err) => {
    if (err) {
        return console.log(err);        
    }

    console.log('Server started...');
});