const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto('https://asloterias.com.br/lista-de-resultados-da-mega-sena?ordenacao=sorteio', {
    waitUntil: 'networkidle0'
  });

  // Espera um pouco para garantir que o conteúdo foi carregado
  await page.waitForTimeout(3000);

  const html = await page.content();

  fs.writeFileSync('pagina.html', html);

  console.log('✅ Página salva como pagina.html');

  await browser.close();
})();
