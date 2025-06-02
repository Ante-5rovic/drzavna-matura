// server/services/question.service.js
const pool = require('../db'); // Za transakcije
const questionRepository = require('../repositories/questionRepository')
const answerRepository = require('../repositories/answerRepository');
const stimulusService = require('./stimulusService'); // Koristimo stimulus servis
const questionTypeRepository = require('../repositories/questionTypeRepository');


class QuestionService {
    async getQuestionsByExamId(examId) {
        const questions = await questionRepository.findByExamId(examId);
        const questionsWithAnswers = await Promise.all(questions.map(async (question) => {
            const answers = await answerRepository.findByQuestionId(question.id);
            return { ...question, answers };
        }));
        return questionsWithAnswers;
    }

    async createQuestion(questionData) {
        const { exam_id, question_type_id, question_text, order_in_exam, points, stimulus_text, answers = [], correct_answer_text } = questionData;
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            const stimulus_id = await stimulusService.findOrCreateStimulus(stimulus_text, client);

            const newQuestionRaw = await questionRepository.create(
                { exam_id, question_type_id, stimulus_id, question_text, order_in_exam, points },
                client
            );
            const questionId = newQuestionRaw.id;

            const questionType = await questionTypeRepository.findById(question_type_id); // Dohvati tip pitanja za logiku odgovora
            if (!questionType) {
                throw new Error(`Tip pitanja s ID ${question_type_id} nije pronađen.`);
            }

            let createdAnswersData = [];
            if (['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(questionType.type_code)) {
                if (answers && answers.length > 0) {
                    const answersToCreate = answers.map(ans => ({ ...ans, question_id: questionId }));
                    createdAnswersData = await answerRepository.createMany(answersToCreate, client);
                }
            } else if (correct_answer_text) { // Za FILL_IN_BLANK, EXTENDED_RESPONSE itd.
                const answerToCreate = [{ question_id: questionId, answer_text: correct_answer_text, is_correct: true, order_in_question: 1 }];
                createdAnswersData = await answerRepository.createMany(answerToCreate, client);
            }

            await client.query('COMMIT');

            return {
                ...newQuestionRaw,
                stimulus_text: stimulus_text || '', // Vrati stimulus_text ako je bio poslan
                question_type_code: questionType.type_code,
                answers: createdAnswersData
            };

        } catch (error) {
            if (client) await client.query('ROLLBACK');
            console.error('Greška u QuestionService.createQuestion:', error);
            // Presloži grešku da je kontroler može uhvatiti s više detalja
            const serviceError = new Error(`Greška pri stvaranju pitanja: ${error.message}`);
            serviceError.statusCode = error.statusCode || 500;
            throw serviceError;
        } finally {
            if (client) client.release();
        }
    }

    async updateQuestion(id, questionData) {
        const { question_type_id, question_text, order_in_exam, points, stimulus_text, answers = [], correct_answer_text } = questionData;
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            const existingQuestion = await questionRepository.findById(id, client);
            if (!existingQuestion) {
                const error = new Error('Pitanje nije pronađeno za ažuriranje.');
                error.statusCode = 404;
                throw error;
            }

            const stimulus_id = await stimulusService.findOrCreateStimulus(stimulus_text, client);

            const updatedQuestionRaw = await questionRepository.update(
                id,
                { question_type_id, stimulus_id, question_text, order_in_exam, points },
                client
            );

            await answerRepository.deleteByQuestionId(id, client); // Obriši stare odgovore

            const questionType = await questionTypeRepository.findById(question_type_id);
             if (!questionType) {
                throw new Error(`Tip pitanja s ID ${question_type_id} nije pronađen.`);
            }


            let updatedAnswersData = [];
            if (['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(questionType.type_code)) {
                if (answers && answers.length > 0) {
                    const answersToCreate = answers.map(ans => ({ ...ans, question_id: id }));
                   updatedAnswersData = await answerRepository.createMany(answersToCreate, client);
                }
            } else if (correct_answer_text) {
                const answerToCreate = [{ question_id: id, answer_text: correct_answer_text, is_correct: true, order_in_question: 1 }];
                updatedAnswersData = await answerRepository.createMany(answerToCreate, client);
            }

            await client.query('COMMIT');

            return {
                ...updatedQuestionRaw,
                stimulus_text: stimulus_text || '',
                question_type_code: questionType.type_code,
                answers: updatedAnswersData
            };

        } catch (error) {
            if (client) await client.query('ROLLBACK');
            console.error('Greška u QuestionService.updateQuestion:', error);
            const serviceError = new Error(`Greška pri ažuriranju pitanja: ${error.message}`);
            serviceError.statusCode = error.statusCode || 500;
            throw serviceError;
        } finally {
            if (client) client.release();
        }
    }

    async deleteQuestion(id) {
        // Transakcija ovdje nije nužno potrebna ako kaskadno brisanje na bazi obrađuje odgovore.
        // Ali ako želimo biti eksplicitni ili imamo dodatnu logiku:
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            // Opcionalno: provjeri postoji li pitanje prije brisanja
            const questionExists = await questionRepository.findById(id, client);
            if (!questionExists) {
                const error = new Error('Pitanje nije pronađeno za brisanje.');
                error.statusCode = 404;
                throw error;
            }
            
            // Prvo obriši vezane odgovore ako nema kaskadnog brisanja ili želimo biti sigurni
            await answerRepository.deleteByQuestionId(id, client);
            const result = await questionRepository.delete(id, client);

            if (result.rowCount === 0) { // Dodatna provjera
                 const error = new Error('Pitanje nije pronađeno za brisanje (nakon pokušaja).');
                 error.statusCode = 404;
                 throw error;
            }
            await client.query('COMMIT');
        } catch (error) {
            if (client) await client.query('ROLLBACK');
            console.error('Greška u QuestionService.deleteQuestion:', error);
            const serviceError = new Error(`Greška pri brisanju pitanja: ${error.message}`);
            serviceError.statusCode = error.statusCode || 500;
            throw serviceError;
        } finally {
            if (client) client.release();
        }
    }
}

module.exports = new QuestionService();