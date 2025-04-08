const puppeteer = require('puppeteer');

async function obterResultadosMegaSena() {
  const url = 'https://asloterias.com.br/lista-de-resultados-da-mega-sena?ordenacao=sorteio';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  const resultados = await page.evaluate(() => {
    const linhas = document.querySelectorAll('.simple-table tbody tr');
    const dados = [];

    linhas.forEach((linha) => {
      const colunas = linha.querySelectorAll('td');
      const concurso = colunas[0]?.innerText.trim();
      const data = colunas[1]?.innerText.trim();
      const dezenas = colunas[2]?.innerText.trim().split(' ').map(Number);

      if (concurso && dezenas.length === 6) {
        dados.push({ concurso, data, dezenas });
      }
    });

    return dados;
  });

  await browser.close();
  return resultados;
}

module.exports = obterResultadosMegaSena;
