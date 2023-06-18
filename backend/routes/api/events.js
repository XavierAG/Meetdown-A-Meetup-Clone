const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { Group, User , Membership, GroupImage, Venue, Event, EventImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const event = require('../../db/models/event');

const router = express.Router();

router.get( '/' , async (req, res, next) => {
    try {
        const events = await Event.findAll({
            attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
                include: [
                {
                    model: EventImage,
                    where: {
                        preview: true
                    },
                    attributes: ["url"],
                    required: false,
                    limit: 1
                },
                {
                    model: Group,
                    attributes: ['id', 'name', 'city', 'state']
                },
                {
                    model: Venue,
                    attributes: ['id', 'city', 'state']
                }
            ]

        });

    let payLoad = []
    for (let event of events) {
        let numAttending = await event.countAttendances()
        let eventjson = event.toJSON()
        eventjson.numAttending = numAttending
        let previewImage = eventjson.EventImages[0]
        if (previewImage){
            previewImage = previewImage.url
        } else {
            previewImage = null
        }
        eventjson.previewImage = previewImage
        delete eventjson.EventImages
        payLoad.push(eventjson)
    }
    res.status(200).json({Events: payLoad})
    } catch (error) {
        next(error);
    }
})

router.get( '/:eventId' , async (req, res, next) => {
    try {
        let eventId = req.params.eventId
        const events = await Event.findAll({
            where: { id: eventId },
            attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate'],
                include: [
                {
                    model: Group,
                    attributes: ['id', 'name', "private", 'city', 'state']
                },
                {
                    model: Venue,
                    attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
                },
                {
                    model: EventImage,
                    attributes: ["id", "url", "preview"],
                },
            ]

        });

    let payLoad = []
    for (let event of events) {
        let numAttending = await event.countAttendances()
        let eventjson = event.toJSON()
        eventjson.numAttending = numAttending
        payLoad.push(eventjson)
    }
    res.status(200).json({Events: payLoad})
    } catch (error) {
        next(error);
    }
})

module.exports = router;
