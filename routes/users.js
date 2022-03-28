const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/users');

// возвращает информацию о пользователе
router.get('/get-user-info', getUserInfo);

module.exports = router;