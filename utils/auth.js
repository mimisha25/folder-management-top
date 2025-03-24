const catchAsync = require('./catchAsync');
const prisma = require('../prisma-config')


const checkAuth = catchAsync(async (req, res, next) => {
    if (!req.session.userId) res.redirect('/login');
    const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    req.user = user;
    next();
});
module.exports = checkAuth;