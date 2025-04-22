require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./passport-config')
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const flash = require('connect-flash');
const PrismaSessionStore = require('./prisma-session-store');
const prisma = require('./prisma-config')


app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore({
        db: prisma,
    }),
    cookie: {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.session());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('trust proxy', 1);
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something is wrong!";
    res.status(statusCode).render('partials/error', { err });

})

const dashboardRouter = require('./routes/dashboard');
const foldersRouter = require('./routes/folder');
const filesRouter = require('./routes/files');
const homeRouter = require('./routes/home');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/files', uploadRouter);
app.use('/files', filesRouter);
app.use('/folders', foldersRouter);



app.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${PORT}`));