const express = require('express');
const router = express.Router();
const pool = require('../db');

//Ruta za dohvaćanje svih matura za određeni predmet (i opcionalno razinu)
router.get('/:predmet/:razina?', async (req, res) => {
    const { predmet, razina } = req.params; //Dohvaćamo predmet i opcionalnu razinu iz URL-a

    try {
        const query = `
            SELECT e.id, s.name AS predmet, e.year, e.term, e.level
            FROM exam e
            JOIN subject s ON e.subject_id = s.id
            WHERE LOWER(s.name) = LOWER($1) 
                AND ($2::VARCHAR IS NULL OR LOWER(e.level) = LOWER($2))
            ORDER BY e.year DESC, e.term;
        `;

        const result = await pool.query(query, [predmet, razina || null]); //Ako razina nije definirana, postavljamo je na NULL

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