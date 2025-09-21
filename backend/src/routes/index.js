const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const contactRouter = require('./contact.routes');
const discountRouter = require('./discount.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/contacts', contactRouter);
router.use('/discounts', discountRouter);

module.exports = router;