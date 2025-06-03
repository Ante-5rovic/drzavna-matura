const express = require('express');
const router = express.Router();
const examService = require('../services/examService');

//ruta za dohvacanje svih matura za odredeni predmet (i opcionalno razinu)
//primjer putanje: /mature/matematika/visa ili /mature/hrvatski
router.get('/:predmet/:razina?', async (req, res, next) => {
    const { predmet, razina } = req.params;
    try {
        const mature = await examService.getPublicExams(predmet, razina === 'null' ? null : razina);
        
        if (mature.length === 0) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(mature);
    } catch (error) {
        next(error);
    }
});

module.exports = router;