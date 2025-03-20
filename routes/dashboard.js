const { Router } = require('express');
const dashboardRouter = Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prisma-config')
const checkAuth = require('../utils/auth');
const catchAsync = require('../utils/catchAsync');

dashboardRouter.route('/register')
    .get((req, res) => {
        res.render('auth', { link: '/login', action: '/register', linkT: 'Log In', header: 'Sign In' });
    })
    .post(async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await prisma.user.create({
                data: { username, password: hashedPassword }
            });
            res.redirect('/login');
        } catch (error) { res.status(400).send('Error registering user') }
    });


dashboardRouter.route('/login')
    .get((req, res) => {
        res.render('auth', { action: '/login', link: '/register', header: 'Log In', linkT: 'Sign In' });
    })
    .post(async (req, res) => {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(400).send('User not found');
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            req.session.userId = user.id;
            res.redirect('/dashboard');
        } else res.status(400).send('Invalid password');
    });

module.exports = dashboardRouter;