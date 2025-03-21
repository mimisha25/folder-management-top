const { Router } = require('express');
const uploadRouter = Router();
const path = require('path');
const multer = require('multer');
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});


const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf|txt|docx|mp4|avi|mov|mp3|wav/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extname && mimeType) return cb(null, true);
    else cb(new Error('Invalid file type. Only images, videos, audio, PDFs, and documents are allowed.'));
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});


uploadRouter.post('/upload', checkAuth, upload.single('file'), async (req, res) => {
    const { folderId } = req.body;
    const publicUrl = `/uploads/${path.basename(req.file.path)}`;
    try {
        const file = await prisma.file.create({
            data: {
                name: req.file.originalname,
                path: req.file.path,
                publicUrl: publicUrl,
                size: req.file.size,
                folderId,
                userId: req.session.userId,
            }
        });
        res.redirect(`/folders/${folderId}`);
    } catch (error) { res.status(500).send('Error uploading file: ' + error.message); }
});

module.exports = uploadRouter;