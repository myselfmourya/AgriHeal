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

async function checkUrl(slug) {
  const url = `https://www.bighaat.com/products/${slug}`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.status === 200) {
      console.log(`[OK] ${url}`);
      return url;
    }
  } catch (e) {}
  return null;
}

(async () => {
  for (const p of products) {
    const slug1 = p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug2 = slug1 + '-fertilizer';
    const slug3 = slug1 + '-liquid';
    
    let found = await checkUrl(slug1) || await checkUrl(slug2) || await checkUrl(slug3);
    
    if (!found) {
       console.log(`[MISSING] ${p} - Guessed: ${slug1}`);
    }
  }
})();
