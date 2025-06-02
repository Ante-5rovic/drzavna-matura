// server/services/questionTypeService.js
const questionTypeRepository = require('../repositories/questionTypeRepository');
const questionRepository = require('../repositories/questionRepository'); // Za provjeru korištenja

class QuestionTypeService {
    async getAllQuestionTypes() {
        return await questionTypeRepository.findAll();
    }

    async getQuestionTypeById(id) {
        const qType = await questionTypeRepository.findById(id);
        if (!qType) {
            const error = new Error('Tip pitanja nije pronađen.');
            error.statusCode = 404;
            throw error;
        }
        return qType;
    }

    async createQuestionType(data) {
        const { type_code, description } = data;
        if (!type_code || String(type_code).trim() === '') {
            const error = new Error('Kod tipa pitanja (type_code) je obavezan.');
            error.statusCode = 400;
            throw error;
        }
        // description može biti null ili prazan

        try {
            return await questionTypeRepository.create({
                type_code: String(type_code).trim().toUpperCase(),
                description: description || null
            });
        } catch (dbError) {
            if (dbError.code === '23505' && dbError.constraint === 'question_type_type_code_key') { // Unique violation
                const error = new Error('Tip pitanja s ovim kodom već postoji.');
                error.statusCode = 409; // Conflict
                throw error;
            }
            throw dbError; // Ostale DB greške
        }
    }

    async updateQuestionType(id, data) {
        const { type_code, description } = data;
        if (type_code !== undefined && String(type_code).trim() === '') {
            const error = new Error('Kod tipa pitanja (type_code) ne smije biti prazan ako se šalje.');
            error.statusCode = 400;
            throw error;
        }

        const qTypeToUpdate = await questionTypeRepository.findById(id);
        if (!qTypeToUpdate) {
            const error = new Error('Tip pitanja nije pronađen za ažuriranje.');
            error.statusCode = 404;
            throw error;
        }
        
        const updateData = {};
        if (type_code !== undefined) updateData.type_code = String(type_code).trim().toUpperCase();
        if (description !== undefined) updateData.description = description === '' ? null : description;


        if (Object.keys(updateData).length === 0) {
            return qTypeToUpdate; // Nema polja za ažuriranje
        }

        try {
            const updatedQType = await questionTypeRepository.update(id, updateData);
             if (!updatedQType) {
                const error = new Error('Ažuriranje tipa pitanja nije uspjelo ili tip pitanja nije pronađen.');
                error.statusCode = 404; 
                throw error;
            }
            return updatedQType;
        } catch (dbError) {
            if (dbError.code === '23505' && dbError.constraint === 'question_type_type_code_key') { // Unique violation
                const error = new Error('Tip pitanja s ovim kodom već postoji.');
                error.statusCode = 409;
                throw error;
            }
            throw dbError;
        }
    }

    async deleteQuestionType(id) {
        const qTypeToDelete = await questionTypeRepository.findById(id);
        if (!qTypeToDelete) {
            const error = new Error('Tip pitanja nije pronađen za brisanje.');
            error.statusCode = 404;
            throw error;
        }

        // Provjera koristi li se tip pitanja (baza ima ON DELETE RESTRICT)
        const usageCount = await questionRepository.countByQuestionTypeId(id);
        if (usageCount > 0) {
            const error = new Error('Tip pitanja se ne može obrisati jer je povezan s postojećim pitanjima.');
            error.statusCode = 409; // Conflict
            throw error;
        }

        // Ako dođemo ovdje, znači da ga ništa ne koristi, iako bi DB to već spriječio.
        // Ova provjera je više za user-friendly poruku prije nego DB baci grešku.
        const result = await questionTypeRepository.delete(id);
        if (result.rowCount === 0) {
            const error = new Error('Tip pitanja nije pronađen za brisanje (nakon pokušaja).');
            error.statusCode = 404;
            throw error;
        }
    }
}

module.exports = new QuestionTypeService();