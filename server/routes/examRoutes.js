const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
    const examId = req.params.id; //Preuzimanje ID-a ispita iz URL-a
    const query = `
        SELECT 
            e.id AS exam_id, 
            e.year, 
            e.term, 
            s.name AS subject_name, 
            q.id AS question_id, 
            q.question_number, 
            q.question_text, 
            q.question_type, 
            q.parent_question_number, 
            q.correct_answer, 
            a.id AS answer_id, 
            a.answer_option, 
            a.answer_text
        FROM exam e
        JOIN subject s ON e.subject_id = s.id 
        JOIN question q ON e.id = q.exam_id 
        LEFT JOIN answer a ON q.id = a.question_id 
        WHERE e.id = $1
        ORDER BY q.question_number, a.answer_option;
    `;
    try {
        const result = await pool.query(query, [examId]);

        const examData = {};

        result.rows.forEach(row => {
            if (!examData[row.question_id]) {
                examData[row.question_id] = {
                    question_id: row.question_id,
                    question_number: row.question_number,
                    question_text: row.question_text,
                    question_type: row.question_type,
                    parent_question_number: row.parent_question_number,
                    correct_answer: row.correct_answer,
                    answers: []
                };
            }
            
            if (row.answer_id) {
                examData[row.question_id].answers.push({
                    answer_option: row.answer_option,
                    answer_text: row.answer_text
                });
            }
        });

        res.json({
            exam_id: examId,
            subject: result.rows[0]?.subject_name,
            year: result.rows[0]?.year,
            term: result.rows[0]?.term,
            questions: Object.values(examData)
        });
    } catch (error) {
        console.error('Greška pri dohvaćanju podataka:', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju podataka' });
  }
});

module.exports = router;
