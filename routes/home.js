const { Router } = require('express');
const homeRouter = Router();
const prisma = require('../prisma-config')


homeRouter.use('/home', async (req, res) => {
    try {
        let user = null;
        if (req.session.userId) user = await prisma.user.findUnique({ where: { id: req.session.userId } });
        res.render('home', { user, currentPath: '/home' })
    } catch (error) { res.status(500).send('Error fetching folder: ' + error.message); }
})

module.exports = homeRouter;