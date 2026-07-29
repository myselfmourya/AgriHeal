const http = require('http');
const https = require('https');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => resolve({ url, status: 'error' }));
  });
};

const urls = [
  'https://www.iffcoebazar.in/en/product/sagarika-liquid',
  'https://www.iffcoebazar.in/en/product/wsf-19-19-19',
  'https://www.iffcoebazar.in/en/product/wsf-0-52-34',
  'https://www.iffcoebazar.in/en/product/zinc-sulphate-monohydrate',
  'https://www.bighaat.com/products/multiplex-kranti',
  'https://www.bighaat.com/products/katyayani-activated-humic-acid',
  'https://www.bighaat.com/products/aries-chelamin-plant-fertilizer',
  'https://www.bighaat.com/products/anand-agro-dr-bacto-s-pseudomonas',
  'https://www.bighaat.com/products/yara-vera-amidas',
  'https://www.bighaat.com/products/mahadhan-smartek-10-26-26-fertilizer',
  'https://www.bighaat.com/products/nagarjuna-urea-fertilizer',
  'https://www.bighaat.com/products/sujala-19-19-19-fertilizer',
  'https://www.bighaat.com/products/gromor-14-35-14-fertilizer',
  'https://www.bighaat.com/products/mahadhan-19-19-19-fertilizer',
];

Promise.all(urls.map(checkUrl)).then(results => console.log(results));
