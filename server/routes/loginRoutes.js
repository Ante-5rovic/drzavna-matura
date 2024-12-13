const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

//Ruta za login
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        //Dohvat korisnika iz baze
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Neispravan email  ili lozinka.' });
        }

        const user = result.rows[0];

        //Usporedba unesene lozinke s hashom spremljenim u bazi
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: 'Neispravan email ili lozinka.' });
        }

        //Generiranje JWT tokena
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        //Postavljanje tokena u httpOnly cookie
        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: false, //To cemo postaviti na true u produkciji kada budemo imali HTTPS
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 //1h
        });

            // Vraćanje podataka o korisniku
        res.status(200).json({
            message: 'Uspješna prijava!',
            user: {
            username: user.username,
            email: user.email,
            role: user.role
            }
        });
  
    } catch (err) {
        console.error('Greška pri prijavi:', err);
        res.status(500).json({ error: 'Došlo je do greške prilikom prijave.' });
    }
});

module.exports = router;