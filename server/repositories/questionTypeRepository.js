// server/repositories/questionTypeRepository.js
const pool = require('../db');

class QuestionTypeRepository {
    async findAll() {
        const result = await pool.query('SELECT id, type_code, description FROM question_type ORDER BY type_code;');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT id, type_code, description FROM question_type WHERE id = $1;', [id]);
        return result.rows[0];
    }

    async findByCode(typeCode) {
        const result = await pool.query('SELECT id, type_code, description FROM question_type WHERE type_code = $1;', [typeCode]);
        return result.rows[0];
    }

    async create(questionTypeData) {
        const { type_code, description } = questionTypeData;
        const result = await pool.query(
            'INSERT INTO question_type (type_code, description) VALUES ($1, $2) RETURNING id, type_code, description;',
            [type_code, description]
        );
        return result.rows[0];
    }

    async update(id, questionTypeData) {
        const { type_code, description } = questionTypeData;
        const result = await pool.query(
            'UPDATE question_type SET type_code = $1, description = $2 WHERE id = $3 RETURNING id, type_code, description;',
            [type_code, description, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query('DELETE FROM question_type WHERE id = $1 RETURNING id;', [id]);
        return result;
    }
}

module.exports = new QuestionTypeRepository();