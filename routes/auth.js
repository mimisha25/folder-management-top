const { Router } = require('express');
const authRouter = Router();
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const dashboard = require('../controller/dashboard');

authRouter.route('/register')
    .get(dashboard.createUserGet)
    .post(catchAsync(dashboard.createUserPost));

authRouter.route('/login')
    .get(dashboard.loginUserGet)
    .post(dashboard.loginUserPost);

authRouter.get('/logout', dashboard.logout);

module.exports = authRouter;