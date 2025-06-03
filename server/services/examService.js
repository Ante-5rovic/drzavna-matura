const examRepository = require('../repositories/examRepository'); // Repozitorij za ispite
const subjectRepository = require('../repositories/subjectRepository'); // Trebat će nam za ime predmeta

const normalizeLevel = (levelInput) => {
    if (levelInput === null || levelInput === undefined || levelInput === '') {
        return '';
    }
    return String(levelInput).toUpperCase();
};

class ExamService {
    async getAllExams() {
        return await examRepository.findAllWithSubjectDetails();
    }

    async getExamById(id) {
        const exam = await examRepository.findByIdWithSubjectDetails(id);
        if (!exam) {
            const error = new Error('Ispit nije pronađen.');
            error.statusCode = 404;
            throw error;
        }
        return exam;
    }

    async createExam(examData) {
        const { subject_id, year, term, title_display } = examData;
        const level = normalizeLevel(examData.level);

        const existingExam = await examRepository.findByDetails(subject_id, year, term, level);
        if (existingExam) {
            const error = new Error('Ispit s istim predmetom, godinom, rokom i razinom već postoji.');
            error.statusCode = 409;
            throw error;
        }

        const newExamRaw = await examRepository.create({ subject_id, year, term, level, title_display });

        const subject = await subjectRepository.findById(newExamRaw.subject_id);
        return {
            ...newExamRaw,
            subject_name: subject ? subject.name : 'Nepoznat predmet'
        };
    }

    async updateExam(id, examData) {
        const { subject_id, year, term, title_display } = examData;
        const level = normalizeLevel(examData.level);

        const examToUpdate = await examRepository.findById(id);
        if (!examToUpdate) {
            const error = new Error('Ispit nije pronađen za ažuriranje.');
            error.statusCode = 404;
            throw error;
        }

        const duplicateExam = await examRepository.findByDetailsAndNotId(subject_id, year, term, level, id);
        if (duplicateExam) {
            const error = new Error('Ažuriranjem bi se stvorio duplikat postojećeg ispita.');
            error.statusCode = 409;
            throw error;
        }

        const updatedExamRaw = await examRepository.update(id, { subject_id, year, term, level, title_display });
         if (!updatedExamRaw) {
            const error = new Error('Ispit nije pronađen za ažuriranje (nakon pokušaja ažuriranja).');
            error.statusCode = 404;
            throw error;
        }


        const subject = await subjectRepository.findById(updatedExamRaw.subject_id);
        return {
            ...updatedExamRaw,
            subject_name: subject ? subject.name : 'Nepoznat predmet'
        };
    }

    async deleteExam(id) {
        const result = await examRepository.delete(id);
        if (result.rowCount === 0) {
             const error = new Error('Ispit nije pronađen za brisanje.');
             error.statusCode = 404;
             throw error;
        }
    }

        async getPublicExams(subjectParam, levelParam) {
        const dbSubjectName = this._mapSubjectToDb(subjectParam);
        const dbLevel = this._mapLevelToDb(levelParam);

        if (!dbSubjectName) {
            const error = new Error('Nepoznat predmet.');
            error.statusCode = 400;
            throw error;
        }
        const exams = await examRepository.findPublicExams(dbSubjectName, dbLevel);

        if (!exams || exams.length === 0) {
            return [];
        }
        return exams;
    }

    async getFullExamForDisplay(examId) {
        const examHeader = await examRepository.findByIdWithSubjectDetails(examId);
        if (!examHeader) {
            const error = new Error('Ispit nije pronađen.');
            error.statusCode = 404;
            throw error;
        }

        const questions = await questionRepository.findByExamId(examId);

        const questionsWithFullDetails = await Promise.all(
            questions.map(async (question) => {
                const answers = await answerRepository.findByQuestionId(question.id);
                return {
                    question_id: question.id,
                    question_text: question.question_text,
                    order_in_exam: question.order_in_exam,
                    points: question.points,
                    question_type_code: question.question_type_code,
                    stimulus_text: question.stimulus_text,
                    answers: answers || []
                };
            })
        );

        return {
            exam_id: examHeader.id,
            subject_name: examHeader.subject_name,
            year: examHeader.year,
            term: examHeader.term,
            level: examHeader.level,
            title_display: examHeader.title_display,
            questions: questionsWithFullDetails
        };
    }

    _mapLevelToDb(levelParam) {
        if (!levelParam || levelParam === 'null') return '';
        const lowerLevel = String(levelParam).toLowerCase();
        if (lowerLevel === 'visa' || lowerLevel === 'viša') return 'A';
        if (lowerLevel === 'niza' || lowerLevel === 'niža') return 'B';
        return '';
    }

    _mapSubjectToDb(subjectParam) {
        if (!subjectParam) return null;
        const lowerSubject = String(subjectParam).toLowerCase();
        if (lowerSubject === 'hrvatski') return 'Hrvatski jezik';
        if (lowerSubject === 'matematika') return 'Matematika';
        if (lowerSubject === 'engleski') return 'Engleski jezik';
        return subjectParam;
    }

    async getPublicExams(subjectParam, levelParam) {
        const dbSubjectName = this._mapSubjectToDb(subjectParam);
        const dbLevel = this._mapLevelToDb(levelParam);

        if (!dbSubjectName) {
            const error = new Error('Nepoznat ili nedostajući predmet.');
            error.statusCode = 400;
            throw error;
        }
        
        const exams = await examRepository.findPublicExams(dbSubjectName, dbLevel);
        
        return exams || [];
    }
}

module.exports = new ExamService();