require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./passport-config')
const PORT = process.env.PORT || 3000;
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
const ExpressError = require('./utils/expressError')

app.use(flash());