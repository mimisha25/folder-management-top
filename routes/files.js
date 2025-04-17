const { Router } = require('express');
const filesRouter = Router();
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const files = require('../controller/file');

filesRouter.get('/', checkAuth, catchAsync(files.showAllFiles));

filesRouter.route('/:id')
    .get(checkAuth, catchAsync(files.showFileDetails))
    .delete(checkAuth, catchAsync(files.deleteFile));


module.exports = filesRouter;