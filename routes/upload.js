const { Router } = require('express');
const uploadRouter = Router();
const path = require('path');
const multer = require('multer');
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');


module.exports = uploadRouter;