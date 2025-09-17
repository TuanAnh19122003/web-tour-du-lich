const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discountId: {
        type: DataTypes.INTEGER
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
        defaultValue: 'Pending'
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

module.exports = Booking