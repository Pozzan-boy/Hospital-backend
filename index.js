import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import * as UserController from './controllers/UserController.js';
import * as DoctorController from './controllers/DoctorController.js';
import * as PatientController from './controllers/PatientController.js';
import * as WardController from './controllers/WardController.js';
import * as HealingController from './controllers/HealingController.js';
import checkAuth from './utils/checkAuth.js';
import { addDoctorValidator, editDoctorValidator } from './validations/doctorValidation.js';
import { doctorRegisterValidator, patientRegisterValidator } from './validations/auth.js';
import { addPatientValidator, editPatientValidator } from './validations/patientValidation.js';
import { addWardValidator, editWardValidator} from './validations/wardValidtion.js';
import { addHealingValidator, editHealingValidator } from './validations/healingValidation.js';

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


//======================Doctor===========================

app.get('/doctor/getAllDoctors', checkAuth, DoctorController.getAllDoctors);

app.post('/doctor/add', checkAuth, addDoctorValidator, DoctorController.addDoctor);

app.get('/doctor/:id', checkAuth, DoctorController.getDoctor);

app.put('/doctor/edit/:id', checkAuth, editDoctorValidator, DoctorController.editDoctor);

app.delete('/doctor/delete/:id', checkAuth, DoctorController.deleteDoctor);

app.delete('/doctor/deleteMany', checkAuth, DoctorController.deleteManyDoctors);

app.post('/auth/register/doctor', checkAuth, doctorRegisterValidator, UserController.doctorRegister);

app.put('/doctor/updateAccount/:key', checkAuth, UserController.updateDoctorAccount);

app.get('/doctor/checkAccount/:key', checkAuth, UserController.checkDoctorAccount);


//=====================Patient===========================

app.get('/patient/getAllPatients', checkAuth, PatientController.getAllPatients);

app.post('/patient/add', checkAuth, addPatientValidator, PatientController.addPatient);

app.get('/patient/getHealing', checkAuth, HealingController.getMyHealing);

app.get('/patient/getInfo', checkAuth, PatientController.getMyInfo);

app.get('/patient/:id', checkAuth, PatientController.getPatient);

app.put('/patient/edit/:id', checkAuth, editPatientValidator, PatientController.editPatient);

app.delete('/patient/delete/:id', checkAuth, PatientController.deletePatient);

app.delete('/patient/deleteMany', checkAuth, PatientController.deleteManyPatients);

app.post('/auth/register/patient', checkAuth, patientRegisterValidator, UserController.patientRegister);

app.put('/patient/updateAccount/:key', checkAuth, UserController.updatePatientAccount);

app.get('/patient/checkAccount/:key', checkAuth, UserController.checkPatientAccount);


//====================Ward======================

app.get('/ward/getAllWards', checkAuth, WardController.getAllWards);

app.post('/ward/add', checkAuth, addWardValidator, WardController.addWard);

app.get('/ward/:id', checkAuth, WardController.getWard);

app.put('/ward/edit/:id', checkAuth, editWardValidator, WardController.editWard);

app.delete('/ward/delete/:id', checkAuth, WardController.deleteWard);

app.delete('/ward/deleteMany', checkAuth, WardController.deleteManyWards);


//=====================Healing=======================

app.get('/healing/getAllHealings', checkAuth, HealingController.getAllHealings);

app.post('/healing/add', checkAuth, addHealingValidator, HealingController.addHealing);

app.get('/healing/:id', checkAuth, HealingController.getHealing);

app.put('/healing/edit/:id', checkAuth, editHealingValidator, HealingController.editHealing);

app.delete('/healing/delete/:id', checkAuth, HealingController.deleteHealing);

app.delete('/healing/deleteMany', checkAuth, HealingController.deleteManyHealings);

app.listen(3001, (err) => {
    if (err) {
        return console.log(err);        
    }

    console.log('Server started...');
});