const { Router } = require('express');
const filesRouter = Router();
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const files = require('../controller/file');

filesRouter.get('/files', checkAuth, catchAsync(files.showAllFiles));

filesRouter.route('/files/:id')
    .get(checkAuth, catchAsync(files.showFileDetails))
    .delete(checkAuth, catchAsync(files.deleteFile));


module.exports = filesRouter;