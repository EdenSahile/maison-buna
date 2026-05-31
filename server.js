import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import devisRouter from './routes/devis.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static('public'));
app.use('/api', devisRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Maison Buna Devis — http://localhost:${PORT}`);
});
