const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {rejectUnauthorized : false}
});

//Ruta za registraciju korisnika
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        //Spremamo korisnika u bazu
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'user']
        );

        const user = result.rows[0];

        //Generiranje JWT tokena za verifikaciju
        const verificationToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        //Šaljemo email za verifikaciju
        const mailOptions = {
            from: 'vas.email@gmail.com',
            to: email,
            subject: 'Verifikacija računa',
            html: `<p>Molimo kliknite na sljedeći link za verifikaciju vašeg računa:</p>
                   <a href="${process.env.BASE_URL}/register/verify-email?token=${verificationToken}">Verificiraj račun</a>
                   <p>Link istječe za 15 minuta.</p>`//Mijenjamo BASE_URL sa stvarnim URLom u produkciji
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Greška pri slanju e-pošte:', error);
            }
        });

        res.status(201).json({ message: "Uspješna registracija! Provjerite e-poštu za verifikaciju." });
    } catch (err) {
        console.error('Greška pri registraciji:', err);
        res.status(500).json({ error: 'Došlo je do greške' });
    }
});

//Ruta za verifikaciju emaila
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Oznacavamo korisnika kao verificiranog
        await pool.query('UPDATE users SET verified = TRUE WHERE id = $1', [decoded.userId]);

        //Dohvatite verificiranog korisnika iz baze
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [
            decoded.userId,
        ]);
        const user = result.rows[0];
    
        //Generiramo JWT token za prijavu
        const jwtToken = jwt.sign(
            {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            verified: true
            }, //Postavljamo verified na true
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    
        //Stavljamo token u cookie
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            secure: false, //Postavit cemo na true u produkciji (HTTPS)
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000, //1h
        });
    
        //Redirectamo korisnika na odrediste nakon uspjesne verifikacije emaila
        // res.redirect(`${process.env.BASE_URL}/verification-success`);
        res.status(200).json({ message: 'Račun uspješno verificiran!', token: jwtToken }); //Ovo je samo za POSTMAN testiranje
    }   catch (err) {
            console.error('Greška pri verifikaciji:', err);
            res.status(400).json({ error: 'Neispravan ili istekao token za verifikaciju.' });
        }
});

module.exports = router;