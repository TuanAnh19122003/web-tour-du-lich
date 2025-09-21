const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    booking_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'completed'), defaultValue: 'pending' },
    paymentMethod: { type: DataTypes.ENUM('cod', 'paypal'), defaultValue: 'cod' },
    paypal_order_id: { type: DataTypes.STRING },
    note: { type: DataTypes.TEXT }
}, {
    timestamps: true,
    tableName: 'bookings'
});

module.exports = Booking;
