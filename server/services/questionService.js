const pool = require('../db');
const questionRepository = require('../repositories/questionRepository')
const answerRepository = require('../repositories/answerRepository');
const stimulusService = require('./stimulusService');
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

            const questionType = await questionTypeRepository.findById(question_type_id);
            if (!questionType) {
                throw new Error(`Tip pitanja s ID ${question_type_id} nije pronađen.`);
            }

            let createdAnswersData = [];
            if (['MULTIPLE_CHOICE_SINGLE', 'MULTIPLE_CHOICE_MULTIPLE'].includes(questionType.type_code)) {
                if (answers && answers.length > 0) {
                    const answersToCreate = answers.map(ans => ({ ...ans, question_id: questionId }));
                    createdAnswersData = await answerRepository.createMany(answersToCreate, client);
                }
            } else if (correct_answer_text) { 
                const answerToCreate = [{ question_id: questionId, answer_text: correct_answer_text, is_correct: true, order_in_question: 1 }];
                createdAnswersData = await answerRepository.createMany(answerToCreate, client);
            }

            await client.query('COMMIT');

            return {
                ...newQuestionRaw,
                stimulus_text: stimulus_text || '',
                question_type_code: questionType.type_code,
                answers: createdAnswersData
            };

        } catch (error) {
            if (client) await client.query('ROLLBACK');
            console.error('Greška u QuestionService.createQuestion:', error);
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

            await answerRepository.deleteByQuestionId(id, client);

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
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            const questionExists = await questionRepository.findById(id, client);
            if (!questionExists) {
                const error = new Error('Pitanje nije pronađeno za brisanje.');
                error.statusCode = 404;
                throw error;
            }
            
            await answerRepository.deleteByQuestionId(id, client);
            const result = await questionRepository.delete(id, client);

            if (result.rowCount === 0) {
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