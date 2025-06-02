// server/services/exam.service.js
const examRepository = require('../repositories/exam.repository');
const subjectRepository = require('../repositories/subject.repository'); // Trebat će nam za ime predmeta

// Pomoćna funkcija za normalizaciju 'level' parametra, sada je dio servisa
// Može biti i u nekom zajedničkom 'utils' direktoriju ako se koristi na više mjesta
const normalizeLevel = (levelInput) => {
    if (levelInput === null || levelInput === undefined || levelInput === '') {
        return ''; // Originalni kod koristi '' za "bez razine"
    }
    return String(levelInput).toUpperCase();
};

class ExamService {
    async getAllExams() {
        // Repozitorij već vraća spojene podatke
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
        const level = normalizeLevel(examData.level); // Normalizacija unutar servisa

        // Poslovna logika: Provjera duplikata
        const existingExam = await examRepository.findByDetails(subject_id, year, term, level);
        if (existingExam) {
            const error = new Error('Ispit s istim predmetom, godinom, rokom i razinom već postoji.');
            error.statusCode = 409; // Conflict
            throw error;
        }

        const newExamRaw = await examRepository.create({ subject_id, year, term, level, title_display });

        // Dodavanje imena predmeta, kao u originalnom kodu
        // Ovo se može optimizirati ako `examRepository.create` može vratiti i ime predmeta
        const subject = await subjectRepository.findById(newExamRaw.subject_id); // Pretpostavka da subjectRepository ima findById
        return {
            ...newExamRaw,
            subject_name: subject ? subject.name : 'Nepoznat predmet'
        };
    }

    async updateExam(id, examData) {
        const { subject_id, year, term, title_display } = examData;
        const level = normalizeLevel(examData.level);

        // Prvo provjeri postoji li ispit koji se ažurira
        const examToUpdate = await examRepository.findById(id);
        if (!examToUpdate) {
            const error = new Error('Ispit nije pronađen za ažuriranje.');
            error.statusCode = 404;
            throw error;
        }

        // Poslovna logika: Provjera duplikata pri ažuriranju
        const duplicateExam = await examRepository.findByDetailsAndNotId(subject_id, year, term, level, id);
        if (duplicateExam) {
            const error = new Error('Ažuriranjem bi se stvorio duplikat postojećeg ispita.');
            error.statusCode = 409;
            throw error;
        }

        const updatedExamRaw = await examRepository.update(id, { subject_id, year, term, level, title_display });
         if (!updatedExamRaw) { // U slučaju da repo vrati null/undefined ako update ne uspije naći redak
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
        if (result.rowCount === 0) { // Provjera je li išta obrisano
             const error = new Error('Ispit nije pronađen za brisanje.');
             error.statusCode = 404;
             throw error;
        }
        // Nema potrebe vraćati ništa, kontroler će poslati 204
    }
}

module.exports = new ExamService();