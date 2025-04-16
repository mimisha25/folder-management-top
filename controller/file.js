const prisma = require('../prisma-config')
const path = require('path');
const fs = require('fs');
const ExpressError = require('../utils/expressError');
const cloudinary = require('../cloudinary-config')

module.exports.showAllFiles = async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    const allFiles = await prisma.file.findMany({
        where: { userId: req.session.userId },
        include: { folder: true, user: true }
    });
    res.render('files/all-files', { allFiles, user, currentPath: '/files' });
}

module.exports.showFileDetails = async (req, res) => {
    const { id } = req.params;
    const file = await prisma.file.findUnique({ where: { id }, include: { folder: true } });
    if (!file || file.userId !== req.session.userId) throw new ExpressError('File not found or you don\'t have permission to view it.', 404);
    res.render('files/file-details', { file, user: req.user, currentPath: '/files' });
}

module.exports.deleteFile = async (req, res) => {
    const { id } = req.params;
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file || file.userId !== req.session.userId) throw new ExpressError('File not found or you don\'t have permission to delete it.', 404);
    await prisma.file.delete({ where: { id } });
    const filePath = path.join(__dirname, 'uploads', file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.redirect(`/folders/${file.folderId}`);
}


module.exports.uploadFile = async (req, res) => {
    if (!req.file) throw new ExpressError('No file uploaded.', 400);
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto',
    });
    const fileUrl = cloudinaryResult.secure_url;
    const { folderId } = req.body;
    const file = await prisma.file.create({
        data: {
            name: req.file.originalname,
            path: req.file.path,
            publicUrl: fileUrl,
            size: req.file.size,
            folderId,
            userId: req.session.userId,
        }
    });
    // if(fileUrl) fs.unlinkSync(req.file.path);
    res.redirect(`/folders/${folderId}`);
}
