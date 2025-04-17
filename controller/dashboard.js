const bcrypt = require('bcryptjs');
const prisma = require('../prisma-config');
const ExpressError = require('../utils/expressError');

module.exports.createUserGet = (req, res) => {
    res.render('auth', { link: '/auth/login', action: '/auth/register', linkT: 'Log In', header: 'Sign In' });
};

module.exports.createUserPost = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { username, password: hashedPassword }
    });
    res.redirect('/auth/login');
};


module.exports.loginUserGet = (req, res) => {
    res.render('auth', { action: '/auth/login', link: '/auth/register', header: 'Log In', linkT: 'Sign In' });
}

module.exports.loginUserPost = async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new ExpressError('User not found', 400);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
        req.session.userId = user.id;
        res.redirect('/dashboard');
    } else throw new ExpressError('Invalid password', 400);
}

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw new ExpressError('Error logging out', 500);
        res.redirect('/');
    });
}

module.exports.dashboardGet = async (req, res) => {
    const folders = await prisma.folder.findMany({ where: { userId: req.session.userId } });
    res.render('dashboard', { user: req.user, folders, currentPath: '/dashboard' });
}


module.exports.homePage = async (req, res) => {
    let user = null;
    if (req.session.userId) user = await prisma.user.findUnique({ where: { id: req.session.userId } });
    res.render('home', { user, currentPath: '/' })
}