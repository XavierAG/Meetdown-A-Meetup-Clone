const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { Group, User , Attendance, Membership, GroupImage, Venue, Event, EventImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const event = require('../../db/models/event');
const attendance = require('../../db/models/attendance');

const router = express.Router();

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
const validateQueryParams = (req, res, next) => {
    const { page = 1, size = 20, name, type, startDate } = req.query;

    // Validate query parameters
    const errors = {};
    if (page < 1 || page > 10) {
      errors.page = 'Page must be between 1 and 10';
    }
    if (size < 1 || size > 20) {
      errors.size = 'Size must be between 1 and 20';
    }
    if (type && type !== 'Online' && type !== 'In Person') {
      errors.type = "Type must be 'Online' or 'In Person'";
    }
    if (startDate && !moment(startDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
      errors.startDate = 'Start date must be a valid datetime';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Bad Request', errors });
    }

    // Add the validated query parameters to the request object
    req.validatedQueryParams = {
      page: parseInt(page),
      size: parseInt(size),
      name,
      type,
      startDate,
    };

    next();
  };

router.get( '/' , validateQueryParams, async (req, res, next) => {
    try {
        const { page, size, name, type, startDate } = req.validatedQueryParams;
        const offset = (page - 1) * size;
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
            ],
            offset,
            limit: size
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
        res.status(500).json({ message: "Internal server error" });;
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const { url, preview } = req.body

        const event = await Event.findByPk(eventId)
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }
        const isOrganizer = await Group.findOne({
            where: {
              id: event.groupId,
              organizerId: userId,
            },
        });
        const isCoHost = await Membership.findOne({
            where: {
              userId: userId,
              groupId: event.groupId,
              status: 'co-host',
            },
        });
        const isAttending = await Attendance.findOne({
            where: {
                userId: userId,
                status: 'attending'
            }
        })
        if (!isOrganizer && !isCoHost && !isAttending) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const image = await EventImage.create({ eventId, url, preview });
        const response = {
            id: image.id,
            url: image.url,
            preview: image.preview
        };
        res.status(200).json(response);

    } catch(e) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put('/:eventId', requireAuth, validateEventSignup, async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

        const event = await Event.findByPk(eventId)
        if (!event) {
            return res.status(404).json({ message: "Event couldn't be found" });
        }
        const isOrganizer = await Group.findOne({
            where: {
              id: event.groupId,
              organizerId: userId,
            },
        });
        const isCoHost = await Membership.findOne({
            where: {
              userId: userId,
              groupId: event.groupId,
              status: 'co-host',
            },
        });

        if (!isOrganizer && !isCoHost) {
            return res.status(403).json({ error: 'Access denied' });
        }

        event.venueId = venueId;
        event.name = name;
        event.type = type;
        event.capacity = capacity;
        event.price = price;
        event.description = description;
        event.startDate = startDate;
        event.endDate = endDate;

        await event.save();

        const response = {
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        }

        res.status(200).json(response);

    } catch(e) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.delete('/:eventId', requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id

    try {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const isOrganizer = await Group.findOne({
        where: {
          id: event.groupId,
          organizerId: userId,
        },
    });
    const isCoHost = await Membership.findOne({
        where: {
          userId: userId,
          groupId: event.groupId,
          status: 'co-host',
        },
    });

    if (!isOrganizer && !isCoHost) {
        return res.status(403).json({ error: 'Access denied' });
    }

      await event.destroy();

      res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.get('/:eventId/attendees', async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const isOrganizer = await Group.findOne({
        where: {
          id: event.groupId,
          organizerId: userId
        }
    });

    const isCoHost = await Membership.findOne({
        where: {
          groupId: event.groupId,
          userId: userId,
          status: 'co-host',
        },
      });

    let attendees;

    if (isOrganizer || isCoHost) {
      attendees = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: [
          {
            model: Attendance,
            attributes: ["status"],
            where: {
              eventId: event.id,
            },
          },
        ],
      });
    } else {
      attendees = await User.findAll({
        attributes: ["id", "firstName", "lastName"],
        include: [
          {
            model: Attendance,
            attributes: ["status"],
            where: {
              eventId: event.id,
              status: { [Op.ne]: 'pending' },
            },
          },
        ],
      });
    }

    res.status(200).json({ Attendees: attendees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:eventId/attendance', requireAuth, async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const existingAttendance = await Attendance.findOne({
        where: {
          eventId: event.id,
          userId: userId,
        },
      });

      if (existingAttendance) {
        if (existingAttendance.status === 'pending') {
          return res.status(400).json({ message: "Attendance has already been requested" });
        } else {
          return res.status(400).json({ message: "User is already an attendee of the event" });
        }
      }

      const newAttendance = await Attendance.create({
        eventId: event.id,
        userId: userId,
        status: 'pending',
      });

      res.status(200).json(newAttendance);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:eventId/attendance', requireAuth, async (req, res) => {
    try {
      const { eventId } = req.params;
      const { userId, status } = req.body;
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      if (status === 'pending') {
        return res.status(400).json({ message: "Cannot change an attendance status to pending" });
      }

      const attendance = await Attendance.findOne({
        where: {
          eventId: event.id,
          userId: userId,
        },
      });

      if (!attendance) {
        return res.status(404).json({ message: "Attendance between the user and the event does not exist" });
      }

      attendance.status = status;
      await attendance.save();

      res.status(200).json(attendance);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:eventId/attendance', requireAuth, async (req, res) => {
try {
    const { eventId } = req.params;
    const { userId } = req.body;
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const attendance = await Attendance.findOne({
      where: {
        eventId: event.id,
        userId: userId,
      },
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance does not exist for this User" });
    }

    const isOrganizer = await Group.findOne({
      where: {
        id: event.groupId,
        organizerId: req.user.id,
      },
    });

    if (!isOrganizer && userId !== req.user.id) {
      return res.status(403).json({ message: "Only the User or organizer may delete an Attendance" });
    }

    await attendance.destroy();

    res.status(200).json({ message: "Successfully deleted attendance from event" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
