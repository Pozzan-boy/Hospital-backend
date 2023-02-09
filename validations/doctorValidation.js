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

export const editDoctorValidator = [
    body('name').optional().isString().isLength({ min: 3 }),
    body('surname').optional().isString().isLength({ min: 3 }),
    body('age').optional().isNumeric(),
    body('speciality').optional().isString(),
    body('entryDate').optional().isString(),
    body('salary').optional().isNumeric(),
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone()
]