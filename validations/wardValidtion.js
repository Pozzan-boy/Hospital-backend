import { body } from 'express-validator';

export const addWardValidator = [
    body('number').isNumeric({min: 1 }),
    body('floor').isNumeric(),
    body('department').isString().isLength({min: 3}),
    body('purpose').isString().isLength({min: 3}),
    body('placeCount').isNumeric({min: 0}),
    body('chief').optional().isString({min: 3})
];

export const editWardValidator = [
    body('number').optional().isNumeric({min: 1 }),
    body('floor').optional().isNumeric(),
    body('department').optional().isString().isLength({min: 3}),
    body('purpose').optional().isString().isLength({min: 3}),
    body('placeCount').optional().isNumeric({min: 0}),
    body('chief').optional().isString({min: 3})
];