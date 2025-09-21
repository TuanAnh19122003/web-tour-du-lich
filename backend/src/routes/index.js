const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');
const userRouter = require('./user.routes');
const contactRouter = require('./contact.routes');
const discountRouter = require('./discount.routes');
const tourRouter = require('./tour.routes');
const reviewRouter = require('./review.routes');
const bookingRouter = require('./booking.routes');
const paypalRoutes = require('./paypal.routes');
const authRouter = require('./auth.routes');

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/contacts', contactRouter);
router.use('/discounts', discountRouter);
router.use('/tours', tourRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);
router.use('/paypal', paypalRoutes);
router.use('/auth', authRouter);

module.exports = router;