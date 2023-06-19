const express = require('express')
const { Op } = require('sequelize');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { Group, User , Attendance, Membership, GroupImage, Venue, Event, EventImage, sequelize} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const event = require('../../db/models/event');
const attendance = require('../../db/models/attendance');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    try {
      const { imageId } = req.params;
      const userId = req.user.id;

      const eventImage = await EventImage.findByPk(imageId);

      if (!eventImage) {
        return res.status(404).json({ message: "Event Image couldn't be found" });
      }

      const event = await Event.findByPk(eventImage.eventId, { include: Group });

      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const group = event.Group;

      const isOrganizer = group.organizerId === userId;
      const isCoHost = await Membership.findOne({
        where: {
          userId: userId,
          groupId: group.id,
          status: 'co-host',
        },
      });

      if (!isOrganizer && !isCoHost) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await eventImage.destroy();

      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
