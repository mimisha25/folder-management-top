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

app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.session());

// app.use((req, res, next) => {
//     res.locals.user = req.user || null;
//     next();
// })
// app.use((req, res, next) => {
//     res.locals.currentPath = req.path;
//     next();
// });
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something is wrong!";
    res.status(statusCode).render('partials/error', { err });

})

const dashboardRouter = require('./routes/dashboard');
const foldersRouter = require('./routes/folder');
const filesRouter = require('./routes/files');
const homeRouter = require('./routes/home');
const uploadRouter = require('./routes/upload');
app.use('/', uploadRouter);
app.use('/', foldersRouter);
app.use('/', filesRouter);
app.use('/', homeRouter);
app.use('/', dashboardRouter);



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));