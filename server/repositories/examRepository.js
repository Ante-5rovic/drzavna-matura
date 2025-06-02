// server/repositories/examRepository.js
const pool = require('../db');

class ExamRepository {
    async findAllWithSubjectDetails(client = pool) { // Dodaj client
        const result = await client.query(`
            SELECT e.id, s.name AS subject_name, e.year, e.term, e.level, e.title_display, e.subject_id
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            ORDER BY e.year DESC, e.term, s.name, e.level;
        `);
        return result.rows;
    }

    async findByIdWithSubjectDetails(id, client = pool) { // Dodaj client
        const result = await client.query(`
            SELECT e.id, s.name AS subject_name, e.year, e.term, e.level, e.title_display, e.subject_id
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            WHERE e.id = $1;
        `, [id]);
        return result.rows[0];
    }

    async findById(id, client = pool) { // Dodaj client
        const result = await client.query('SELECT * FROM exam WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findByDetails(subject_id, year, term, level, client = pool) { // Dodaj client
        const result = await client.query(
            `SELECT id FROM exam WHERE subject_id = $1 AND year = $2 AND term = $3 AND (level = $4 OR (level IS NULL AND $4 = ''));`,
            [subject_id, year, term, level]
        );
        return result.rows[0];
    }

    async findByDetailsAndNotId(subject_id, year, term, level, id, client = pool) { // Dodaj client
        const result = await client.query(
            `SELECT id FROM exam WHERE subject_id = $1 AND year = $2 AND term = $3 AND (level IS NULL AND $4 IS NULL OR level = $4) AND id != $5;`,
            [subject_id, year, term, level, id]
        );
        return result.rows[0];
    }

    async create(examData, client = pool) { // Dodaj client
        const { subject_id, year, term, level, title_display } = examData;
        const result = await client.query(`
            INSERT INTO exam (subject_id, year, term, level, title_display)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, year, term, level, title_display, subject_id;
        `, [subject_id, year, term, level, title_display]);
        return result.rows[0];
    }

    async update(id, examData, client = pool) { // Dodaj client
        const { subject_id, year, term, level, title_display } = examData;
        const result = await client.query(`
            UPDATE exam
            SET subject_id = $1, year = $2, term = $3, level = $4, title_display = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING id, year, term, level, title_display, subject_id;
        `, [subject_id, year, term, level, title_display, id]);
        return result.rows[0];
    }

    async delete(id, client = pool) { // Client je već tu
        const result = await client.query('DELETE FROM exam WHERE id = $1 RETURNING id;', [id]);
        return result;
    }

    async countBySubjectId(subjectId, client = pool) { // Potrebno za SubjectService
        const result = await client.query(
            'SELECT COUNT(*) AS count FROM exam WHERE subject_id = $1;',
            [subjectId]
        );
        return parseInt(result.rows[0].count, 10);
    }
}

module.exports = new ExamRepository();