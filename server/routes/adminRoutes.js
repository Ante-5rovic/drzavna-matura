// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const examService = require('../services/exam.service');
// const questionService = require('../services/question.service'); // Kasnije za pitanja
// const subjectService = require('../services/subject.service'); // Kasnije za šifrarnike
// const questionTypeService = require('../services/questionType.service');

// --- Rutiranje za EXAMS (Master) ---

// GET /api/admin/exams - Dohvaća sve ispite
router.get('/exams', async (req, res, next) => {
    try {
        const exams = await examService.getAllExams();
        res.json(exams);
    } catch (error) {
        // Možeš imati centralni error handling middleware u app.js
        console.error('Greška u GET /admin/exams ruti:', error.message);
        res.status(error.statusCode || 500).json({ message: error.message || 'Greška pri dohvaćanju ispita' });
    }
});

// GET /api/admin/exams/:id - Dohvaća detalje jednog ispita
router.get('/exams/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const exam = await examService.getExamById(id);
        res.json(exam);
    } catch (error) {
        console.error(`Greška u GET /admin/exams/${req.params.id} ruti:`, error.message);
        res.status(error.statusCode || 500).json({ message: error.message || 'Greška pri dohvaćanju detalja ispita' });
    }
});

// POST /api/admin/exams - Stvara novi ispit
router.post('/exams', async (req, res, next) => {
    try {
        // Osnovna validacija ulaza (može se proširiti s express-validator)
        const { subject_id, year, term, level, title_display } = req.body;
        if (subject_id === undefined || year === undefined || term === undefined) {
            return res.status(400).json({ message: 'Nedostaju obavezni podaci: subject_id, year, term.' });
        }

        const newExam = await examService.createExam({ subject_id, year, term, level, title_display });
        res.status(201).json(newExam);
    } catch (error) {
        console.error('Greška u POST /admin/exams ruti:', error.message);
        res.status(error.statusCode || 500).json({ message: error.message || 'Greška pri stvaranju ispita' });
    }
});

// PUT /api/admin/exams/:id - Ažurira postojeći ispit
router.put('/exams/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { subject_id, year, term, level, title_display } = req.body;
        // Osnovna validacija
        if (subject_id === undefined || year === undefined || term === undefined) {
            return res.status(400).json({ message: 'Nedostaju obavezni podaci za ažuriranje.' });
        }

        const updatedExam = await examService.updateExam(id, { subject_id, year, term, level, title_display });
        res.json(updatedExam);
    } catch (error) {
        console.error(`Greška u PUT /admin/exams/${req.params.id} ruti:`, error.message);
        res.status(error.statusCode || 500).json({ message: error.message || 'Greška pri ažuriranju ispita' });
    }
});

// DELETE /api/admin/exams/:id - Briše ispit
router.delete('/exams/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await examService.deleteExam(id);
        res.status(204).send(); // Uspješno brisanje
    } catch (error) {
        console.error(`Greška u DELETE /admin/exams/${req.params.id} ruti:`, error.message);
        res.status(error.statusCode || 500).json({ message: error.message || 'Greška pri brisanju ispita' });
    }
});


// --- Rutiranje za QUESTIONS (Detail) ---
// TODO: Refaktorirati na isti način koristeći QuestionService i AnswerService/Repository

// --- Rutiranje za Šifrarnike ---
// TODO: Refaktorirati na isti način koristeći SubjectService, QuestionTypeService, StimulusService
// Primjer za predmete:
// router.get('/subjects', async (req, res) => {
// try {
// const subjects = await subjectService.getAllSubjects(); // Pretpostavka da postoji subjectService
// res.json(subjects);
// } catch (error) {
//         console.error('Greška pri dohvaćanju predmeta (admin/subjects):', error.message);
//         res.status(error.statusCode || 500).json({ error: 'Greška pri dohvaćanju predmeta' });
//     }
// });


module.exports = router;