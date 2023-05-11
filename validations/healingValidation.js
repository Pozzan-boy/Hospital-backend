import { body } from 'express-validator';

export const addHealingValidator = [
    body('patient').isString({min: 3}),
    body('doctor').isString({min: 3}),
    body('ward').optional().isString({min: 3}),
    body('diagnos').isString().isLength({min: 3, max: 50}),
    body('diagnosDescription').isString().isLength({min: 3, max: 300}),
    body('date').isString(),
    body('preparations').optional().isArray(),
    body('healingInstruction').isString().isLength({min: 3, max: 300}),
    body('status').isString().isIn(['Sick', 'Recovered', 'Dead'])
];

export const editHealingValidator = [
    body('patient').optional().isString({min: 3}),
    body('doctor').optional().isString({min: 3}),
    body('ward').optional().isString({min: 3}),
    body('diagnos').optional().isString().isLength({min: 3, max: 50}),
    body('diagnosDescription').optional().isString().isLength({min: 3, max: 300}),
    body('date').optional().isString(),
    body('preparations').optional().isArray(),
    body('healingInstruction').optional().isString().isLength({min: 3, max: 300}),
    body('status').optional().isString().isIn(['Sick', 'Recovered', 'Dead'])
];