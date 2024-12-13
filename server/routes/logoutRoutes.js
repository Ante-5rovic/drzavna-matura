const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    //Postavljanje jwtToken cookija s praznom vrijednošću i datumom isteka u prošlosti
    res.cookie('jwtToken', '', {
      httpOnly: true,
      secure: false, //To cemo postaviti na true u produkciji kada budemo imali HTTPS
      sameSite: 'Strict',
      expires: new Date(0) //Datum isteka u prošlosti
    });

    res.status(200).json({ message: 'Uspješna odjava!' });
});

module.exports = router;