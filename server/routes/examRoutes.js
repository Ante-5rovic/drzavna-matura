const express = require('express');
const router = express.Router();
const examService = require('../services/examService');

router.get('/:id', async (req, res, next) => {
    try {
        const examId = req.params.id;
        const examDetails = await examService.getFullExamForDisplay(examId);
        res.json(examDetails);
    } catch (error) {
        next(error);
    }
});

module.exports = router;