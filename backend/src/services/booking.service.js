const Booking = require('../models/booking.model');
const BookingItem = require('../models/bookingItem.model');
const Tour = require('../models/tour.model');
const { client: paypalClient } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

class BookingService {
    static async findAll({ offset, limit }) {
        return await Booking.findAndCountAll({
            distinct: true,
            include: [
                { model: BookingItem, as: 'items', include: [{ model: Tour, as: 'tour' }] }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });
    }

    static async getBookingsByUser(userId) {
        return await Booking.findAll({
            where: { userId },
            include: [{ model: BookingItem, as: 'items', include: [{ model: Tour, as: 'tour' }] }],
            order: [['createdAt', 'DESC']]
        });
    }

    static async create({ userId, items, total_price, note, paymentMethod = 'cod' }) {
        // items: [{ tourId, quantity, price }]
        if (!items || items.length === 0) throw new Error('Booking must have at least one item');

        return await Booking.sequelize.transaction(async (t) => {
            const booking = await Booking.create({
                userId,
                total_price,
                note,
                paymentMethod
            }, { transaction: t });

            const bookingItemsData = items.map(item => ({
                bookingId: booking.id,
                tourId: item.tourId,
                quantity: item.quantity || 1,
                price: item.price
            }));

            await BookingItem.bulkCreate(bookingItemsData, { transaction: t });

            let approveUrl;
            if (paymentMethod === 'paypal') {
                const usdPrice = items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0) / 24000;
                const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
                request.prefer('return=representation');
                request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: usdPrice.toFixed(2),
                            breakdown: { item_total: { currency_code: 'USD', value: usdPrice.toFixed(2) } }
                        },
                        items: items.map(i => ({
                            name: `Tour ID: ${i.tourId}`,
                            unit_amount: { currency_code: 'USD', value: (i.price / 24000).toFixed(2) },
                            quantity: String(i.quantity || 1)
                        }))
                    }],
                    application_context: {
                        brand_name: 'My Travel App',
                        landing_page: 'LOGIN',
                        user_action: 'PAY_NOW',
                        return_url: `http://localhost:3000/bookings/paypal-success?bookingId=${booking.id}`,
                        cancel_url: `http://localhost:3000/bookings/paypal-cancel?bookingId=${booking.id}`
                    }
                });

                const response = await paypalClient().execute(request);
                booking.paypal_order_id = response.result.id;
                await booking.save({ transaction: t });
                approveUrl = response.result.links.find(l => l.rel === 'approve')?.href;
            }

            return { booking, approveUrl };
        });
    }

    static async detail(id) {
        return await Booking.findByPk(id, {
            include: [{ model: BookingItem, as: 'items', include: [{ model: Tour, as: 'tour' }] }]
        });
    }

    static async delete(bookingId) {
        return await Booking.sequelize.transaction(async (t) => {
            const booking = await Booking.findByPk(bookingId, { transaction: t });
            if (!booking) throw new Error('Booking not found');

            await BookingItem.destroy({ where: { bookingId }, transaction: t });
            await booking.destroy({ transaction: t });

            return { message: 'Booking deleted successfully' };
        });
    }
}

module.exports = BookingService;
