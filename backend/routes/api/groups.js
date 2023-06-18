const express = require('express')
const { Op, Association } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { Group, User , Event, Membership, GroupImage, Venue, EventImage, sequelize} = require('../../db/models');
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

const validateEventSignup = [
    check('venueId')
    .isInt()
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
    check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
    check('type')
    .exists({ checkFalsy: true })
    .isIn([ 'Online', 'In person'])
    .withMessage('Type must be Online or In person'),
    check('capacity')
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage('Capacity must be an integer'),
    check('price')
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage('Price is invalid'),
    check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
    check('startDate')
    .exists({ checkFalsy: true })
    .isAfter()
    .withMessage('Start date must be after the current date')
    .isDate()
    .withMessage('Start date must be a valid date'),
    check('endDate')
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate < startDate) {
        throw new Error('End date is less than start day');
      }
      return true;
    }),
  handleValidationErrors,
]

router.get( '/' , async (req, res, next) => {
    try {
        const groups = await Group.findAll({
            attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt'],
                include: [
                {
                    model: GroupImage,
                    where: {
                        preview: true
                    },
                    attributes: ["url"],
                    required: false,
                    limit: 1
                }
            ]

        });

    let payLoad = []
    for (let group of groups) {
        let numMembers = await group.countMemberships()
        let groupjson = group.toJSON()
        groupjson.numMembers = numMembers
        let previewImage = groupjson.GroupImages[0]
        if (previewImage){
            previewImage = previewImage.url
        } else {
            previewImage = null
        }
        groupjson.previewImage = previewImage
        delete groupjson.GroupImages
        payLoad.push(groupjson)

        // console.log(await group.createMembership({userId: 4, status: 'member'}))
        //console.log(Object.getOwnPropertyNames(group.__proto__))  //group.prototype for model
    }
    //groups.tojson
    //use Association
    //groups.has +++> hasMany
    //lazy load aggregrate data ! findall

    res.status(200).json({Groups: payLoad})
    } catch (error) {
        next(error);
    }
})

router.get( '/current' , requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const groups = await Group.findAll({
            include: [
                {
                model: Membership,
                where: { userId },
                attributes: []
                },
                {
                    model: GroupImage,
                    where: {
                        preview: true
                    },
                    attributes: ["url"],
                    required: false,
                    limit: 1
                }
        ],
            attributes: [
                'id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt'],
        });
        let payLoad = []
        for (let group of groups) {
        let numMembers = await group.countMemberships()
        let groupjson = group.toJSON()
        groupjson.numMembers = numMembers
        let previewImage = groupjson.GroupImages[0]
        if (previewImage){
            previewImage = previewImage.url
        } else {
            previewImage = null
        }
        groupjson.previewImage = previewImage
        delete groupjson.GroupImages
        payLoad.push(groupjson)
    }
    res.status(200).json({Groups: payLoad})
    } catch(error) {
        console.error('Error retrieving groups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get( '/:groupId' , async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId, {
        attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt'],
        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview']
            },
            {

                model: User,
                attributes: ['id', 'firstName', 'lastName'],

            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
            }
        ],
    })

    if (!group) {
        return res.status(404).json({ error: 'Group not found' });
    }

    let payLoad = []
    let numMembers = await group.countMemberships()
    let groupjson = group.toJSON()
    let Organizer = groupjson.User
    groupjson.Organizer = Organizer
    delete groupjson.User
    groupjson.numMembers = numMembers
    payLoad.push(groupjson)

    res.status(200).json({Groups: payLoad, })
    } catch (error) {
        next(error);
    }
})


router.post( '/', validateSignup, requireAuth,
    async (req, res) => {
        const organizerId = req.user.id;
        const { name, about, type, private, city, state } = req.body;
        const group = await Group.create({ organizerId, name, about, type, private, city, state })
        res.status(201).json(group);
    }

)

router.post('/:groupId/images', requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const { url, preview } = req.body;

    try {
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }

        if (group.organizerId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: Only the organizer can add images" });
        }

        const image = await GroupImage.create({ groupId, url, preview });
        const response = {
            groupId: image.groupId,
            url: image.url,
            preview: image.preview
          };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put('/:groupId', requireAuth, validateSignup, async (req, res) => {
    const { groupId } = req.params;
    const { name, about, type, private, city, state } = req.body;

    try {

        const group = await Group.findByPk(groupId)

        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }
        if (group.organizerId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: Only the organizer can edit group" });
        }

        group.name = name;
        group.about = about;
        group.type = type;
        group.private = private;
        group.city = city;
        group.state = state;

        await group.save();

        res.status(200).json(group);

    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
})

router.delete('/:groupId', requireAuth, async (req, res) => {
    const { groupId } = req.params;

    try {
      const group = await Group.findByPk(groupId);

      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      if (group.organizerId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized: You can only delete groups that you own" });
      }

      await group.destroy();

      res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get( '/:groupId/venues', requireAuth, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
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
        const venues = await Venue.findAll({
            where: { groupId: groupId },
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
        });

        res.status(200).json({ Venues: venues });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post( '/:groupId/venues', requireAuth, validateVenueSignup, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const { address, city, state, lat, lng } = req.body;
        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
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

        const venue = await Venue.create({ groupId, address, city, state, lat, lng })

        res.status(201).json({ Venues: venue });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get( '/:groupId/events' , async (req, res, next) => {
    try {
        const groupId = req.params.groupId

        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const events = await Event.findAll({
            where: { groupId: groupId},
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post( '/:groupId/events', requireAuth, validateEventSignup, async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
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

        const event = await Event.create({ venueId, groupId, name, type, capacity, price, description, startDate, endDate })

        res.status(200).json({ event });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})
module.exports = router;
