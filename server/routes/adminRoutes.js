// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Pretpostavljamo da je db.js u server/direktoriju

// --- Pomoćna funkcija za obradu level parametra ---
// Ova funkcija osigurava da je 'level' uvijek string ('A', 'B', ili '')
const normalizeLevel = (levelInput) => {
    // Ako je input null, undefined, ili prazan string, vrati prazan string.
    // Baza ga onda treba tumačiti kao "bez razine".
    if (levelInput === null || levelInput === undefined || levelInput === '') {
        return '';
    }
    return String(levelInput).toUpperCase(); // Osiguraj da je string i velika slova
};
// --- Rutiranje za EXAMS (Master) ---

// GET /api/admin/exams - Dohvaća sve ispite za master listu
router.get('/exams', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.id, s.name AS subject_name, e.year, e.term, e.level, e.title_display, e.subject_id
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            ORDER BY e.year DESC, e.term, s.name, e.level;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju svih ispita (admin/exams):', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju ispita' });
    }
});

// GET /api/admin/exams/:id - Dohvaća detalje jednog ispita
router.get('/exams/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.id, s.name AS subject_name, e.year, e.term, e.level, e.title_display, e.subject_id
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            WHERE e.id = $1;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ispit nije pronađen.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Greška pri dohvaćanju detalja ispita (admin/exams/:id):', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju detalja ispita' });
    }
});

// POST /api/admin/exams - Stvara novi ispit
router.post('/exams', async (req, res) => {
    const { subject_id, year, term, title_display } = req.body;
    let { level } = req.body; // Dohvati level zasebno da ga možemo normalizirati

    level = normalizeLevel(level); // <--- NORMALIZIRAJ LEVEL OVDJE

    try {
        // Validacija: provjera duplikata (prema unique constraintu)
        // Ažurirana provjera za level: (level = $4 OR (level IS NULL AND $4 = ''))
        const checkDuplicate = await pool.query(
            `SELECT id FROM exam WHERE subject_id = $1 AND year = $2 AND term = $3 AND (level = $4 OR (level IS NULL AND $4 = ''));`,
            [subject_id, year, term, level]
        );
        if (checkDuplicate.rows.length > 0) {
            return res.status(409).json({ message: 'Ispit s istim predmetom, godinom, rokom i razinom već postoji.' });
        }

        const result = await pool.query(`
            INSERT INTO exam (subject_id, year, term, level, title_display)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, year, term, level, title_display, subject_id;
        `, [subject_id, year, term, level, title_display]);
        
        // Dodaj subject_name za frontend prikaz
        const newExam = result.rows[0];
        const subjectResult = await pool.query(`SELECT name FROM subject WHERE id = $1;`, [newExam.subject_id]);
        newExam.subject_name = subjectResult.rows[0].name;

        res.status(201).json(newExam);
    } catch (error) {
        console.error('Greška pri stvaranju ispita (admin/exams POST):', error);
        res.status(500).json({ error: 'Greška pri stvaranju ispita' });
    }
});

// PUT /api/admin/exams/:id - Ažurira postojeći ispit
router.put('/exams/:id', async (req, res) => {
    const { id } = req.params;
    const { subject_id, year, term, level, title_display } = req.body;
    try {
        // Validacija: provjera duplikata za ažuriranje (da ne stvorimo duplikat drugog ispita)
        const checkDuplicate = await pool.query(
            `SELECT id FROM exam WHERE subject_id = $1 AND year = $2 AND term = $3 AND (level IS NULL AND $4 IS NULL OR level = $4) AND id != $5;`,
            [subject_id, year, term, level, id]
        );
        if (checkDuplicate.rows.length > 0) {
            return res.status(409).json({ message: 'Ažuriranjem bi se stvorio duplikat postojećeg ispita.' });
        }

        const result = await pool.query(`
            UPDATE exam
            SET subject_id = $1, year = $2, term = $3, level = $4, title_display = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING id, year, term, level, title_display, subject_id;
        `, [subject_id, year, term, level, title_display, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ispit nije pronađen za ažuriranje.' });
        }

        // Dodaj subject_name za frontend prikaz
        const updatedExam = result.rows[0];
        const subjectResult = await pool.query(`SELECT name FROM subject WHERE id = $1;`, [updatedExam.subject_id]);
        updatedExam.subject_name = subjectResult.rows[0].name;

        res.json(updatedExam);
    } catch (error) {
        console.error('Greška pri ažuriranju ispita (admin/exams PUT):', error);
        res.status(500).json({ error: 'Greška pri ažuriranju ispita' });
    }
});

// DELETE /api/admin/exams/:id - Briše ispit i njegova pitanja (kaskadno)
router.delete('/exams/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            DELETE FROM exam
            WHERE id = $1
            RETURNING id;
        `, [id]); // RETURNING id je opcionalno, ali pomaže u potvrdi brisanja

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ispit nije pronađen za brisanje.' });
        }
        res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
        console.error('Greška pri brisanju ispita (admin/exams DELETE):', error);
        res.status(500).json({ error: 'Greška pri brisanju ispita' });
    }
});

// --- Rutiranje za QUESTIONS (Detail) ---

// GET /api/admin/exams/:examId/questions - Dohvaća sva pitanja za specifičan ispit
router.get('/exams/:examId/questions', async (req, res) => {
    const { examId } = req.params;
    try {
        const result = await pool.query(`
            SELECT
                q.id, q.exam_id, q.question_type_id, qt.type_code AS question_type_code,
                q.stimulus_id, COALESCE(s.description, '') AS stimulus_text, -- Dohvaćamo tekst stimulusa
                q.question_text, q.order_in_exam, q.points
            FROM question q
            JOIN question_type qt ON q.question_type_id = qt.id
            LEFT JOIN stimulus s ON q.stimulus_id = s.id
            WHERE q.exam_id = $1
            ORDER BY q.order_in_exam;
        `, [examId]);

        // Za svako pitanje dohvati i njegove opcije odgovora
        const questionsWithAnswers = await Promise.all(result.rows.map(async (question) => {
            const answersResult = await pool.query(
                `SELECT answer_text, is_correct, order_in_question FROM answer WHERE question_id = $1 ORDER BY order_in_question;`,
                [question.id]
            );
            return {
                ...question,
                answers: answersResult.rows
            };
        }));

        res.json(questionsWithAnswers);
    } catch (error) {
        console.error('Greška pri dohvaćanju pitanja za ispit (admin/exams/:examId/questions):', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju pitanja' });
    }
});

// POST /api/admin/questions - Stvara novo pitanje
router.post('/questions', async (req, res) => {
    const { exam_id, question_type_id, question_text, order_in_exam, points, stimulus_text, answers, correct_answer_text } = req.body;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN'); // Start transaction

        let stimulus_id = null;
        if (stimulus_text) {
            // Check if stimulus with this description already exists
            const existingStimulus = await client.query(`SELECT id FROM stimulus WHERE description = $1;`, [stimulus_text]);
            if (existingStimulus.rows.length > 0) {
                stimulus_id = existingStimulus.rows[0].id;
            } else {
                // If not, insert new stimulus
                const newStimulus = await client.query(`
                    INSERT INTO stimulus (stimulus_type, description)
                    VALUES ('text', $1)
                    RETURNING id;
                `, [stimulus_text]);
                stimulus_id = newStimulus.rows[0].id;
            }
        }

        const newQuestion = await client.query(`
            INSERT INTO question (exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points;
        `, [exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points]);
        
        const questionId = newQuestion.rows[0].id;
        
        // Handle answers (options) based on question type
        // Note: For MC questions, `answers` array will be used.
        // For FILL_IN_BLANK/EXTENDED_RESPONSE, `correct_answer_text` is used.
        const questionTypeResult = await client.query(`SELECT type_code FROM question_type WHERE id = $1;`, [question_type_id]);
        const typeCode = questionTypeResult.rows[0]?.type_code;

        if (['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(typeCode)) {
            if (answers && answers.length > 0) {
                for (const ans of answers) {
                    await client.query(`
                        INSERT INTO answer (question_id, answer_text, is_correct, order_in_question)
                        VALUES ($1, $2, $3, $4);
                    `, [questionId, ans.answer_text, ans.is_correct, ans.order_in_question]);
                }
            } else {
                // Optional: If MC question but no options provided, insert a dummy correct answer or validate
                console.warn(`MC question ${questionId} has no answers provided.`);
            }
        } else if (correct_answer_text) { // For other types like FILL_IN_BLANK
            await client.query(`
                INSERT INTO answer (question_id, answer_text, is_correct, order_in_question)
                VALUES ($1, $2, TRUE, 1);
            `, [questionId, correct_answer_text]);
        }

        await client.query('COMMIT'); // Commit transaction

        // Dohvati question_type_code za povratni objekt
        const questionTypeInfo = await pool.query(`SELECT type_code FROM question_type WHERE id = $1;`, [question_type_id]);
        const newQuestionWithDetails = { 
            ...newQuestion.rows[0], 
            stimulus_text: stimulus_text, 
            question_type_code: questionTypeInfo.rows[0].type_code,
            answers: answers || [] // Vrati i opcije odgovora za React state
        };

        res.status(201).json(newQuestionWithDetails);

    } catch (error) {
        if (client) await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Greška pri stvaranju pitanja (admin/questions POST):', error);
        res.status(500).json({ error: 'Greška pri stvaranju pitanja' });
    } finally {
        if (client) client.release();
    }
});

// PUT /api/admin/questions/:id - Ažurira postojeće pitanje
router.put('/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { question_type_id, question_text, order_in_exam, points, stimulus_text, answers, correct_answer_text } = req.body;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN'); // Start transaction

        let stimulus_id = null;
        if (stimulus_text) {
            // Check if stimulus with this description already exists
            const existingStimulus = await client.query(`SELECT id FROM stimulus WHERE description = $1;`, [stimulus_text]);
            if (existingStimulus.rows.length > 0) {
                stimulus_id = existingStimulus.rows[0].id;
            } else {
                // If not, insert new stimulus
                const newStimulus = await client.query(`
                    INSERT INTO stimulus (stimulus_type, description)
                    VALUES ('text', $1)
                    RETURNING id;
                `, [stimulus_text]);
                stimulus_id = newStimulus.rows[0].id;
            }
        }

        const updatedQuestion = await client.query(`
            UPDATE question
            SET question_type_id = $1, stimulus_id = $2, question_text = $3, order_in_exam = $4, points = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING id, exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points;
        `, [question_type_id, stimulus_id, question_text, order_in_exam, points, id]);

        if (updatedQuestion.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Pitanje nije pronađeno za ažuriranje.' });
        }

        // Delete existing answers and insert new ones
        await client.query(`DELETE FROM answer WHERE question_id = $1;`, [id]);
        
        const questionTypeResult = await client.query(`SELECT type_code FROM question_type WHERE id = $1;`, [question_type_id]);
        const typeCode = questionTypeResult.rows[0]?.type_code;

        if (['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(typeCode)) {
            if (answers && answers.length > 0) {
                for (const ans of answers) {
                    await client.query(`
                        INSERT INTO answer (question_id, answer_text, is_correct, order_in_question)
                        VALUES ($1, $2, $3, $4);
                    `, [id, ans.answer_text, ans.is_correct, ans.order_in_question]);
                }
            } else {
                 console.warn(`MC question ${id} updated without answers provided.`);
            }
        } else if (correct_answer_text) { // For other types like FILL_IN_BLANK
            await client.query(`
                INSERT INTO answer (question_id, answer_text, is_correct, order_in_question)
                VALUES ($1, $2, TRUE, 1);
            `, [id, correct_answer_text]);
        }

        await client.query('COMMIT'); // Commit transaction

        // Dohvati question_type_code za povratni objekt
        const questionTypeInfo = await pool.query(`SELECT type_code FROM question_type WHERE id = $1;`, [question_type_id]);
        const updatedQuestionWithDetails = { 
            ...updatedQuestion.rows[0], 
            stimulus_text: stimulus_text, 
            question_type_code: questionTypeInfo.rows[0].type_code,
            answers: answers || [] // Vrati i opcije odgovora za React state
        };

        res.json(updatedQuestionWithDetails);

    } catch (error) {
        if (client) await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Greška pri ažuriranju pitanja (admin/questions PUT):', error);
        res.status(500).json({ error: 'Greška pri ažuriranju pitanja' });
    } finally {
        if (client) client.release();
    }
});

// DELETE /api/admin/questions/:id - Briše pitanje
router.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            DELETE FROM question
            WHERE id = $1
            RETURNING id;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pitanje nije pronađeno za brisanje.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Greška pri brisanju pitanja (admin/questions DELETE):', error);
        res.status(500).json({ error: 'Greška pri brisanju pitanja' });
    }
});

// --- Rutiranje za Šifrarnike ---

// GET /api/admin/subjects - Dohvaća sve predmete
router.get('/subjects', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, name FROM subject ORDER BY name;`);
        res.json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju predmeta (admin/subjects):', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju predmeta' });
    }
});

// GET /api/admin/question-types - Dohvaća sve tipove pitanja
router.get('/question-types', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, type_code, description FROM question_type ORDER BY type_code;`);
        res.json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju tipova pitanja (admin/question-types):', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju tipova pitanja' });
    }
});

// GET /api/admin/stimuli - Dohvaća sve stimuluse (Opcionalno, ako želite da ih admin može pregledavati/birati)
router.get('/stimuli', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, description FROM stimulus ORDER BY id;`);
        res.json(result.rows);
    } catch (error) {
        console.error('Greška pri dohvaćanju stimulusa (admin/stimuli):', error);
        res.status(500).json({ error: 'Greška pri dohvaćanju stimulusa' });
    }
});

module.exports = router;