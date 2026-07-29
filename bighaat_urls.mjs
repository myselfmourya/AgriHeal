import puppeteer from 'puppeteer';

const products = [
  "IFFCO Nano Urea",
  "IFFCO DAP Fertilizer",
  "IFFCO NPK 12-32-16",
  "IFFCO Sagarika Liquid",
  "Katyayani NPK 19-19-19",
  "Katyayani Humic Acid",
  "Mahadhan Smartek 10 26 26",
  "Gromor 28 28 0",
  "YaraMila Complex fertilizer",
  "Aries Chelamin Zinc",
  "Neem Coated Urea",
  "YaraLiva Nitrabor",
  "Multiplex Kranti",
  "Katra Mono Potassium Phosphate 0 52 34",
  "Dr Bactos Pseudomonas"
];

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  for (const prod of products) {
    try {
      await page.goto(`https://www.bighaat.com/search?q=${encodeURIComponent(prod)}`, { waitUntil: 'networkidle2' });
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href^="/products/"]')).map(a => a.href);
      });
      console.log(`[${prod}] Found links:`, Array.from(new Set(links)).slice(0, 2));
    } catch (e) {
      console.log(`[${prod}] Error:`, e.message);
    }
  }
  
  await browser.close();
})();
