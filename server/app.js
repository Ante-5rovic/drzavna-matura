const express = require('express');
const app = express();
const port = 3000;
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

//Rute
const examRoutes = require('./routes/examRoutes');
const maturaRoutes = require('./routes/maturaListRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const loginRoutes = require('./routes/loginRoutes');

//Middleware
app.use(express.json());
app.use(cookieParser());

const authenticateToken = require('./middleware/authenticateToken');
const csrfProtection = csrf({ cookie: true });

app.use('/exam', examRoutes);
app.use('/mature', maturaRoutes);
app.use('/register', csrfProtection, registrationRoutes);
app.use('/login', loginRoutes);
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
});
