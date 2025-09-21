const sequelize = require('../config/database');
const Role = require('./role.model')
const User = require('./user.model');
const Booking = require('./booking.model');
const BookingItem = require('./bookingItem.model');
const Discount = require('./discount.model');
const Review = require('./review.model');
const Tour = require('./tour.model');
const Contact = require('./contact.model');

const db = {
    Role,
    User,
    Booking,
    BookingItem,
    Discount,
    Review,
    Tour,
    Contact,
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