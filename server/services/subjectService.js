// server/services/subject.service.js
const subjectRepository = require('../repositories/subjectRepository');
// const examRepository = require('../repositories/exam.repository'); // Za proaktivnu provjeru ispita (opcionalno, jer baza štiti)

class SubjectService {
    async getAllSubjects() {
        return await subjectRepository.findAll();
    }

    async getSubjectById(id) {
        const subject = await subjectRepository.findById(id);
        if (!subject) {
            const error = new Error('Predmet nije pronađen.');
            error.statusCode = 404;
            throw error;
        }
        return subject;
    }

    async createSubject(subjectData) {
        const { name } = subjectData;
        if (!name || name.trim() === '') {
            const error = new Error('Naziv predmeta je obavezan.');
            error.statusCode = 400;
            throw error;
        }

        // Repozitorij (i baza) će se pobrinuti za provjeru jedinstvenosti imena.
        // Ako dođe do greške zbog unique constrainta, treba je uhvatiti u kontroleru.
        try {
            return await subjectRepository.create({ name: name.trim() });
        } catch (dbError) {
            if (dbError.code === '23505') { // Unique violation
                const error = new Error('Predmet s ovim nazivom već postoji.');
                error.statusCode = 409;
                throw error;
            }
            throw dbError; // Baci ostale DB greške dalje
        }
    }

    async updateSubject(id, subjectData) {
        const { name } = subjectData;
        if (!name || name.trim() === '') {
            const error = new Error('Naziv predmeta je obavezan.');
            error.statusCode = 400;
            throw error;
        }

        const subjectToUpdate = await subjectRepository.findById(id);
        if (!subjectToUpdate) {
            const error = new Error('Predmet nije pronađen za ažuriranje.');
            error.statusCode = 404;
            throw error;
        }

        try {
            const updatedSubject = await subjectRepository.update(id, { name: name.trim() });
            if (!updatedSubject) {
                // Ovo se ne bi smjelo dogoditi ako findById prođe, a UPDATE vrati RETURNING
                const error = new Error('Ažuriranje predmeta nije uspjelo ili predmet nije pronađen.');
                error.statusCode = 404; // Ili 500 ako je greška u upitu
                throw error;
            }
            return updatedSubject;
        } catch (dbError) {
            if (dbError.code === '23505') { // Unique violation
                const error = new Error('Predmet s ovim nazivom već postoji.');
                error.statusCode = 409;
                throw error;
            }
            throw dbError;
        }
    }

    async deleteSubject(id) {
        const subjectToDelete = await subjectRepository.findById(id);
        if (!subjectToDelete) {
            const error = new Error('Predmet nije pronađen za brisanje.');
            error.statusCode = 404;
            throw error;
        }

        // Baza će spriječiti brisanje ako je predmet u upotrebi (ON DELETE RESTRICT).
        // Možemo uhvatiti tu grešku u kontroleru.
        try {
            const result = await subjectRepository.delete(id);
            if (result.rowCount === 0) {
                // Ovo se ne bi smjelo dogoditi ako findById prođe
                const error = new Error('Predmet nije pronađen za brisanje (nakon pokušaja).');
                error.statusCode = 404;
                throw error;
            }
        } catch (dbError) {
            if (dbError.code === '23503') { // Foreign key violation (restrict)
                const error = new Error('Predmet se ne može obrisati jer je povezan s postojećim ispitima.');
                error.statusCode = 409; // Conflict
                throw error;
            }
            throw dbError;
        }
    }
}

module.exports = new SubjectService();