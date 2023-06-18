
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')
const eventRouter = require('./events.js')
const venueRouter = require('./venues.js')
const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter)

router.use('/events', eventRouter)

router.use('/venues', venueRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
