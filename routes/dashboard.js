const { Router } = require('express');
const dashboardRouter = Router();
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const dashboard = require('../controller/dashboard');


dashboardRouter.get('/', checkAuth, catchAsync(dashboard.dashboardGet));

module.exports = dashboardRouter;