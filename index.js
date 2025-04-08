const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔁 Função para consultar todos os resultados
async function obterResultados() {
  const { rows } = await pool.query('SELECT * FROM resultados');
  return rows;
}

// 📌 Último resultado
app.get('/ultimo-resultado', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM resultados ORDER BY data DESC LIMIT 1'
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter último resultado:', error);
    res.status(500).json({ error: 'Erro ao obter último resultado' });
  }
});

// 🔥 Números mais sorteados (quentes)
app.get('/numeros-quentes', async (req, res) => {
  try {
    const resultados = await obterResultados();
    const contagem = {};

    resultados.forEach((resultado) => {
      resultado.dezenas.forEach((dezena) => {
        contagem[dezena] = (contagem[dezena] || 0) + 1;
      });
    });

    const quentes = Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([numero]) => parseInt(numero));

    res.json(quentes);
  } catch (error) {
    console.error('Erro ao obter números quentes:', error);
    res.status(500).json({ error: 'Erro ao obter números quentes' });
  }
});

// ❄️ Números menos sorteados (frios)
app.get('/numeros-frios', async (req, res) => {
  try {
    const resultados = await obterResultados();
    const contagem = {};

    resultados.forEach((resultado) => {
      resultado.dezenas.forEach((dezena) => {
        contagem[dezena] = (contagem[dezena] || 0) + 1;
      });
    });

    const frios = Object.entries(contagem)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10)
      .map(([numero]) => parseInt(numero));

    res.json(frios);
  } catch (error) {
    console.error('Erro ao obter números frios:', error);
    res.status(500).json({ error: 'Erro ao obter números frios' });
  }
});

// 🎯 Gerar 4 palpites com base nos números quentes
app.get('/palpites', async (req, res) => {
  try {
    const resultados = await obterResultados();
    const contagem = {};

    resultados.forEach((resultado) => {
      resultado.dezenas.forEach((dezena) => {
        contagem[dezena] = (contagem[dezena] || 0) + 1;
      });
    });

    const maisFrequentes = Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .map(([numero]) => parseInt(numero));

    const palpites = [];

    while (palpites.length < 4) {
      const palpite = [];
      const usados = new Set();

      for (let i = 0; palpite.length < 6 && i < maisFrequentes.length; i++) {
        const num = maisFrequentes[i];
        if (!usados.has(num)) {
          usados.add(num);
          palpite.push(num);
        }
      }

      // embaralhar
      for (let i = palpite.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [palpite[i], palpite[j]] = [palpite[j], palpite[i]];
      }

      palpites.push(palpite.slice(0, 6));
    }

    res.json(palpites);
  } catch (error) {
    console.error('Erro ao gerar palpites:', error);
    res.status(500).json({ error: 'Erro ao gerar palpites' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
