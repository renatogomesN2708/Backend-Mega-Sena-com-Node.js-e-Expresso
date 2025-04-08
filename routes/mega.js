// backend/routes/mega.js
const express = require('express');
const router = express.Router();
const scraper = require('../services/scraper');

router.get('/', async (req, res) => {
  try {
    const resultados = await scraper();
    res.json(resultados);
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    res.status(500).json({ error: 'Erro ao obter dados', detalhes: error.message });
  }
});

module.exports = router;
