const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM('COD', 'PayPal', 'Credit Card', 'Other'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
        defaultValue: 'Pending'
    },
    transactionId: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'payments',
    timestamps: true
});

module.exports = Payment;