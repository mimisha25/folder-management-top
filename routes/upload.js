const { Router } = require('express');
const uploadRouter = Router();
const path = require('path');
const multer = require('multer');
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');
const cloudinary = require('../cloudinary-config')
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


uploadRouter.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    try {
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
    } catch (error) { res.status(500).send('Error uploading file to Cloudinary: ' + error.message) }
});


module.exports = uploadRouter;