const pool = require('../db');

class SubjectRepository {
    async findAll() {
        const result = await pool.query('SELECT id, name FROM subject ORDER BY name;');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT id, name FROM subject WHERE id = $1;', [id]);
        return result.rows[0];
    }

    async findByName(name) {
        const result = await pool.query('SELECT id, name FROM subject WHERE name = $1;', [name]);
        return result.rows[0];
    }

    async create(subjectData) {
        const { name } = subjectData;
        const result = await pool.query(
            'INSERT INTO subject (name) VALUES ($1) RETURNING id, name;',
            [name]
        );
        return result.rows[0];
    }

    async update(id, subjectData) {
        const { name } = subjectData;
        const result = await pool.query(
            'UPDATE subject SET name = $1 WHERE id = $2 RETURNING id, name;',
            [name, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM subject WHERE id = $1 RETURNING id;', [id]);
        return result;
    }
}

module.exports = new SubjectRepository();