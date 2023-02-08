import { body } from "express-validator";

export const addDoctorValidator = [
    body('name').isString().isLength({ min: 3 }),
    body('surname').isString().isLength({ min: 3 }),
    body('age').isNumeric(),
    body('speciality').isString(),
    body('entryDate').isString(),
    body('salary').isNumeric(),
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone()
];