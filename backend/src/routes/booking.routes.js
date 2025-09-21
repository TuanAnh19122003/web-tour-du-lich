const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');

router.get('/', BookingController.findAll);
router.post('/', BookingController.createBooking);
router.get('/user/:id', BookingController.getBookingDetailsByUser);
router.get('/:id', BookingController.detail);
router.delete('/:bookingId', BookingController.deleteBooking);

module.exports = router;
