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


foldersRouter.route('/folders/:id')
    .get(checkAuth, async (req, res) => {
        const { id } = req.params;
        try {
            const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
            const folder = await prisma.folder.findUnique({ where: { id }, include: { files: true } });
            if (!folder || folder.userId !== req.session.userId) return res.status(404).send('Folder not found.');
            res.render('folders/folder-details', { folder, user, currentPath: '/folders' });
        } catch (error) { res.status(500).send('Error fetching folder: ' + error.message); }
    })
    .post(checkAuth, async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).send('Folder name is required.');
        try {
            const updatedFolder = await prisma.folder.update({ where: { id }, data: { name } });
            res.redirect(`/folders/${id}`);
        } catch (error) { res.status(500).send('Error updating folder: ' + error.message) }
    })
    .delete(checkAuth, async (req, res) => {
        const { id } = req.params;
        try {
            await prisma.file.deleteMany({ where: { folderId: id } });
            await prisma.folder.delete({ where: { id } });
            res.redirect('/folders');
        } catch (error) { res.status(500).send('Error deleting folder: ' + error.message) }
    });

foldersRouter.post('/share-folder/:id', async (req, res) => {
    const folderId = req.params.id;
    const duration = parseInt(req.body.duration, 10);
    try {
        const tokenString = `${folderId}-${Date.now()}`;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + duration);
        await prisma.folder.update({ where: { id: folderId }, data: { shareToken: tokenString, shareExpiresAt: expirationDate } });
        const shareLink = `http://localhost:3001/share/${tokenString}`;
        const userId = req.session.userId;
        if (!userId) return res.status(401).send('User is not logged in.');
        const user = await prisma.user.findUnique({ where: { id: userId } });
        res.render('folders/folder-details', { shareLink, user, folder: await prisma.folder.findUnique({ where: { id: folderId } }) });
    } catch (error) { res.status(500).send('Error creating share link: ' + error.message) }
});


module.exports = foldersRouter;