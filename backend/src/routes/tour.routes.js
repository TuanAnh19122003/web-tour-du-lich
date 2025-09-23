const express = require('express');
const router = express.Router();
const controller = require('../controllers/tour.controller');
const upload = require('../utils/multer');

router.get('/', controller.findAll);
router.get('/destinations', controller.getDestinations);
router.post('/', upload.single('image'), controller.create);
router.put('/:id', upload.single('image'), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;