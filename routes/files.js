const { Router } = require('express');
const filesRouter = Router();
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');

filesRouter.get('/files', checkAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
        const allFiles = await prisma.file.findMany({
            where: { userId: req.session.userId },
            include: { folder: true, user: true }
        });
        res.render('files/all-files', { allFiles, user, currentPath: '/files' });
    } catch (error) { res.status(500).send('Error fetching files.') }
});

filesRouter.route('/files/:id')
    .get(checkAuth, async (req, res) => {
        const { id } = req.params;
        try {
            const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
            const file = await prisma.file.findUnique({ where: { id }, include: { folder: true } });
            if (!file || file.userId !== req.session.userId) return res.status(404).send('File not found or you don\'t have permission to view it.')
            res.render('files/file-details', { file, user, currentPath: '/files' });
        } catch (error) { res.status(500).send('Error fetching file details: ' + error.message) }
    })
    .delete(checkAuth, async (req, res) => {
        const { id } = req.params;
        try {
            const file = await prisma.file.findUnique({ where: { id } });
            if (!file || file.userId !== req.session.userId) return res.status(404).send('File not found or you don\'t have permission to delete it.');
            await prisma.file.delete({ where: { id } });
            const filePath = path.join(__dirname, 'uploads', file.path);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            res.redirect(`/folders/${file.folderId}`);
        } catch (error) { res.status(500).send('Error deleting file: ' + error.message); }
    });


module.exports = filesRouter;