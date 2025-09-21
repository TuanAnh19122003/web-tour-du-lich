// models/Tour.js
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
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
    price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    start_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    end_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    location: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    max_people: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    available_people: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    is_featured: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false 
    },
    discountId: { 
        type: DataTypes.INTEGER 
    }
}, {
    timestamps: true,
    tableName: 'tours',
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
