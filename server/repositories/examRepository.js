// server/repositories/exam.repository.js
const pool = require('../db'); // Tvoja konfiguracija za pg pool

class ExamRepository {
    async findAllWithSubjectDetails() {
        const result = await pool.query(`
            SELECT e.id, s.name AS subject_name, e.year, e.term, e.level, e.title_display, e.subject_id
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            ORDER BY e.year DESC, e.term, s.name, e.level;
        `);
        return result.rows;
    }

    async findByIdWithSubjectDetails(id) {
        const result = await pool.query(`
            SELECT e.id, s.name AS subject_name, e.year, e.term, e.level, e.title_display, e.subject_id
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            WHERE e.id = $1;
        `, [id]);
        return result.rows[0]; // Vraća jedan redak ili undefined ako nema rezultata
    }

    async findById(id) { // Možda će trebati i jednostavniji findById za internu upotrebu servisa
        const result = await pool.query('SELECT * FROM exam WHERE id = $1', [id]);
        return result.rows[0];
    }


    async findByDetails(subject_id, year, term, level) {
        // Ažurirana provjera za level: (level = $4 ILI (level JE NULL I $4 = ''))
        const result = await pool.query(
            `SELECT id FROM exam WHERE subject_id = $1 AND year = $2 AND term = $3 AND (level = $4 OR (level IS NULL AND $4 = ''));`,
            [subject_id, year, term, level]
        );
        return result.rows[0]; // Vraća redak ako postoji duplikat, inače undefined
    }

    async findByDetailsAndNotId(subject_id, year, term, level, id) {
        // (level JE NULL I $4 JE NULL ILI level = $4)
        const result = await pool.query(
            `SELECT id FROM exam WHERE subject_id = $1 AND year = $2 AND term = $3 AND (level IS NULL AND $4 IS NULL OR level = $4) AND id != $5;`,
            [subject_id, year, term, level, id]
        );
        return result.rows[0];
    }

    async create(examData) {
        const { subject_id, year, term, level, title_display } = examData;
        const result = await pool.query(`
            INSERT INTO exam (subject_id, year, term, level, title_display)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, year, term, level, title_display, subject_id;
        `, [subject_id, year, term, level, title_display]);
        return result.rows[0];
    }

    async update(id, examData) {
        const { subject_id, year, term, level, title_display } = examData;
        const result = await pool.query(`
            UPDATE exam
            SET subject_id = $1, year = $2, term = $3, level = $4, title_display = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING id, year, term, level, title_display, subject_id;
        `, [subject_id, year, term, level, title_display, id]);
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query(`
            DELETE FROM exam
            WHERE id = $1
            RETURNING id;
        `, [id]);
        // Vraćamo broj obrisanih redaka ili cijeli rezultat za provjeru u servisu
        return result; // result.rowCount može biti koristan
    }
}

module.exports = new ExamRepository();