const express = require('express');
const router = express.Router();

const roleRouter = require('./role.routes');

router.use('/roles', roleRouter);

module.exports = router;