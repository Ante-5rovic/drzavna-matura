const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/userRepository');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false } //promijeniti u produkciji
});

class AuthService {
    async registerUser(userData) {
        const { username, email, password } = userData;

        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            const error = new Error('Korisnik s ovom email adresom već postoji.');
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.createUser(username, email, hashedPassword);

        const verificationToken = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verifikacija računa - Državna Matura App',
            html: `<p>Poštovani/a ${username},</p>
                   <p>Molimo kliknite na sljedeći link za verifikaciju vašeg računa:</p>
                   <a href="${process.env.BASE_URL_FRONTEND || 'http://localhost:5000'}/verify-email?token=${verificationToken}">Verificiraj račun</a>
                   <p>Ovaj link istječe za 1 sat.</p>
                   <p>Ako niste zatražili registraciju, molimo zanemarite ovaj email.</p>
                   <p>Srdačan pozdrav,<br/>Vaš MATURKO Tim</p>`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Greška pri slanju e-pošte za verifikaciju:', emailError);
            const error = new Error('Registracija uspješna, ali došlo je do greške pri slanju emaila za verifikaciju.');
            error.statusCode = 500;
        }
        
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
                error.statusCode = 400;
            }
            
            await userRepository.setUserVerified(userId);
            const updatedUser = await userRepository.findUserById(userId);

            const loginToken = jwt.sign(
                {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    verified: updatedUser.verified
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return {
                message: 'Račun uspješno verificiran!',
                token: loginToken,
                user: {
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
            error.statusCode = 401;
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
            error.statusCode = 403;
            throw error;
        }

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