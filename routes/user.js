const express = require('express')
const router = express.Router()
const User = require('../models/user');
const {catchAsync} = require('../utils/catchAsync');
const passport = require('passport');
const {storeReturnTo,isLoggedIn} = require('../middleware');

const users = require('../controllers/user')

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo,passport.authenticate('local', { failureFlash: true,failureRedirect: '/login' }),users.login )

router.get('/logout',users.logout)

module.exports = router