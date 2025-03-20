const { Router } = require('express');
const dashboardRouter = Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');

dashboardRouter.route('/register')
    .get((req, res) => {
        res.render('auth', { link: '/login', action: '/register', linkT: 'Log In', header: 'Sign In' });
    })

module.exports = dashboardRouter;