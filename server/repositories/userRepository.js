// server/repositories/user.repository.js
const pool = require('../db');

class UserRepository {
    async createUser(username, email, hashedPassword) {
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, role, verified) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, verified',
            [username, email, hashedPassword, 'user', false] // verified je false po defaultu pri kreiranju
        );
        return result.rows[0];
    }

    async findUserByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async findUserById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async setUserVerified(userId) {
        await pool.query('UPDATE users SET verified = TRUE, updated_at = NOW() WHERE id = $1', [userId]);
    }
}

module.exports = new UserRepository();