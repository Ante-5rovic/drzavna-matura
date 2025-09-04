const express = require('express');
const app = express();
const port = 3000;
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const logoutRoutes = require('./routes/logoutRoutes');

//Rute
const examRoutes = require('./routes/examRoutes');
const maturaRoutes = require('./routes/maturaListRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const loginRoutes = require('./routes/loginRoutes');
const getUserData = require('./routes/getUserData');

//Middleware
app.use(express.json());
app.use(cookieParser());

const authenticateToken = require('./middleware/authenticateToken');
const csrfProtection = csrf({ cookie: true });

app.use('/exams', examRoutes);
app.use('/mature', maturaRoutes);
app.use('/register', csrfProtection, registrationRoutes);
app.use('/login', csrfProtection, loginRoutes);
app.use('/logout', csrfProtection, logoutRoutes);
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
app.use('/get-user-data', getUserData);

app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
});
