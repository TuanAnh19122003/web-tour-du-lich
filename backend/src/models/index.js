const sequelize = require('../config/database');
const Role = require('./role.model')
const User = require('./user.model');
const Booking = require('./booking.model');
const BookingDetail = require('./bookingDetail.model');
const Discount = require('./discount.model');
const Payment = require('./payment.model');
const Review = require('./review.model');
const Tour = require('./tour.model')

const db = {
    Role,
    User,
    Booking,
    BookingDetail,
    Discount,
    Payment,
    Review,
    Tour,
    sequelize
}

require('./initRelationships')(db);

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;