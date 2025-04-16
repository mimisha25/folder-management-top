const prisma = require('../prisma-config')
const ExpressError = require('../utils/expressError')
require('dotenv').config();

module.exports.showAllFolders = async (req, res) => {
    const folders = await prisma.folder.findMany({ where: { userId: req.session.userId } });
    res.render('folders/folders', { user: req.user, folders, currentPath: '/folders', port: process.env.PORT, });
}

module.exports.createFolder = async (req, res) => {
    const { name } = req.body;
    if (!name) throw new ExpressError('Folder name is required.', 400);
    const newFolder = await prisma.folder.create({ data: { name: name, userId: req.session.userId } });
    res.redirect(`/folders?folderId=${newFolder.id}`);
}

module.exports.showOneFolder = async (req, res) => {
    const { id } = req.params;
    const folder = await prisma.folder.findUnique({ where: { id }, include: { files: true } });
    if (!folder || folder.userId !== req.session.userId) throw new ExpressError('Folder not found.', 404);
    res.render('folders/folder-details', { folder, user: req.user, currentPath: '/folders' });
}

module.exports.editFolderName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) throw new ExpressError('Folder name is required.', 400);
    const updatedFolder = await prisma.folder.update({ where: { id }, data: { name } });
    res.redirect(`/folders/${id}`);
}

module.exports.deleteFolder = async (req, res) => {
    const { id } = req.params;
    await prisma.file.deleteMany({ where: { folderId: id } });
    await prisma.folder.delete({ where: { id } });
    res.redirect('/folders');
}

module.exports.createShareLink = async (req, res) => {
    const folderId = req.params.id;
    const duration = parseInt(req.body.duration, 10);
    const tokenString = `${folderId}-${Date.now()}`;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + duration);
    await prisma.folder.update({ where: { id: folderId }, data: { shareToken: tokenString, shareExpiresAt: expirationDate } });
    const shareLink = `http://localhost:${process.env.PORT}/share/${tokenString}`;
    res.render('folders/folder-details', { shareLink, user: req.user, folder: await prisma.folder.findUnique({ where: { id: folderId } }) });
}

module.exports.showCreatedLink = async (req, res) => {
    const { token } = req.params;
    const folder = await prisma.folder.findFirst({ where: { shareToken: token }, include: { files: true } });
    if (!folder) throw new ExpressError('Shared folder not found.', 404);
    if (token !== folder.shareToken) throw new ExpressError('Invalid share link.', 400);
    const currentDate = new Date();
    if (currentDate > new Date(folder.shareExpiresAt)) throw new ExpressError('This share link has expired.', 400);
    const user = req.session.userId
        ? await prisma.user.findUnique({ where: { id: req.session.userId } })
        : null;
    const shareLink = `http://localhost:${process.env.PORT}/share/${token}`;
    const shareExpiresAt = folder.shareExpiresAt;
    if (shareExpiresAt) {
        const date = shareExpiresAt.toLocaleDateString();
        const time = shareExpiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        folder.formattedShareExpiresAt = { date, time };
    }
    res.render('folders/shared-folder', { folder, shareLink, user, currentPath: '/shared' });
}

module.exports.showAllSharedLinks = async (req, res) => {
    const sharedFolders = await prisma.folder.findMany({
        where: { userId: req.session.userId, shareToken: { not: null } }
    });
    sharedFolders.forEach(folder => {
        const shareExpiresAt = folder.shareExpiresAt;
        if (shareExpiresAt) {
            const date = shareExpiresAt.toLocaleDateString();
            const time = shareExpiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            folder.formattedShareExpiresAt = { date, time };
        }
    });
    res.render('folders/shared-folders-list', { sharedFolders, user: req.user, currentPath: '/shared' });
}
