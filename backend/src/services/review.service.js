const Review = require('../models/review.model');

class ReviewService {
    static async findAll(options = {}) {
        const { offset, limit, search } = options;

        const whereClause = {};
        const { Op } = require('sequelize');
        if (search) {
            whereClause[Op.or] = [
                { comment: { [Op.like]: `%${search}%` } },
            ];
        }

        const queryOptions = {
            where: whereClause,
            include: [
                {
                    model: require('../models/user.model'),
                    as: 'user',
                    attributes: ['id', 'lastname', 'firstname', 'email']
                },
                {
                    model: require('../models/tour.model'),
                    as: 'tour',
                    attributes: ['id', 'name', 'code', 'price']
                }
            ],
            order: [['createdAt', 'ASC']]
        };

        if (offset !== undefined && limit !== undefined) {
            queryOptions.offset = offset;
            queryOptions.limit = limit;
        }

        const reviews = await Review.findAndCountAll(queryOptions);
        return reviews;
    }


    static async create(data) {
        const review = await Review.create(data);
        return review;
    }

    static async update(id, data) {
        const review = await Review.findOne({ where: { id } });
        if (!review) throw new Error('Review not found');
        return await review.update(data);
    }

    static async delete(id) {
        return await Review.destroy({ where: { id } });
    }

    static async detail(id) {
        const review = await Review.findOne({ where: { id } });
        if (!review) throw new Error('Review not found');
        return review;
    }
}

module.exports = ReviewService;
