// routes/examRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Pretpostavljamo da je db.js u istom direktoriju kao i routes

router.get('/:id', async (req, res) => {
    const examId = req.params.id;

    try {
        // Dohvaćamo osnovne podatke o ispitu i svim njegovim pitanjima
        // Pridružujemo question_type (za type_code) i stimulus (za description)
        const questionsQuery = `
            SELECT 
                e.id AS exam_id, 
                e.year, 
                e.term, 
                e.level, -- Dodajemo level iz exam tablice
                s.name AS subject_name, 
                q.id AS question_id, 
                q.question_text, 
                q.order_in_exam, -- Novi naziv stupca za redoslijed pitanja
                q.points, 
                qt.type_code AS question_type_code, -- Dohvaćamo type_code iz question_type tablice
                st.description AS stimulus_text -- Dohvaćamo tekst stimulusa, ako postoji
            FROM exam e
            JOIN subject s ON e.subject_id = s.id 
            JOIN question q ON e.id = q.exam_id 
            JOIN question_type qt ON q.question_type_id = qt.id -- Pridruživanje question_type
            LEFT JOIN stimulus st ON q.stimulus_id = st.id -- Pridruživanje stimulus tablici
            WHERE e.id = $1
            ORDER BY q.order_in_exam; -- Sortiranje po novom stupcu
        `;

        const questionsResult = await pool.query(questionsQuery, [examId]);

        if (questionsResult.rows.length === 0) {
            return res.status(404).json({ message: 'Ispit ili njegova pitanja nisu pronađeni.' });
        }

        // Izgradnja osnovnih informacija o ispitu
        const examHeader = {
            exam_id: questionsResult.rows[0].exam_id,
            subject: questionsResult.rows[0].subject_name,
            year: questionsResult.rows[0].year,
            term: questionsResult.rows[0].term,
            level: questionsResult.rows[0].level,
            title_display: questionsResult.rows[0].title_display // Dodano za konzistentnost
        };

        // Prikupljanje svih ID-jeva pitanja za dohvaćanje odgovora u jednom upitu (optimizacija N+1 problema)
        const questionIds = questionsResult.rows.map(row => row.question_id);

        let allAnswers = [];
        if (questionIds.length > 0) {
            const answersQuery = `
                SELECT 
                    id AS answer_id, 
                    question_id, 
                    answer_text, 
                    is_correct, 
                    order_in_question
                FROM answer 
                WHERE question_id = ANY($1::int[]) -- Dohvaćanje odgovora za sve prikupljene question_id-eve
                ORDER BY question_id, order_in_question;
            `;
            const answersResult = await pool.query(answersQuery, [questionIds]);
            allAnswers = answersResult.rows;
        }

        // Mapiranje odgovora na pripadajuća pitanja
        const answersByQuestionId = allAnswers.reduce((acc, answer) => {
            if (!acc[answer.question_id]) {
                acc[answer.question_id] = [];
            }
            acc[answer.question_id].push(answer);
            return acc;
        }, {});

        // Sastavljanje konačne strukture pitanja s odgovorima
        const questionsWithAnswers = questionsResult.rows.map(qRow => ({
            question_id: qRow.question_id,
            question_text: qRow.question_text,
            order_in_exam: qRow.order_in_exam,
            points: qRow.points,
            question_type_code: qRow.question_type_code,
            stimulus_text: qRow.stimulus_text,
            answers: answersByQuestionId[qRow.question_id] || [] // Dodaj prazan niz ako nema odgovora
        }));

        res.json({
            ...examHeader,
            questions: questionsWithAnswers
        });

    } catch (error) {
        console.error('Greška pri dohvaćanju podataka ispita:', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju podataka ispita' });
    }
});

module.exports = router;