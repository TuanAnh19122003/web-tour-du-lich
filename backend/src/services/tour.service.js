const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const Tour = require('../models/tour.model');
const Discount = require('../models/discount.model');

class TourService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { code: { [Op.like]: `%${search}%` } },
                { name: { [Op.like]: `%${search}%` } },
                { slug: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        return await Tour.findAndCountAll({
            where: whereClause,
            include: {
                model: Discount,
                as: 'discount',
                attributes: ['id', 'name', 'percentage']
            },
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });
    }

    static async create(data, file) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        if (file) {
            data.image = `uploads/${file.filename}`;
        }

        const tour = await Tour.create(data);
        return tour;
    }

    static async update(id, data, file) {
        const tour = await Tour.findOne({ where: { id: id } });
        if (!tour) throw new Error('tour không tồn tại');

        if (data.password && data.password !== tour.password) {
            data.password = await hashPassword(data.password);
        } else {
            delete data.password;
        }
        if (file) {
            if (tour.image) {
                const oldImagePath = path.join(__dirname, '..', tour.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.image = `uploads/${file.filename}`;
        }

        return await tour.update(data)
    }

    static async delete(id) {
        const tour = await Tour.findByPk(id);
        if (!tour) return 0;

        if (tour.image) {
            const imagePath = path.join(__dirname, '..', tour.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        return await tour.destroy({ where: { id } });
    }
    
    static async getDestinations() {
        const tours = await Tour.findAll({
            attributes: ['location', 'image'],
            where: { is_active: true }
        });

        const map = {};
        tours.forEach(t => {
            if (!map[t.location]) {
                map[t.location] = t.image || '/default-destination.jpg';
            }
        });

        return Object.keys(map).map(loc => ({
            location: loc,
            image: map[loc]
        }));
    }

    static async getFeatured() {
        return await Tour.findAll({
            where: { is_active: true, is_featured: true },
            include: {
                model: Discount,
                as: 'discount',
                attributes: ['id', 'name', 'percentage']
            },
            order: [['createdAt', 'DESC']],
            limit: 6
        });
    }
}

module.exports = TourService;
