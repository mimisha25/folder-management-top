const { Router } = require('express');
const foldersRouter = Router();
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');

foldersRouter.route('/folders')
    .get(checkAuth, async (req, res) => {
        try {
            const folders = await prisma.folder.findMany({ where: { userId: req.session.userId } });
            const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
            res.render('folders/folders', { user, folders, currentPath: '/folders' });
        } catch (error) { res.status(500).send('Error fetching folders: ' + error.message) }
    })
    .post(checkAuth, async (req, res) => {
        const { name } = req.body;
        if (!name) return res.status(400).send('Folder name is required.');
        try {
            const newFolder = await prisma.folder.create({ data: { name: name, userId: req.session.userId } });
            res.redirect(`/folders?folderId=${newFolder.id}`);
        } catch (error) { res.status(500).send('Error creating folder: ' + error.message) }
    });

module.exports = foldersRouter;