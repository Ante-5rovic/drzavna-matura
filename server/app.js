const express = require('express');
const app = express();
const port = 3000;

//Rute
const examRoutes = require('./routes/examRoutes');

//Middleware
app.use(express.json());
app.use('/exam', examRoutes);

app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
});
