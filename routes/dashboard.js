const { Router } = require('express');
const dashboardRouter = Router();
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const dashboard = require('../controller/dashboard');


dashboardRouter.route('/register')
    .get(dashboard.createUserGet)
    .post(catchAsync(dashboard.createUserPost));

dashboardRouter.route('/login')
    .get(dashboard.loginUserGet)
    .post(dashboard.loginUserPost);

dashboardRouter.get('/logout', dashboard.logout);

dashboardRouter.get('/dashboard', checkAuth, catchAsync(dashboard.dashboardGet));

module.exports = dashboardRouter;