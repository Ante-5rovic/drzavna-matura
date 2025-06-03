const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.jwtToken;

    if (token == null) {
        console.log("Token je null");
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Greška prilikom verifikacije");
            return res.sendStatus(403);
        }

        if (!user.verified) {
            return res.status(403).json({ error: 'Korisnički račun nije verificiran.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;