const Booking = require('../models/booking.model');
const BookingItem = require('../models/bookingItem.model');
const Tour = require('../models/tour.model');
const { client: paypalClient } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 * Helper: convert cart items sang PayPal format
 */
const convertBookingToPaypal = (booking, usdRate = 24000) => {
    const usdPrice = parseFloat((booking.total_price / usdRate).toFixed(2));
    return {
        paypalItems: [
            {
                name: `Booking tour ID: ${booking.tourId}`,
                unit_amount: { currency_code: "USD", value: usdPrice.toFixed(2) },
                quantity: "1"
            }
        ],
        itemTotal: usdPrice.toFixed(2)
    };
};

/**
 * Create PayPal order cho booking
 */
const create = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: "bookingId is required" });
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const { paypalItems, itemTotal } = convertBookingToPaypal(booking);

        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{ amount: { currency_code: "USD", value: itemTotal, breakdown: { item_total: { currency_code: "USD", value: itemTotal } } }, items: paypalItems }],
            application_context: {
                brand_name: "My Travel App",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `http://localhost:3000/bookings/paypal-success?bookingId=${booking.id}`,
                cancel_url: `http://localhost:3000/bookings/paypal-cancel?bookingId=${booking.id}`,
            }
        });

        const order = await paypalClient().execute(request);

        booking.paypal_order_id = order.result.id;
        await booking.save();

        res.status(201).json({
            success: true,
            message: "PayPal order created for booking",
            approveUrl: order.result.links.find(link => link.rel === "approve")?.href,
            data: booking
        });

    } catch (err) {
        console.error("Error creating PayPal order for booking:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create PayPal order for booking",
            error: err.message
        });
    }
};

/**
 * Capture PayPal order cho booking
 */
const capture = async (req, res) => {
    const t = await Booking.sequelize.transaction();
    try {
        const { bookingId } = req.body;
        if (!bookingId) throw new Error("bookingId is required");

        // Lấy booking + items, lock để tránh race condition
        const booking = await Booking.findByPk(bookingId, {
            include: [{ model: BookingItem, as: 'items' }],
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if (!booking) throw new Error("Booking not found");
        if (!booking.paypal_order_id) throw new Error("Booking chưa thanh toán PayPal");

        // Capture PayPal
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(booking.paypal_order_id);
        request.requestBody({});
        await paypalClient().execute(request);

        // Chỉ trừ vé nếu chưa trừ lần nào
        if (!booking.tickets_reduced) {
            for (const item of booking.items) {
                const tour = await Tour.findByPk(item.tourId, { transaction: t, lock: t.LOCK.UPDATE });
                if (!tour) continue;
                if (tour.available_people < item.quantity) throw new Error(`Tour ${tour.name} không đủ số lượng vé`);
                tour.available_people -= item.quantity;
                await tour.save({ transaction: t });
            }

            // Đánh dấu đã trừ vé và cập nhật trạng thái paid
            booking.tickets_reduced = true;
            booking.status = 'paid';
            await booking.save({ transaction: t });
        }

        await t.commit();
        res.status(200).json({ success: true, message: "Payment captured & tickets updated", data: booking });

    } catch (err) {
        await t.rollback();
        console.error("PayPal capture error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { create, capture };
