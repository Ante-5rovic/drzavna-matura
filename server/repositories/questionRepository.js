// server/repositories/questionRepository.js
const pool = require('../db');

class QuestionRepository {
    async findByExamId(examId, client = pool) { // Dodaj client
        const result = await client.query(`
            SELECT
                q.id, q.exam_id, q.question_type_id, qt.type_code AS question_type_code,
                q.stimulus_id, COALESCE(s.description, '') AS stimulus_text,
                q.question_text, q.order_in_exam, q.points
            FROM question q
            JOIN question_type qt ON q.question_type_id = qt.id
            LEFT JOIN stimulus s ON q.stimulus_id = s.id
            WHERE q.exam_id = $1
            ORDER BY q.order_in_exam;
        `, [examId]);
        return result.rows;
    }

    async findById(id, client = pool) {
        const result = await client.query('SELECT * FROM question WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(questionData, client = pool) {
        const { exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points } = questionData;
        const result = await client.query(`
            INSERT INTO question (exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points;
        `, [exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points]);
        return result.rows[0];
    }

    async update(id, questionData, client = pool) {
        const { question_type_id, stimulus_id, question_text, order_in_exam, points } = questionData;
        const result = await client.query(`
            UPDATE question
            SET question_type_id = $1, stimulus_id = $2, question_text = $3, order_in_exam = $4, points = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING id, exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points;
        `, [question_type_id, stimulus_id, question_text, order_in_exam, points, id]);
        return result.rows[0];
    }

    async delete(id, client = pool) {
        const result = await client.query('DELETE FROM question WHERE id = $1 RETURNING id;', [id]);
        return result;
    }

    async findDistinctStimulusIdsByExamId(examId, client = pool) {
        const result = await client.query(
            'SELECT DISTINCT stimulus_id FROM question WHERE exam_id = $1 AND stimulus_id IS NOT NULL;',
            [examId]
        );
        return result.rows.map(row => row.stimulus_id);
    }

    async countByStimulusId(stimulusId, client = pool) {
        const result = await client.query(
            'SELECT COUNT(*) AS count FROM question WHERE stimulus_id = $1;',
            [stimulusId]
        );
        return parseInt(result.rows[0].count, 10);
    }

    async countByQuestionTypeId(questionTypeId, client = pool) { // Potrebno za QuestionTypeService
        const result = await client.query(
            'SELECT COUNT(*) AS count FROM question WHERE question_type_id = $1;',
            [questionTypeId]
        );
        return parseInt(result.rows[0].count, 10);
    }
}

module.exports = new QuestionRepository();