const ReviewService = require('../services/review.service');

class ReviewController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                result = await ReviewService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy danh sách reviews thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await ReviewService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách reviews thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách reviews',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await ReviewService.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Tạo review thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo review',
                error: error.message
            });
        }
    }

    async detail(req, res) {
        try {
            const data = await ReviewService.detail(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Lấy review thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy review',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await ReviewService.update(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Cập nhật review thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật review',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const data = await ReviewService.delete(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Xóa review thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa review',
                error: error.message
            });
        }
    }

    async findByTour(req, res) {
        try {
            const { tourId } = req.params;
            const data = await ReviewService.findByTour(tourId);
            return res.status(200).json({
                success: true,
                message: 'Lấy danh sách review theo tour thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy review theo tour',
                error: error.message
            });
        }
    }

}

module.exports = new ReviewController();
