const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    timeout: 0
  });

  const page = await browser.newPage();

  await page.goto('https://asloterias.com.br/lista-de-resultados-da-mega-sena?ordenacao=sorteio', {
    waitUntil: 'domcontentloaded',
    timeout: 0
  });

  await page.waitForTimeout(5000); // Espera 5 segundos pra página carregar

  const html = await page.content(); // Pega o HTML visível

  fs.writeFileSync('pagina.html', html); // Salva num arquivo chamado pagina.html

  console.log('✅ HTML salvo como "pagina.html" dentro da pasta backend');
  await browser.close();
})();
