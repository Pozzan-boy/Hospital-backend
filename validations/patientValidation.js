import { body } from "express-validator";

export const addPatientValidator = [
    body('name').isString().isLength({ min: 3 }),
    body('surname').isString().isLength({ min: 3 }),
    body('birthDate').isString(),
    body('sex').isString().isIn(['Male', 'Female', 'Undefined']),
    body('height').isNumeric({ min: 1 }),
    body('weight').isNumeric({ min: 1 }),
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone()
];

export const editPatientValidator = [
    body('name').optional().isString().isLength({ min: 3 }),
    body('surname').optional().isString().isLength({ min: 3 }),
    body('birthDate').optional().isString(),
    body('sex').optional().isString().isIn(['Male', 'Female', 'Undefined']),
    body('height').optional().isNumeric({ min: 1 }),
    body('weight').optional().isNumeric({ min: 1 }),
    body('email').optional().isEmail(),
    body('phone').optional().isMobilePhone()
]