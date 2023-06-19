const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { Group, User , Membership, GroupImage, Venue, Event, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateVenueSignup = [
    check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
    check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
    check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
    check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is required'),
    check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is required'),
    handleValidationErrors
]

router.put( '/:venueId', requireAuth, validateVenueSignup, async (req, res, next) => {
    try {
        const venueId = req.params.venueId;
        const userId = req.user.id;
        const { address, city, state, lat, lng } = req.body;
        const venue = await Venue.findByPk(venueId);
        const groupId = venue.groupId

        if (!venue) {
            return res.status(404).json({ error: "Venue couldn't be found"});
        }
        const group = await Group.findByPk(groupId);

        if (!group) {
          return res.status(404).json({ error: "Group couldn't be found" });
        }

        const isOrganizer = await Group.findOne({
            where: {
              id: groupId,
              organizerId: userId,
            },
        });
        const isCoHost = await Membership.findOne({
            where: {
              groupId: groupId,
              userId: userId,
              status: 'co-host',
            },
          });
        if (!isOrganizer && !isCoHost) {
            return res.status(403).json({ error: 'Access denied' });
        }

        venue.address = address;
        venue.city = city;
        venue.state = state;
        venue.lat = lat;
        venue.lng = lng
        await venue.save();

        const responseVenue = {
            id: venue.id,
            groupId: venue.groupId,
            address: venue.address,
            city: venue.city,
            state: venue.state,
            lat: venue.lat,
            lng: venue.lng,
          };

        res.status(200).json(responseVenue);
    } catch (error) {
        next(error);
    }
})

module.exports = router;
