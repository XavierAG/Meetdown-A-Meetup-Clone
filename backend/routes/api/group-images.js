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

      const groupImage = await GroupImage.findByPk(imageId);

      if (!groupImage) {
        return res.status(404).json({ message: "Group Image couldn't be found" });
      }

      const group = await Group.findByPk(groupImage.groupId);

      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

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

      await groupImage.destroy();

      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
