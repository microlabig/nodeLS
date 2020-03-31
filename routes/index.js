const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/home');
const ctrlAdmin = require('../controllers/admin');
const ctrlLogin = require('../controllers/login');

router.get('/', ctrlHome.get);
router.post('/', ctrlHome.post);

router.get('/admin', ctrlAdmin.get);
router.get('/login', ctrlLogin.get);

module.exports = router;
