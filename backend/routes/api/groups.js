const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth')

const { setTokenCookie, requireAuth} = require('../../atils.auth')
const { Group } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'),
    check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 50})
    .withMessage('About must be 50 characters or more'),
    check('type')
    .exists({ checkFalsy: true })
    .isIn([ 'Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Private must be boolean"),
    check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
    check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
    handleValidationErrors
]

router.post( '/', validateSignup,
    async (req, res) => {
        const { name, about, type, private, city, state } = req.body;
        const group = await Group.create({ name, about, type, private, city, state })
    }

)
