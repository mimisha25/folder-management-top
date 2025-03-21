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

module.exports = filesRouter;