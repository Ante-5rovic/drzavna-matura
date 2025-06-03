const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/', async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);

        res.cookie('jwtToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 
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