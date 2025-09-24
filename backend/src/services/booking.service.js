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
                {
                    model: BookingItem,
                    as: 'items',
                    include: [{ model: Tour, as: 'tour' }]
                },
                {
                    model: require('../models/user.model'),
                    as: 'user',
                    attributes: ['id', 'lastname', 'firstname', 'email']
                }
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

    // Update booking, nếu status = cancelled → trả vé
    static async update(bookingId, updateData) {
        return await Booking.sequelize.transaction(async (t) => {
            const booking = await Booking.findByPk(bookingId, {
                include: [{ model: BookingItem, as: 'items' }],
                transaction: t
            });
            if (!booking) throw new Error('Booking not found');

            const prevStatus = booking.status;
            const newStatus = updateData.status;

            const allowedFields = [
                'userId', 'total_price', 'booking_date',
                'status', 'paymentMethod', 'paypal_order_id', 'note'
            ];
            for (let key of allowedFields) {
                if (updateData[key] !== undefined) booking[key] = updateData[key];
            }

            await booking.save({ transaction: t });

            if (prevStatus !== 'cancelled' && newStatus === 'cancelled') {
                for (const item of booking.items) {
                    const tour = await Tour.findByPk(item.tourId, { transaction: t });
                    if (tour) {
                        tour.available_people += item.quantity;
                        await tour.save({ transaction: t });
                    }
                }
            }

            return booking;
        });
    }

    static async create({ userId, items, total_price, note }) {
        if (!items || items.length === 0) throw new Error('Booking must have at least one item');

        return await Booking.sequelize.transaction(async (t) => {
            const booking = await Booking.create({
                userId,
                total_price,
                note,
                paymentMethod: 'paypal',
                status: 'pending'  // luôn pending vì PayPal
            }, { transaction: t });

            for (const item of items) {
                const tour = await Tour.findByPk(item.tourId, { transaction: t, lock: t.LOCK.UPDATE });
                if (!tour) throw new Error(`Tour ${item.tourId} không tồn tại`);

                await BookingItem.create({
                    bookingId: booking.id,
                    tourId: item.tourId,
                    quantity: item.quantity,
                    price: item.price
                }, { transaction: t });
            }

            // Tạo PayPal order
            const itemsUSD = items.map(i => ({
                name: `Tour ID: ${i.tourId}`,
                unit_amount: Number((i.price / 24000).toFixed(2)),
                quantity: i.quantity
            }));
            const itemTotal = itemsUSD.reduce((sum, i) => sum + i.unit_amount * i.quantity, 0);

            const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
            request.prefer('return=representation');
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: itemTotal.toFixed(2),
                        breakdown: { item_total: { currency_code: 'USD', value: itemTotal.toFixed(2) } }
                    },
                    items: itemsUSD.map(i => ({
                        name: i.name,
                        unit_amount: { currency_code: 'USD', value: i.unit_amount.toFixed(2) },
                        quantity: String(i.quantity)
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
            const approveUrl = response.result.links.find(l => l.rel === 'approve')?.href;

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
            const booking = await Booking.findByPk(bookingId, {
                include: [{ model: BookingItem, as: 'items' }],
                transaction: t
            });
            if (!booking) throw new Error('Booking not found');

            // Trả lại số vé
            for (const item of booking.items) {
                const tour = await Tour.findByPk(item.tourId, { transaction: t });
                if (tour) {
                    tour.available_people += item.quantity;
                    await tour.save({ transaction: t });
                }
            }

            await BookingItem.destroy({ where: { bookingId }, transaction: t });
            await booking.destroy({ transaction: t });

            return { message: 'Booking deleted successfully' };
        });
    }

}

module.exports = BookingService;
