const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./prisma-config')


passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return done(null, false);
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? done(null, user) : done(null, false);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;