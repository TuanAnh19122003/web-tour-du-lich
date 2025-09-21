const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);

module.exports = router;