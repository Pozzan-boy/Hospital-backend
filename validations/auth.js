import { body } from 'express-validator';

export const doctorRegisterValidator = [
    body('login').isString().isLength({min: 3}),
    body('password').isLength({min: 6}),
    body('key').isString(),
    body('role').isString()
];

