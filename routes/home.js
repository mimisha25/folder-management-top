const { Router } = require('express');
const homeRouter = Router();
const catchAsync = require('../utils/catchAsync');
const dashboard = require('../controller/dashboard');

homeRouter.use('/home', catchAsync(dashboard.homePage))

module.exports = homeRouter;