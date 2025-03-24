const { Router } = require('express');
const filesRouter = Router();
const prisma = require('../prisma-config')
const path = require('path');
const fs = require('fs');
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


filesRouter.get('/files', checkAuth, catchAsync(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    const allFiles = await prisma.file.findMany({
        where: { userId: req.session.userId },
        include: { folder: true, user: true }
    });
    res.render('files/all-files', { allFiles, user, currentPath: '/files' });
}));


filesRouter.route('/files/:id')
    .get(checkAuth, catchAsync(async (req, res) => {
        const { id } = req.params;
        const file = await prisma.file.findUnique({ where: { id }, include: { folder: true } });
        if (!file || file.userId !== req.session.userId) throw new ExpressError('File not found or you don\'t have permission to view it.', 404);
        res.render('files/file-details', { file, user: req.user, currentPath: '/files' });
    }))
    .delete(checkAuth, catchAsync(async (req, res) => {
        const { id } = req.params;
        const file = await prisma.file.findUnique({ where: { id } });
        if (!file || file.userId !== req.session.userId) throw new ExpressError('File not found or you don\'t have permission to delete it.', 404);
        await prisma.file.delete({ where: { id } });
        const filePath = path.join(__dirname, 'uploads', file.path);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.redirect(`/folders/${file.folderId}`);
    }));


module.exports = filesRouter;