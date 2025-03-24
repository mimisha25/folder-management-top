const { Router } = require('express');
const dashboardRouter = Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prisma-config');
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

dashboardRouter.route('/register')
    .get((req, res) => {
        res.render('auth', { link: '/login', action: '/register', linkT: 'Log In', header: 'Sign In' });
    })
    .post(catchAsync(async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword }
        });
        res.redirect('/login');
    }));



dashboardRouter.route('/login')
    .get((req, res) => {
        res.render('auth', { action: '/login', link: '/register', header: 'Log In', linkT: 'Sign In' });
    })
    .post(async (req, res) => {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) throw new ExpressError('User not found', 400);
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            req.session.userId = user.id;
            res.redirect('/dashboard');
        } else throw new ExpressError('Invalid password', 400);
    });

dashboardRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw new ExpressError('Error logging out', 500);
        res.redirect('/home');
    });
});


dashboardRouter.get('/dashboard', checkAuth, catchAsync(async (req, res) => {
    const folders = await prisma.folder.findMany({ where: { userId: req.session.userId } });
    res.render('dashboard', { user: req.user, folders, currentPath: '/dashboard' });
}));

module.exports = dashboardRouter;