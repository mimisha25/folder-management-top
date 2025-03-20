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


module.exports = dashboardRouter;