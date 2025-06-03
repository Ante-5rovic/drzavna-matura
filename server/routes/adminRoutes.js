const express = require('express');
const router = express.Router();

const examService = require('../services/examService');
const questionService = require('../services/questionService');
const subjectService = require('../services/subjectService');
const questionTypeService = require('../services/questionTypeService');
const stimulusService = require('../services/stimulusService');

const handleServiceError = (error, res, defaultMessage = 'Interna greška servera.') => {
    console.error("API Greška:", error.message);
    if (error.stack) console.error(error.stack);
    res.status(error.statusCode || 500).json({ message: error.message || defaultMessage });
};

router.get('/exams', async (req, res) => {
    try {
        const exams = await examService.getAllExams();
        res.json(exams);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju ispita.');
    }
});

router.get('/exams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await examService.getExamById(id);
        res.json(exam);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju detalja ispita.');
    }
});

router.post('/exams', async (req, res) => {
    try {
        const { subject_id, year, term, level, title_display } = req.body;
        if (subject_id === undefined || year === undefined || term === undefined) {
            return res.status(400).json({ message: 'Nedostaju obavezni podaci: subject_id, year, term.' });
        }
        const newExam = await examService.createExam(req.body);
        res.status(201).json(newExam);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri stvaranju ispita.');
    }
});

router.put('/exams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { subject_id, year, term, level, title_display } = req.body;
         if (subject_id === undefined || year === undefined || term === undefined) {
            return res.status(400).json({ message: 'Nedostaju obavezni podaci za ažuriranje.' });
        }
        const updatedExam = await examService.updateExam(id, req.body);
        res.json(updatedExam);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri ažuriranju ispita.');
    }
});

router.delete('/exams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await examService.deleteExam(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(error, res, 'Greška pri brisanju ispita.');
    }
});

router.get('/exams/:examId/questions', async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await questionService.getQuestionsByExamId(examId);
        res.json(questions);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju pitanja za ispit.');
    }
});

router.post('/questions', async (req, res) => {
    try {
        const newQuestion = await questionService.createQuestion(req.body);
        res.status(201).json(newQuestion);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri stvaranju pitanja.');
    }
});

router.put('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuestion = await questionService.updateQuestion(id, req.body);
        res.json(updatedQuestion);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri ažuriranju pitanja.');
    }
});

router.delete('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await questionService.deleteQuestion(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(error, res, 'Greška pri brisanju pitanja.');
    }
});

router.get('/subjects', async (req, res) => {
    try {
        const subjects = await subjectService.getAllSubjects();
        res.json(subjects);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju predmeta.');
    }
});

router.get('/subjects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await subjectService.getSubjectById(id);
        res.json(subject);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju predmeta.');
    }
});

router.post('/subjects', async (req, res) => {
    try {
        const newSubject = await subjectService.createSubject(req.body);
        res.status(201).json(newSubject);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri stvaranju predmeta.');
    }
});

router.put('/subjects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubject = await subjectService.updateSubject(id, req.body);
        res.json(updatedSubject);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri ažuriranju predmeta.');
    }
});

router.delete('/subjects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await subjectService.deleteSubject(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(error, res, 'Greška pri brisanju predmeta.');
    }
});

router.get('/question-types', async (req, res) => {
    try {
        const types = await questionTypeService.getAllQuestionTypes();
        res.json(types);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju tipova pitanja.');
    }
});

router.get('/question-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const qType = await questionTypeService.getQuestionTypeById(id);
        res.json(qType);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju tipa pitanja.');
    }
});

router.post('/question-types', async (req, res) => {
    try {
        const newQuestionType = await questionTypeService.createQuestionType(req.body);
        res.status(201).json(newQuestionType);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri stvaranju tipa pitanja.');
    }
});

router.put('/question-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuestionType = await questionTypeService.updateQuestionType(id, req.body);
        res.json(updatedQuestionType);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri ažuriranju tipa pitanja.');
    }
});

router.delete('/question-types/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await questionTypeService.deleteQuestionType(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(error, res, 'Greška pri brisanju tipa pitanja.');
    }
});

router.get('/stimuli', async (req, res) => {
    try {
        const stimuli = await stimulusService.getAllStimuli();
        res.json(stimuli);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju stimulusa.');
    }
});

router.get('/stimuli/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const stimulus = await stimulusService.getStimulusById(id);
        res.json(stimulus);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri dohvaćanju stimulusa.');
    }
});

router.post('/stimuli', async (req, res) => {
    try {
        const newStimulus = await stimulusService.createStimulus(req.body);
        res.status(201).json(newStimulus);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri stvaranju stimulusa.');
    }
});

router.put('/stimuli/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStimulus = await stimulusService.updateStimulus(id, req.body);
        res.json(updatedStimulus);
    } catch (error) {
        handleServiceError(error, res, 'Greška pri ažuriranju stimulusa.');
    }
});

router.delete('/stimuli/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await stimulusService.deleteStimulus(id);
        res.status(204).send();
    } catch (error) {
        handleServiceError(error, res, 'Greška pri brisanju stimulusa.');
    }
});


module.exports = router;