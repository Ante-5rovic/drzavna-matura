const app = require('./app');
const port = 3000;

app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
  console.log(`Frontend URL (CORS origin): ${process.env.FRONTEND_URL || 'http://localhost:5000'}`);
});
