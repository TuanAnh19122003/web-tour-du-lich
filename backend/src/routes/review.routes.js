const express = require('express');
const router = express.Router();
const controller = require('../controllers/review.controller');

router.get('/', controller.findAll);
router.get('/:id', controller.detail);
router.get('/tour/:tourId', controller.findByTour);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
