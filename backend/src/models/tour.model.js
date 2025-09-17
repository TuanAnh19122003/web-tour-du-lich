const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const slugify = require('slugify');

const Tour = sequelize.define('Tour', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    location: {
        type: DataTypes.STRING
    },
    startDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE
    },
    maxPeople: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.DECIMAL(12, 2)
    }
}, {
    tableName: 'tours',
    timestamps: true,
    hooks: {
        beforeCreate: (tour) => {
            if (tour.name) tour.slug = slugify(tour.name, { lower: true, strict: true });
        },
        beforeUpdate: (tour) => {
            if (tour.name) tour.slug = slugify(tour.name, { lower: true, strict: true });
        }
    }
});

module.exports = Tour;