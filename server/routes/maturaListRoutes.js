// routes/maturaListRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper funkcija za mapiranje razine iz URL-a u format baze
// Vraća 'A', 'B', ili prazan string '' (što odgovara praznom stringu u bazi za "bez razine")
const mapLevelToDb = (levelParam) => {
    // Ako parametar razine nije poslan, undefined je, ili je "null" string, tretiramo kao bez razine.
    if (!levelParam) return ''; // Vrati prazan string umjesto null
    const lowerLevel = levelParam.toLowerCase();
    if (lowerLevel === 'visa' || lowerLevel === 'viša') return 'A';
    if (lowerLevel === 'niza' || lowerLevel === 'niža') return 'B';
    return ''; // Za bilo koju drugu nepoznatu razinu, vrati prazan string
};

// Helper funkcija za mapiranje naziva predmeta iz URL-a u format baze
const mapSubjectToDb = (subjectParam) => {
    if (!subjectParam) return null; // i dalje vraća null ako je predmet stvarno null/prazan
    const lowerSubject = subjectParam.toLowerCase();
    if (lowerSubject === 'hrvatski') return 'Hrvatski jezik';
    if (lowerSubject === 'matematika') return 'Matematika';
    if (lowerSubject === 'engleski') return 'Engleski jezik';
    return subjectParam; // Vrati original ako nije standardni, za fleksibilnost
};

// Ruta za dohvaćanje svih matura za određeni predmet (i opcionalno razinu)
router.get('/:predmet/:razina?', async (req, res) => {
    const { predmet, razina } = req.params;

    const dbSubjectName = mapSubjectToDb(predmet);
    // dbLevel će sada biti 'A', 'B', ili '' (prazan string)
    const dbLevel = mapLevelToDb(razina === 'null' ? null : razina); // Ovdje i dalje tretiramo "null" string kao null pa ga mapLevelToDb pretvara u ''

    if (!dbSubjectName) {
        return res.status(400).json({ message: 'Nepoznat predmet.' });
    }

    try {
        const query = `
            SELECT e.id, s.name AS predmet, e.year, e.term, e.level, e.title_display
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            WHERE LOWER(s.name) = LOWER($1)
                -- NOVA KLauzula za razinu:
                -- Podudara se ako je e.level jednak $2 (npr. 'A' = 'A', 'B' = 'B', ili '' = '')
                -- ILI ako je e.level NULL U BAZI, a $2 je prazan string (što znači da tražimo "bez razine")
                AND (e.level = $2 OR (e.level IS NULL AND $2 = ''))
            ORDER BY e.year DESC, e.term;
        `;

        const result = await pool.query(query, [dbSubjectName, dbLevel]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Nema dostupnih matura za odabrani predmet i razinu.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Greška kod dohvaćanja matura:', error);
        res.status(500).json({ message: 'Dogodila se pogreška na poslužitelju.' });
    }
});

module.exports = router;