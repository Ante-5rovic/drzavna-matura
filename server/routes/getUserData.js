const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    try {
        const token = req.cookies.jwtToken;

        if (!token) {
            return res.status(401).json({ error: 'Token nije pronađen. Korisnik nije prijavljen.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        });
    } catch (err) {
        console.error('Greška pri dohvaćanju korisničkih podataka:', err);
        res.status(401).json({ error: 'Neispravan ili istekao token.' });
    }
});

module.exports = router;
