// server/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/userRepository');

// Konfiguracija transportera za email (izvučeno iz registrationRoutes)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Ili drugi provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false } // Oprez s ovim u produkciji
});

class AuthService {
    async registerUser(userData) {
        const { username, email, password } = userData;

        // Provjera postoji li korisnik s tim emailom
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            const error = new Error('Korisnik s ovom email adresom već postoji.');
            error.statusCode = 409; // Conflict
            throw error;
        }
        // Dodatna validacija za username (npr. jedinstvenost) se može dodati ako je potrebno

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.createUser(username, email, hashedPassword);

        // Generiranje JWT tokena za verifikaciju
        const verificationToken = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Produženo vrijeme za verifikaciju, npr. 1h
        );

        // Slanje emaila za verifikaciju
        const mailOptions = {
            from: process.env.EMAIL_USER, // Koristi email iz .env
            to: email,
            subject: 'Verifikacija računa - Državna Matura App',
            html: `<p>Poštovani/a ${username},</p>
                   <p>Molimo kliknite na sljedeći link za verifikaciju vašeg računa:</p>
                   <a href="${process.env.BASE_URL_FRONTEND}/verify-email?token=${verificationToken}">Verificiraj račun</a>
                   <p>Ovaj link istječe za 1 sat.</p>
                   <p>Ako niste zatražili registraciju, molimo zanemarite ovaj email.</p>
                   <p>Srdačan pozdrav,<br/>Vaš Državna Matura Tim</p>`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Greška pri slanju e-pošte za verifikaciju:', emailError);
            // Razmotriti što napraviti ako email ne uspije - obrisati korisnika, označiti ga za ponovno slanje?
            // Za sada, registracija prolazi, ali verifikacija ovisi o emailu.
            // Možda baciti specifičnu grešku ili logirati za administrativnu intervenciju.
            const error = new Error('Registracija uspješna, ali došlo je do greške pri slanju emaila za verifikaciju.');
            error.statusCode = 500; // Ili neki custom kod
            // Nećemo baciti grešku koja prekida registraciju, već samo logirati.
            // Frontend će svejedno prikazati poruku o provjeri emaila.
        }
        
        // Ne vraćamo token ovdje, korisnik se mora verificirati
        return { message: "Uspješna registracija! Provjerite e-poštu za verifikaciju." };
    }

    async verifyEmail(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            const user = await userRepository.findUserById(userId);
            if (!user) {
                const error = new Error('Korisnik nije pronađen.');
                error.statusCode = 404;
                throw error;
            }

            if (user.verified) {
                const error = new Error('Račun je već verificiran.');
                error.statusCode = 400; // Bad request ili neki drugi odgovarajući status
                // Možemo svejedno generirati login token ako želimo da se korisnik odmah prijavi
            }
            
            await userRepository.setUserVerified(userId);
            const updatedUser = await userRepository.findUserById(userId); // Ponovno dohvati da imamo verified=true

            // Generiraj JWT token za prijavu (login)
            const loginToken = jwt.sign(
                {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    verified: updatedUser.verified
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } // Standardno trajanje sesije
            );

            return {
                message: 'Račun uspješno verificiran!',
                token: loginToken, // Token za automatsku prijavu
                user: { // Podaci korisnika za frontend
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    verified: updatedUser.verified
                }
            };
        } catch (jwtError) {
            console.error('Greška pri verifikaciji JWT-a:', jwtError);
            const error = new Error('Neispravan ili istekao token za verifikaciju.');
            error.statusCode = 400;
            throw error;
        }
    }

    async loginUser(credentials) {
        const { email, password } = credentials;

        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            const error = new Error('Neispravan email ili lozinka.');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordMatch) {
            const error = new Error('Neispravan email ili lozinka.');
            error.statusCode = 401;
            throw error;
        }

        if (!user.verified) {
            const error = new Error('Račun nije verificiran. Molimo provjerite svoj email.');
            error.statusCode = 403; // Forbidden
            // Ovdje bismo mogli dodati logiku za ponovno slanje verifikacijskog emaila
            throw error;
        }

        // Generiranje JWT tokena za prijavu
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                verified: user.verified
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            message: 'Uspješna prijava!',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();