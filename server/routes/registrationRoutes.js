const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/', async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error); 
    }
});

router.get('/verify-email', async (req, res, next) => {
    const { token } = req.query;
    try {
        const result = await authService.verifyEmail(token);
        
        res.cookie('jwtToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000, // 1h
        });
        
        res.status(200).json({ 
            message: result.message, 
            user: result.user 
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;