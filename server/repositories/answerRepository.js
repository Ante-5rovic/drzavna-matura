// server/repositories/answer.repository.js
const pool = require('../db');

class AnswerRepository {
    async findByQuestionId(questionId, client = pool) {
        const result = await client.query(
            'SELECT id, answer_text, is_correct, order_in_question FROM answer WHERE question_id = $1 ORDER BY order_in_question;',
            [questionId]
        );
        return result.rows;
    }

    async createMany(answers, client = pool) {
        // Za batch unos odgovora unutar transakcije
        const createdAnswers = [];
        for (const ans of answers) {
            const result = await client.query(`
                INSERT INTO answer (question_id, answer_text, is_correct, order_in_question)
                VALUES ($1, $2, $3, $4) RETURNING *;
            `, [ans.question_id, ans.answer_text, ans.is_correct, ans.order_in_question]);
            createdAnswers.push(result.rows[0]);
        }
        return createdAnswers;
    }

    async deleteByQuestionId(questionId, client = pool) {
        await client.query('DELETE FROM answer WHERE question_id = $1;', [questionId]);
    }
}

module.exports = new AnswerRepository();