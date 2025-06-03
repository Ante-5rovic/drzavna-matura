const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.cookie('jwtToken', '', {
      httpOnly: true,
      secure: false, //to cemo postaviti na true u produkciji kada budemo imali HTTPS
      sameSite: 'Strict',
      expires: new Date(0)
    });

    res.status(200).json({ message: 'Uspješna odjava!' });
});

module.exports = router;