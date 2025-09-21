const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const contactRouter = require('./contact.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/contacts', contactRouter);

module.exports = router;