const BookingService = require('../services/booking.service');

class BookingController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 5;
            const offset = (page - 1) * pageSize;

            const { count, rows } = await BookingService.findAll({ offset, limit: pageSize });
            res.status(200).json({
                success: true,
                message: 'Bookings fetched successfully',
                data: rows,
                total: count,
                page,
                pageSize
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async createBooking(req, res) {
        try {
            const { booking, approveUrl } = await BookingService.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: booking,
                ...(approveUrl && { approveUrl })
            });

        } catch (err) {
            console.error("Booking creation error:", err);
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    async getBookingDetailsByUser(req, res) {
        try {
            const userId = req.params.id || req.user?.id;
            const data = await BookingService.getBookingsByUser(userId);
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async update(req, res) {
        try {
            const bookingId = req.params.id;
            const updated = await BookingService.update(bookingId, req.body);
            res.status(200).json({
                success: true,
                message: 'Cập nhật thành công',
                data: updated
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }


    async detail(req, res) {
        try {
            const data = await BookingService.detail(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Booking not found' });
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async deleteBooking(req, res) {
        try {
            const data = await BookingService.delete(req.params.bookingId);
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = new BookingController();
