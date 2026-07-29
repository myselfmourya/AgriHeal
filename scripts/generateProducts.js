import fs from 'fs';
import https from 'https';

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🛒' },
  { id: 'crop-protection', name: 'Crop Protection', icon: '🧴' },
  { id: 'seeds', name: 'Seeds', icon: '🌾' },
  { id: 'irrigation', name: 'Irrigation Tools', icon: '💧' },
  { id: 'equipment', name: 'Farming Equipment', icon: '🚜' },
  { id: 'instruments', name: 'Farm Instruments', icon: '📏' },
  { id: 'safety', name: 'Safety & Accessories', icon: '🧤' },
  { id: 'storage', name: 'Storage & Packaging', icon: '📦' },
];

const cropLists = [
  ['Rice', 'Wheat', 'Maize'],
  ['Tomato', 'Potato', 'Onion'],
  ['Cotton', 'Sugarcane', 'Soybean'],
  ['All crops']
];

const BASE_PRODUCTS = [
  {
    baseName: 'Imidacloprid 17.8% SL (Insecticide) 250ml',
    searchTitle: 'Insecticide',
    category: 'crop-protection',
    brands: ['Bayer (Confidor)', 'Tata (Tafaban)', 'Dhanuka', 'UPL', 'Syngenta'],
    basePrice: 350,
    usage: 'Foliar spray at 1ml per 3 liters of water.',
    benefits: ['Controls aphids and jassids', 'Systemic action'],
    warnings: ['Toxic to bees', 'Wear protective gear']
  },
  {
    baseName: 'Glyphosate 41% SL (Herbicide) 1L',
    searchTitle: 'Glyphosate',
    category: 'crop-protection',
    brands: ['Monsanto (Roundup)', 'Excel (Mera 71)', 'Crystal', 'Atul', 'Nagarjuna'],
    basePrice: 500,
    usage: 'Spray on actively growing weeds.',
    benefits: ['Non-selective weed control', 'Kills roots'],
    warnings: ['Do not spray on main crop']
  },
  {
    baseName: 'Mancozeb 75% WP (Fungicide) 500g',
    searchTitle: 'Fungicide',
    category: 'crop-protection',
    brands: ['Indofil (M-45)', 'UPL', 'Syngenta', 'Tata', 'Coromandel'],
    basePrice: 280,
    usage: 'Foliar spray.',
    benefits: ['Broad spectrum disease control', 'Prevents blight'],
    warnings: ['Do not mix with alkaline chemicals']
  },
  {
    baseName: 'Hybrid Tomato Seeds 10g',
    searchTitle: 'Tomato',
    category: 'seeds',
    brands: ['Syngenta (Saaho)', 'Seminis', 'Namdhari', 'Kaveri', 'Advanta'],
    basePrice: 400,
    usage: 'Nursery sowing followed by transplanting.',
    benefits: ['High yield', 'Disease tolerant'],
    warnings: ['Store in cool place']
  },
  {
    baseName: 'Wheat Seeds 40kg',
    searchTitle: 'Wheat',
    category: 'seeds',
    brands: ['Mahyco', 'Pioneer', 'Shriram', 'Nuziveedu', 'Kaveri'],
    basePrice: 1200,
    usage: 'Direct sowing.',
    benefits: ['High tillering', 'Rust resistant'],
    warnings: ['Protect from moisture before sowing']
  },
  {
    baseName: 'Hybrid Rice Seeds 10kg', searchTitle: 'Rice', category: 'seeds', brands: ['Bayer', 'Syngenta', 'Mahyco', 'Kaveri'], basePrice: 800, usage: 'Direct sowing or nursery.', benefits: ['High yield'], warnings: ['Keep dry']
  },
  {
    baseName: 'Maize Seeds 5kg', searchTitle: 'Maize', category: 'seeds', brands: ['Pioneer', 'Advanta', 'Syngenta', 'Mahyco'], basePrice: 600, usage: 'Direct sowing.', benefits: ['Drought tolerant'], warnings: ['Keep dry']
  },
  {
    baseName: 'Cotton Seeds 2kg', searchTitle: 'Cotton', category: 'seeds', brands: ['Nuziveedu', 'Mahyco', 'Kaveri', 'Bayer'], basePrice: 1500, usage: 'Direct sowing.', benefits: ['Pest resistant'], warnings: ['Keep dry']
  },
  {
    baseName: 'Soybean Seeds 20kg', searchTitle: 'Soybean', category: 'seeds', brands: ['JS', 'Eagle', 'Mahyco', 'Syngenta'], basePrice: 1800, usage: 'Direct sowing.', benefits: ['High protein'], warnings: ['Keep dry']
  },
  {
    baseName: 'Onion Seeds 500g', searchTitle: 'Onion', category: 'seeds', brands: ['Namdhari', 'Jindal', 'Mahyco', 'Syngenta'], basePrice: 500, usage: 'Nursery then transplant.', benefits: ['Long shelf life'], warnings: ['Keep dry']
  },
  {
    baseName: 'Potato Tubers 50kg', searchTitle: 'Potato', category: 'seeds', brands: ['Kufri', 'CPRI', 'Local', 'Agri'], basePrice: 1000, usage: 'Direct planting.', benefits: ['High yield'], warnings: ['Keep cool']
  },
  {
    baseName: 'Sugarcane Setts 100pcs', searchTitle: 'Sugarcane', category: 'seeds', brands: ['Co', 'Local', 'SBI', 'Agri'], basePrice: 300, usage: 'Direct planting.', benefits: ['High sugar'], warnings: ['Keep moist']
  },
  {
    baseName: 'Mustard Seeds 2kg', searchTitle: 'Mustard', category: 'seeds', brands: ['Pioneer', 'Advanta', 'Mahyco', 'Syngenta'], basePrice: 400, usage: 'Direct sowing.', benefits: ['High oil content'], warnings: ['Keep dry']
  },
  {
    baseName: 'Groundnut Seeds 10kg', searchTitle: 'Groundnut', category: 'seeds', brands: ['K6', 'TMV', 'Local', 'Agri'], basePrice: 900, usage: 'Direct sowing.', benefits: ['High oil content'], warnings: ['Keep dry']
  },
  {
    baseName: 'Sunflower Seeds 2kg', searchTitle: 'Sunflower', category: 'seeds', brands: ['Kaveri', 'Advanta', 'Mahyco', 'Syngenta'], basePrice: 500, usage: 'Direct sowing.', benefits: ['High oil content'], warnings: ['Keep dry']
  },
  {
    baseName: 'Cabbage Seeds 10g', searchTitle: 'Cabbage', category: 'seeds', brands: ['Seminis', 'Namdhari', 'Syngenta', 'Mahyco'], basePrice: 300, usage: 'Nursery then transplant.', benefits: ['Firm heads'], warnings: ['Keep dry']
  },
  {
    baseName: 'Cauliflower Seeds 10g', searchTitle: 'Cauliflower', category: 'seeds', brands: ['Seminis', 'Namdhari', 'Syngenta', 'Mahyco'], basePrice: 350, usage: 'Nursery then transplant.', benefits: ['White curds'], warnings: ['Keep dry']
  },
  {
    baseName: 'Carrot Seeds 50g', searchTitle: 'Carrot', category: 'seeds', brands: ['Namdhari', 'Syngenta', 'Mahyco', 'Local'], basePrice: 200, usage: 'Direct sowing.', benefits: ['Long roots'], warnings: ['Keep dry']
  },
  {
    baseName: 'Radish Seeds 100g', searchTitle: 'Radish', category: 'seeds', brands: ['Namdhari', 'Syngenta', 'Mahyco', 'Local'], basePrice: 150, usage: 'Direct sowing.', benefits: ['Fast growing'], warnings: ['Keep dry']
  },
  {
    baseName: 'Spinach Seeds 500g', searchTitle: 'Spinach', category: 'seeds', brands: ['Namdhari', 'Syngenta', 'Mahyco', 'Local'], basePrice: 100, usage: 'Direct sowing.', benefits: ['Green leaves'], warnings: ['Keep dry']
  },
  {
    baseName: 'Okra (Bhindi) Seeds 100g', searchTitle: 'Okra', category: 'seeds', brands: ['Advanta', 'Syngenta', 'Mahyco', 'Namdhari'], basePrice: 250, usage: 'Direct sowing.', benefits: ['Disease tolerant'], warnings: ['Keep dry']
  },
  {
    baseName: 'Brinjal Seeds 10g', searchTitle: 'Brinjal', category: 'seeds', brands: ['Seminis', 'Namdhari', 'Syngenta', 'Mahyco'], basePrice: 200, usage: 'Nursery then transplant.', benefits: ['High yield'], warnings: ['Keep dry']
  },
  {
    baseName: 'Chili Seeds 10g', searchTitle: 'Chili', category: 'seeds', brands: ['Seminis', 'Namdhari', 'Syngenta', 'Mahyco'], basePrice: 300, usage: 'Nursery then transplant.', benefits: ['High pungency'], warnings: ['Keep dry']
  },
  {
    baseName: 'Bitter Gourd Seeds 50g', searchTitle: 'Bitter Gourd', category: 'seeds', brands: ['Seminis', 'Namdhari', 'Syngenta', 'Mahyco'], basePrice: 250, usage: 'Direct sowing.', benefits: ['Dark green fruits'], warnings: ['Keep dry']
  },
  {
    baseName: 'Pumpkin Seeds 100g', searchTitle: 'Pumpkin', category: 'seeds', brands: ['Seminis', 'Namdhari', 'Syngenta', 'Mahyco'], basePrice: 150, usage: 'Direct sowing.', benefits: ['Large fruits'], warnings: ['Keep dry']
  },
  {
    baseName: 'Drip Irrigation Pipe (16mm, 400m)',
    searchTitle: 'Drip irrigation',
    category: 'irrigation',
    brands: ['Jain Irrigation', 'Netafim', 'Finolex', 'Captain', 'Kothari'],
    basePrice: 2500,
    usage: 'Lay along crop rows and connect to sub-main.',
    benefits: ['Water saving', 'Even distribution'],
    warnings: ['Flush lines regularly']
  },
  {
    baseName: 'Impact Sprinkler 1/2 inch', searchTitle: 'Sprinkler', category: 'irrigation', brands: ['Jain', 'Kothari', 'Netafim', 'Local', 'Agri'], basePrice: 150, usage: 'Attach to riser pipes.', benefits: ['Uniform watering'], warnings: ['Check pressure']
  },
  {
    baseName: 'PVC Water Tank 1000L', searchTitle: 'Water Tank', category: 'irrigation', brands: ['Sintex', 'Plasto', 'Supreme', 'Ashirvad', 'Local'], basePrice: 4500, usage: 'Store water for farm use.', benefits: ['Durable'], warnings: ['Place on flat surface']
  },
  {
    baseName: 'Butterfly Valve 2.5 inch', searchTitle: 'Valve', category: 'irrigation', brands: ['Finolex', 'Jain', 'Supreme', 'Ashirvad', 'Local'], basePrice: 450, usage: 'Control water flow in pipes.', benefits: ['Leak proof'], warnings: ['Do not over-tighten']
  },
  {
    baseName: 'Battery Operated Knapsack Sprayer 16L',
    searchTitle: 'Knapsack sprayer',
    category: 'equipment',
    brands: ['Aspee', 'Neptune', 'Balwaan', 'KisanKraft', 'Padgilwar'],
    basePrice: 2200,
    usage: 'Fill tank, switch on, and spray.',
    benefits: ['No manual pumping', 'Adjustable pressure'],
    warnings: ['Charge fully before use']
  },
  {
    baseName: 'Power Tiller 7HP', searchTitle: 'Power Tiller', category: 'equipment', brands: ['Honda', 'KisanKraft', 'VST', 'Greaves', 'Shriram'], basePrice: 45000, usage: 'Tilling small farms.', benefits: ['High efficiency'], warnings: ['Check oil level']
  },
  {
    baseName: 'Reversible Plough 2 Bottom', searchTitle: 'Plough', category: 'equipment', brands: ['Mahindra', 'Sonalika', 'Lemken', 'Fieldking', 'Local'], basePrice: 35000, usage: 'Attach to tractor for deep ploughing.', benefits: ['Turns soil perfectly'], warnings: ['Grease moving parts']
  },
  {
    baseName: 'Petrol Brush Cutter 50cc', searchTitle: 'Brush Cutter', category: 'equipment', brands: ['Honda', 'Stihl', 'Husqvarna', 'KisanKraft', 'Balwaan'], basePrice: 9500, usage: 'Cutting weeds and small bushes.', benefits: ['Portable and powerful'], warnings: ['Wear safety gear']
  },
  {
    baseName: 'Digital Soil Moisture & pH Meter',
    searchTitle: 'Soil moisture sensor',
    category: 'instruments',
    brands: ['HTC', 'Lutron', 'AgroTech', 'Generic', 'KisanTools'],
    basePrice: 800,
    usage: 'Insert probes 4-6 inches into soil.',
    benefits: ['Instant reading', 'No batteries required for basic models'],
    warnings: ['Clean probes after use']
  },
  {
    baseName: 'Farm Rain Gauge', searchTitle: 'Rain Gauge', category: 'instruments', brands: ['AgriTech', 'Local', 'Generic', 'KisanTools', 'ProFarm'], basePrice: 450, usage: 'Place in open field to measure rainfall.', benefits: ['Accurate tracking'], warnings: ['Empty after reading']
  },
  {
    baseName: 'Digital Farm Thermometer', searchTitle: 'Thermometer', category: 'instruments', brands: ['HTC', 'Lutron', 'Generic', 'AgriTech', 'ProFarm'], basePrice: 600, usage: 'Measure soil or ambient temperature.', benefits: ['Fast reading'], warnings: ['Do not drop']
  },
  {
    baseName: 'Digital Hanging Scale 50kg', searchTitle: 'Scale', category: 'instruments', brands: ['Generic', 'AgriTech', 'ProFarm', 'Local', 'KisanTools'], basePrice: 500, usage: 'Weighing farm produce.', benefits: ['Portable'], warnings: ['Do not overload']
  },
  {
    baseName: 'Chemical Protective Gloves',
    searchTitle: 'Glove',
    category: 'safety',
    brands: ['3M', 'Karam', 'Udyogi', 'Safeguard', 'Generic'],
    basePrice: 200,
    usage: 'Wear while handling chemicals.',
    benefits: ['Chemical resistant', 'Durable'],
    warnings: ['Wash after use']
  },
  {
    baseName: 'N95 Agriculture Safety Mask', searchTitle: 'Mask', category: 'safety', brands: ['3M', 'Venus', 'Karam', 'Generic', 'SafeFarm'], basePrice: 150, usage: 'Wear during spraying.', benefits: ['Filters fine dust and droplets'], warnings: ['Replace when soiled']
  },
  {
    baseName: 'Heavy Duty Gum Boots', searchTitle: 'Boots', category: 'safety', brands: ['Duckback', 'Karam', 'Hillson', 'Generic', 'SafeFarm'], basePrice: 450, usage: 'Wear in wet or muddy fields.', benefits: ['Waterproof', 'Snake bite protection'], warnings: ['Keep dry inside']
  },
  {
    baseName: 'Chemical Protection Suit', searchTitle: 'Suit', category: 'safety', brands: ['3M', 'Karam', 'Udyogi', 'Generic', 'SafeFarm'], basePrice: 850, usage: 'Wear full body suit during hazardous spraying.', benefits: ['Full body protection'], warnings: ['Wash separately']
  },
  {
    baseName: 'Heavy Duty Tarpaulin 12x15 ft',
    searchTitle: 'Tarpaulin',
    category: 'storage',
    brands: ['Silpaulin', 'Tandhan', 'VKO', 'Shalimar', 'Generic'],
    basePrice: 1500,
    usage: 'Cover crops or equipment.',
    benefits: ['Waterproof', 'UV stabilized'],
    warnings: ['Keep away from sharp objects']
  },
  {
    baseName: 'Hermetic Grain Storage Bag 50kg', searchTitle: 'Grain Bag', category: 'storage', brands: ['SaveGrain', 'AgriBag', 'Purdue', 'Generic', 'ProFarm'], basePrice: 120, usage: 'Store grains for long duration.', benefits: ['Pest proof without chemicals'], warnings: ['Do not puncture']
  },
  {
    baseName: 'Plastic Agricultural Crate 50L', searchTitle: 'Crate', category: 'storage', brands: ['Nilkamal', 'Supreme', 'Sintex', 'Generic', 'ProFarm'], basePrice: 400, usage: 'Transporting vegetables and fruits.', benefits: ['Stackable', 'Ventilated'], warnings: ['Do not throw']
  }
];

const IMAGE_MAPPING = {
  'Insecticide': '/tools/insecticide_bottle_1785039857138.jpg',
  'Glyphosate': '/tools/herbicide_bottle_1785039866429.jpg',
  'Tomato': '/tools/tomato_seeds_1785039875715.jpg',
  'Wheat': '/tools/wheat_seeds_1785039885469.jpg',
  'Drip irrigation': '/tools/drip_pipe_1785039894799.jpg',
  'Knapsack sprayer': '/tools/knapsack_sprayer_1785039905314.jpg',
  'Soil moisture sensor': '/tools/soil_meter_1785039914492.jpg',
  'Glove': '/tools/gloves_1785039959920.jpg',
  'Tarpaulin': '/tools/tarpaulin_1785039969593.jpg',
  'Tractor': '/tools/tractor_1785039925218.jpg',
  'Cultivator': '/tools/cultivator_1785039988157.jpg',
  'Combine harvester': 'https://placehold.co/400x300/e2e8f0/64748b?text=Harvester',
  'Agricultural drone': '/tools/drone_sprayer_1785039935612.jpg',
  'Irrigation': '/tools/water_pump_1785039978910.jpg'
};

const getProductImage = (title, category) => {
  if (IMAGE_MAPPING[title]) return IMAGE_MAPPING[title];
  const query = encodeURIComponent(title.toLowerCase().replace(/ /g, ','));
  const lockId = title.length + (category ? category.length : 0);
  return `https://loremflickr.com/400/300/${query}?lock=${lockId}`;
};

const run = async () => {
  console.log('Fetching images...');
  
  for (const base of BASE_PRODUCTS) {
    base.image = getProductImage(base.searchTitle, base.category);
    console.log(`Mapped image for ${base.baseName}: ${base.image}`);
  }

  const products = [];
  let idCounter = 1;

  BASE_PRODUCTS.forEach(base => {
    base.brands.forEach((brand, index) => {
      products.push({
        id: `p${idCounter++}`,
        name: `${brand} ${base.baseName}`,
        brand: brand,
        category: base.category,
        price: base.basePrice + (Math.floor(Math.random() * 50) - 25),
        discount: index % 3 === 0 ? 10 : 0,
        rating: (4.0 + Math.random() * 0.9).toFixed(1),
        stock: Math.floor(Math.random() * 100) + 10,
        deliveryTime: `${(index % 3) + 1} days`,
        image: base.image,
        suitableFor: cropLists[index % cropLists.length],
        usage: base.usage,
        benefits: base.benefits,
        warnings: base.warnings,
        seller: { name: `${brand} Authorized Dealer`, distance: `${Math.floor(Math.random() * 20) + 1} km`, contact: '+91 90000 00000' }
      });
    });
  });

  const RENTAL_TOOLS = [
    { id: 'r1', name: 'Mahindra 575 DI Tractor', type: 'Tractor', pricePerDay: 2500, owner: 'Ramesh Singh', contact: '+91 98765 11111', distance: '2.5 km', searchTitle: 'Tractor', availability: 'Available Now' },
    { id: 'r2', name: 'Rotavator / Cultivator', type: 'Implement', pricePerDay: 800, owner: 'Suresh Patel', contact: '+91 98765 22222', distance: '4.1 km', searchTitle: 'Cultivator', availability: 'Available tomorrow' },
    { id: 'r3', name: 'Combine Harvester (Paddy/Wheat)', type: 'Harvester', pricePerDay: 4500, owner: 'AgriRentals Hub', contact: '+91 98765 33333', distance: '15.0 km', searchTitle: 'Combine harvester', availability: 'Available in 3 days' },
    { id: 'r4', name: 'Heavy Duty Drone Sprayer', type: 'Drone', pricePerDay: 3500, owner: 'Kisan Drones', contact: '+91 99999 11111', distance: '12.0 km', searchTitle: 'Agricultural drone', availability: 'Available Now' },
    { id: 'r5', name: 'Diesel Water Pump 5HP', type: 'Pump', pricePerDay: 500, owner: 'Water Supply Co.', contact: '+91 66666 44444', distance: '1.5 km', searchTitle: 'Irrigation', availability: 'Available Now' },
  ];

  for (const rental of RENTAL_TOOLS) {
    rental.image = getProductImage(rental.searchTitle);
    console.log(`Mapped image for ${rental.name}: ${rental.image}`);
  }

  const content = `export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const PRODUCTS_DATA = ${JSON.stringify(products, null, 2)};

export const RENTAL_TOOLS = ${JSON.stringify(RENTAL_TOOLS, null, 2)};
`;

  fs.writeFileSync('src/data/storeProducts.js', content, 'utf8');
  console.log('Successfully generated highly realistic storeProducts.js');
};

run();
