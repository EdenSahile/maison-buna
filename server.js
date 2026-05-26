import 'dotenv/config';
import express from 'express';
import devisRouter from './routes/devis.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api', devisRouter);

app.listen(PORT, () => {
  console.log(`Maison Buna Devis — http://localhost:${PORT}`);
});
