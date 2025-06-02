// server/repositories/stimulusRepository.js
const pool = require('../db');

class StimulusRepository {
    async findAll() {
        const result = await pool.query('SELECT id, stimulus_type, description, content_data FROM stimulus ORDER BY id;');
        return result.rows;
    }

    async findById(id, client = pool) {
        const result = await client.query(
            'SELECT id, stimulus_type, description, content_data, created_at, updated_at FROM stimulus WHERE id = $1;',
            [id]
        );
        return result.rows[0];
    }

    async findByDescription(description, client = pool) {
        const result = await client.query('SELECT id, description, stimulus_type FROM stimulus WHERE description = $1;', [description]);
        return result.rows[0];
    }

    async create(stimulusData, client = pool) { // Ovu metodu koristi QuestionService
        const { description, stimulus_type = 'text', content_data = {} } = stimulusData;
        const result = await client.query(
            'INSERT INTO stimulus (stimulus_type, description, content_data) VALUES ($1, $2, $3) RETURNING id, description, stimulus_type, content_data;',
            [stimulus_type, description, content_data]
        );
        return result.rows[0];
    }

    // Metode za opći CRUD šifrarnika (ne moraju nužno biti unutar transakcije)
    async createForAdmin(stimulusData) {
        const { stimulus_type, description, content_data = {} } = stimulusData;
        const result = await pool.query(
            'INSERT INTO stimulus (stimulus_type, description, content_data) VALUES ($1, $2, $3) RETURNING *;',
            [stimulus_type, description, content_data]
        );
        return result.rows[0];
    }

    async updateForAdmin(id, stimulusData) {
        const { stimulus_type, description, content_data } = stimulusData;
        // updated_at se automatski ažurira triggerom
        
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (stimulus_type !== undefined) {
            fields.push(`stimulus_type = $${paramIndex++}`);
            values.push(stimulus_type);
        }
        if (description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(description);
        }
        if (content_data !== undefined) {
            fields.push(`content_data = $${paramIndex++}`);
            values.push(content_data);
        }
        
        if (fields.length === 0) { // Nema polja za ažuriranje
            return this.findById(id); // Vrati trenutno stanje
        }

        const query = `UPDATE stimulus SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *;`;
        values.push(id);
        
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async delete(id, client = pool) { // Neka i ova prima client za konzistentnost ako se pozove unutar transakcije
        // ON DELETE SET NULL će obrisati stimulus_id u question tablici
        const result = await client.query('DELETE FROM stimulus WHERE id = $1 RETURNING id;', [id]);
        return result;
    }
}

module.exports = new StimulusRepository();