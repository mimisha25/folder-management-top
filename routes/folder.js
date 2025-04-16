const { Router } = require('express');
const foldersRouter = Router();
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const folders = require('../controller/folder');


foldersRouter.route('/folders')
    .get(checkAuth, catchAsync(folders.showAllFolders))
    .post(checkAuth, catchAsync(folders.createFolder));

foldersRouter.route('/folders/:id')
    .get(checkAuth, catchAsync(folders.showOneFolder))
    .post(checkAuth, catchAsync(folders.editFolderName))
    .delete(checkAuth, catchAsync(folders.deleteFolder));

foldersRouter.post('/share-folder/:id', catchAsync(folders.createShareLink));

foldersRouter.get('/share/:token', catchAsync(folders.showCreatedLink));

foldersRouter.get('/shared', checkAuth, catchAsync(folders.showAllSharedLinks));

module.exports = foldersRouter;