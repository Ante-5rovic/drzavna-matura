// server/services/stimulusService.js
const stimulusRepository = require('../repositories/stimulusRepository');
const questionRepository = require('../repositories/questionRepository'); // Za provjeru korištenja

class StimulusService {
    async getAllStimuli() {
        return await stimulusRepository.findAll();
    }

    async getStimulusById(id) {
        const stimulus = await stimulusRepository.findById(id);
        if (!stimulus) {
            const error = new Error('Stimulus nije pronađen.');
            error.statusCode = 404;
            throw error;
        }
        return stimulus;
    }

    async createStimulus(data) {
        const { stimulus_type, description, content_data } = data;
        if (!stimulus_type || String(stimulus_type).trim() === '') {
            const error = new Error('Tip stimulusa (stimulus_type) je obavezan.');
            error.statusCode = 400;
            throw error;
        }
        if (!description || String(description).trim() === '') {
            const error = new Error('Opis stimulusa je obavezan.');
            error.statusCode = 400;
            throw error;
        }

        return await stimulusRepository.createForAdmin({
            stimulus_type: String(stimulus_type).trim(),
            description: String(description).trim(),
            content_data: content_data || {} // Default na prazan JSON objekt ako nije poslano
        });
    }

    async updateStimulus(id, data) {
        const stimulusToUpdate = await stimulusRepository.findById(id);
        if (!stimulusToUpdate) {
            const error = new Error('Stimulus nije pronađen za ažuriranje.');
            error.statusCode = 404;
            throw error;
        }

        const updateData = {};
        if (data.stimulus_type !== undefined) updateData.stimulus_type = String(data.stimulus_type).trim();
        if (data.description !== undefined) updateData.description = String(data.description).trim();
        if (data.content_data !== undefined) updateData.content_data = data.content_data || {};


        if (Object.keys(updateData).length === 0) {
            return stimulusToUpdate; // Nema polja za ažuriranje
        }
        
        // Ako je description prazan string, a bio je obavezan, treba provjeriti
        if (updateData.description === '') {
            const error = new Error('Opis stimulusa ne smije biti prazan.');
            error.statusCode = 400;
            throw error;
        }
         if (updateData.stimulus_type === '') {
            const error = new Error('Tip stimulusa ne smije biti prazan.');
            error.statusCode = 400;
            throw error;
        }


        const updatedStimulus = await stimulusRepository.updateForAdmin(id, updateData);
        if (!updatedStimulus) {
            const error = new Error('Ažuriranje stimulusa nije uspjelo ili stimulus nije pronađen.');
            error.statusCode = 404;
            throw error;
        }
        return updatedStimulus;
    }

    async deleteStimulus(id) {
        const stimulusToDelete = await stimulusRepository.findById(id);
        if (!stimulusToDelete) {
            const error = new Error('Stimulus nije pronađen za brisanje.');
            error.statusCode = 404;
            throw error;
        }

        // Baza će automatski postaviti question.stimulus_id na NULL zbog ON DELETE SET NULL.
        // Možemo dodati provjeru i upozorenje ako se stimulus još uvijek koristi.
        const usageCount = await questionRepository.countByStimulusId(id);
        if (usageCount > 0) {
            // Ovo je više upozorenje, jer će DB dopustiti brisanje i postaviti FK na NULL.
            console.warn(`Stimulus ${id} se još uvijek koristi u ${usageCount} pitanja. Bit će postavljen na NULL u tim pitanjima.`);
        }

        const result = await stimulusRepository.delete(id); // Koristi repo metodu koja može primiti client
        if (result.rowCount === 0) {
            const error = new Error('Stimulus nije pronađen za brisanje (nakon pokušaja).');
            error.statusCode = 404;
            throw error;
        }
    }

    // Metoda koju koristi QuestionService
    async findOrCreateStimulus(description, client, stimulus_type = 'text', content_data = {}) {
        if (!description || String(description).trim() === '') {
            return null;
        }
        let stimulus = await stimulusRepository.findByDescription(String(description).trim(), client);
        if (!stimulus) {
            stimulus = await stimulusRepository.create({ 
                description: String(description).trim(), 
                stimulus_type, 
                content_data 
            }, client);
        }
        return stimulus.id;
    }
}

module.exports = new StimulusService();