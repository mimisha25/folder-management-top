const { Router } = require('express');
const filesRouter = Router();
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');



module.exports = filesRouter;