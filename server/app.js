// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

const authenticateToken = require('./middleware/authenticateToken');

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
});

const adminRoutes = require('./routes/adminRoutes');
const examRoutes = require('./routes/examRoutes');
const maturaListRoutes = require('./routes/maturaListRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const loginRoutes = require('./routes/loginRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const getUserDataRoutes = require('./routes/getUserData');

app.get(`/csrf-token`, csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use(`/register`, csrfProtection, registrationRoutes);
app.use(`/login`, csrfProtection, loginRoutes);
app.use(`/logout`, logoutRoutes);
app.use(`/user`, authenticateToken, getUserDataRoutes);
app.use(`/admin`, /*authenticateToken,*/ adminRoutes);
app.use(`/exams`, examRoutes);
app.use(`/mature`, maturaListRoutes);

module.exports = app;
