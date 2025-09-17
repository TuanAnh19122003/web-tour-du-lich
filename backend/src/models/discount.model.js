const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const slugify = require('slugify');

const Discount = sequelize.define('Discount', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    discountType: {
        type: DataTypes.ENUM('Percentage', 'Fixed'),
        defaultValue: 'Percentage'
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE
    },
    maxUsage: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    tableName: 'discounts',
    timestamps: true,
    hooks: {
        beforeCreate: (discount) => {
            if (discount.code) discount.slug = slugify(discount.code, { lower: true, strict: true });
        },
        beforeUpdate: (discount) => {
            if (discount.code) discount.slug = slugify(discount.code, { lower: true, strict: true });
        }
    }
});

module.exports = Discount