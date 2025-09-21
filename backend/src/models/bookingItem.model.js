// models/BookingItem.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const BookingItem = sequelize.define('BookingItem', {
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
    quantity: { 
        type: DataTypes.INTEGER, 
        allowNull: false, defaultValue: 1 
    },
    price: { 
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false 
    }
}, {
    timestamps: true,
    tableName: 'booking_items'
});

module.exports = BookingItem;
