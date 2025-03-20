const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    }
    next();
};
module.exports = checkAuth;