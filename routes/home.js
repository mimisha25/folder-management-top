const { Router } = require('express');
const homeRouter = Router();
const prisma = require('../prisma-config')
const catchAsync = require('../utils/catchAsync');


homeRouter.use('/home', catchAsync(async (req, res) => {
    let user = null;
    if (req.session.userId) user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    res.render('home', { user, currentPath: '/home' })
}))

module.exports = homeRouter;