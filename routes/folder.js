const { Router } = require('express');
const foldersRouter = Router();
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');


module.exports = foldersRouter;