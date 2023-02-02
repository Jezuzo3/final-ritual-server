const express = require('express');
const router = express.Router();
const { verifyEmail } = require('../middlewares/verifyEmail');

const userController = require('../controllers/userController');

router.post('/user', verifyEmail, userController.loginUser);

module.exports = router;