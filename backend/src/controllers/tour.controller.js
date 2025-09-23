const TourService = require('../services/tour.service');

class TourController {
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page);
            const pageSize = parseInt(req.query.pageSize);
            const search = req.query.search || null;

            let result;

            if (!page || !pageSize) {
                result = await TourService.findAll({ search });
                return res.status(200).json({
                    success: true,
                    message: 'Lấy tất cả thành công',
                    data: result.rows,
                    total: result.count
                });
            }

            const offset = (page - 1) * pageSize;
            result = await TourService.findAll({ offset, limit: pageSize, search });

            res.status(200).json({
                success: true,
                message: 'Lấy danh sách thành công',
                data: result.rows,
                total: result.count,
                page,
                pageSize
            });
        } catch (error) {
            console.error('Lỗi:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy danh sách',
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const data = await TourService.create(req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Thêm thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await TourService.update(req.params.id, req.body, req.file);

            res.status(200).json({
                success: true,
                message: 'Cập nhật thành công',
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật",
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletedCount = await TourService.delete(id);

            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy để xóa'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Xóa thành công'
            });
        } catch (error) {
            console.error('Lỗi: ', error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi xóa",
                error: error.message
            });
        }
    }

    async getDestinations(req, res) {
        try {
            const data = await TourService.getDestinations();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách điểm đến thành công',
                data
            });
        } catch (error) {
            console.error('Lỗi getDestinations:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy điểm đến',
                error: error.message
            });
        }
    }

}

module.exports = new TourController();