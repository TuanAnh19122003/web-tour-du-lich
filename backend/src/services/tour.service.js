const Tour = require('../models/tour.model');

class TourService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        if (search) {
            const { Op } = require('sequelize');
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { lastname: { [Op.like]: `%${search}%` } },
                { firstname: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { is_active: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            include: {
                model: require('../models/discount.model'),
                as: 'discount',
                attributes: ['id', 'name']
            },
            offset,
            limit,
            order: [['createdAt', 'ASC']]
        };

        const tours = await Tour.findAndCountAll(queryOptions);
        return tours;
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

        // Lấy location duy nhất
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


}

module.exports = TourService;