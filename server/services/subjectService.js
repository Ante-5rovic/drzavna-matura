const subjectRepository = require('../repositories/subjectRepository');

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

        const trimmedName = name.trim();

        const existingSubject = await subjectRepository.findByName(trimmedName);
        if (existingSubject) {
            const error = new Error('Predmet s ovim nazivom već postoji.');
            error.statusCode = 409;
            throw error;
        }
        try {
            return await subjectRepository.create({ name: trimmedName });
        } catch (dbError) {
            if (dbError.code === '23505') {
                const error = new Error('Predmet s ovim nazivom već postoji (greška baze).');
                error.statusCode = 409;
                throw error;
            }
            console.error("Neočekivana greška baze kod kreiranja predmeta:", dbError);
            throw dbError;
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

        const trimmedName = name.trim();
        if (trimmedName.toLowerCase() !== subjectToUpdate.name.toLowerCase()) {
            const existingSubjectWithNewName = await subjectRepository.findByName(trimmedName);
            if (existingSubjectWithNewName && existingSubjectWithNewName.id !== parseInt(id)) {
                const error = new Error('Predmet s ovim nazivom već postoji (konflikt s drugim predmetom).');
                error.statusCode = 409;
                throw error;
            }
        }
        
        try {
            const updatedSubject = await subjectRepository.update(id, { name: trimmedName });
            if (!updatedSubject) {
                const error = new Error('Ažuriranje predmeta nije uspjelo ili predmet nije pronađen.');
                error.statusCode = 404; 
                throw error;
            }
            return updatedSubject;
        } catch (dbError) {
            if (dbError.code === '23505') { 
                const error = new Error('Predmet s ovim nazivom već postoji (greška baze pri ažuriranju).');
                error.statusCode = 409;
                throw error;
            }
            console.error("Neočekivana greška baze kod ažuriranja predmeta:", dbError);
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

        try {
            const result = await subjectRepository.delete(id);
            if (result.rowCount === 0) {
                const error = new Error('Predmet nije pronađen za brisanje (nakon pokušaja).');
                error.statusCode = 404;
                throw error;
            }
        } catch (dbError) {
            if (dbError.code === '23503') { 
                const error = new Error('Predmet se ne može obrisati jer je povezan s postojećim ispitima (greška baze).');
                error.statusCode = 409; 
                throw error;
            }
            console.error("Neočekivana greška baze kod brisanja predmeta:", dbError);
            throw dbError;
        }
    }
}

module.exports = new SubjectService();