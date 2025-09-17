const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingDetail = sequelize.define('BookingDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tourId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numPeople: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
}, {
    tableName: 'booking_details',
    timestamps: true
});

module.exports = BookingDetail;