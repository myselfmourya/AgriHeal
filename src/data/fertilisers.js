export const FERTILISERS = [
  {
    id: 1,
    name: "IFFCO Nano Urea Liquid",
    brand: "IFFCO",
    image: "/fertilisers/nano-urea.jpg",
    type: "Chemical (Liquid)",
    bestCrops: ["Paddy", "Wheat", "Maize", "Sugarcane", "Cotton", "Tomato"],
    notRecommendedFor: ["Legumes (during late stages)"],
    price: { perBag: "₹225", bagSize: "500 ml", perKg: "₹450" },
    prices: [
      { seller: "IFFCO eBazar", price: "₹225", rating: 4.9, url: "https://www.iffcoebazar.in/en/product/nano-urea" },
      { seller: "BigHaat", price: "₹225", rating: 4.8, url: "https://www.bighaat.com/products/iffco-nano-urea" }
    ],
    application: { stage: "Vegetative / Tillering", quantity: "2-4 ml per liter", method: "Foliar Spray", bestTime: "Morning / Evening" },
    advantages: ["High efficiency", "Reduces soil pollution", "Easy to spray"],
    disadvantages: ["Requires sprayer equipment"],
    organicAlternatives: [{ name: "Jivamrut", benefits: "Adds organic matter and micro-flora", cost: "Low" }],
    faqs: [
      { q: "Can I use it for Paddy?", a: "Yes, spray 25-30 days after transplanting." },
      { q: "Can it completely replace granular urea?", a: "It can replace top-dressed granular urea by up to 50%, but basal application is still needed." },
      { q: "Is it safe for organic farming?", a: "No, it is a nanotechnology-based chemical fertiliser." },
      { q: "How many sprays are needed?", a: "Typically 2 sprays. One at vegetative stage and another before flowering." }
    ],
    rating: 4.8
  },
  {
    id: 2,
    name: "IFFCO DAP (18-46-0)",
    brand: "IFFCO",
    image: "/fertilisers/iffco-dap.jpg",
    type: "Chemical",
    bestCrops: ["Cotton", "Paddy", "Potato", "Wheat", "Maize"],
    notRecommendedFor: ["Crops sensitive to high phosphorus"],
    price: { perBag: "₹1,350", bagSize: "50 kg", perKg: "₹27" },
    prices: [
      { seller: "IFFCO eBazar", price: "₹1,350", rating: 4.9, url: "https://www.iffcoebazar.in/en/product/dap" },
      { seller: "BigHaat", price: "₹1,350", rating: 4.6, url: "https://www.bighaat.com/products/mahadhan-bensulf-super-fast-fertilizer" },
    ],
    application: { stage: "Basal", quantity: "50 kg/acre", method: "Soil drilling", bestTime: "During sowing" },
    advantages: ["Best source of Phosphorus", "Long lasting", "Provides initial nitrogen"],
    disadvantages: ["Can cause soil hardening over years"],
    organicAlternatives: [{ name: "Rock Phosphate + PROM", benefits: "Natural phosphorus", cost: "₹600/50kg" }],
    faqs: [
      { q: "Is DAP good for Cotton?", a: "Yes, highly recommended as basal dose during sowing." },
      { q: "Can I use it as a top dressing?", a: "No, DAP should be applied as basal because phosphorus is immobile in soil." },
      { q: "Can it be mixed with Urea?", a: "Yes, it is commonly mixed with Urea during basal application." },
      { q: "Why is it better than SSP?", a: "It provides both Nitrogen and Phosphorus, whereas SSP only provides Phosphorus." }
    ],
    rating: 4.8
  },
  {
    id: 3,
    name: "IFFCO NPK 12-32-16",
    brand: "IFFCO",
    image: "/fertilisers/iffco-npk.jpg",
    type: "Chemical",
    bestCrops: ["Tomato", "Potato", "Cotton", "Sugarcane"],
    notRecommendedFor: ["Foliar application"],
    price: { perBag: "₹1,470", bagSize: "50 kg", perKg: "₹29.4" },
    prices: [
      { seller: "IFFCO eBazar", price: "₹1,450", rating: 4.9, url: "https://www.iffcoebazar.in/en/product/npk-12-32-16" },
      { seller: "BigHaat", price: "₹1,470", rating: 4.7, url: "https://www.bighaat.com/collections/npk-fertilizers" },
    ],
    application: { stage: "Basal", quantity: "50 kg/acre", method: "Soil application", bestTime: "Sowing" },
    advantages: ["High phosphorus and potassium", "Great for tuber and fruit crops"],
    disadvantages: ["Not water soluble"],
    organicAlternatives: [{ name: "Vermicompost + Wood Ash", benefits: "Organic nutrients", cost: "₹400/bag" }],
    faqs: [
      { q: "Is it good for Tomatoes?", a: "Yes, excellent as a basal fertiliser because of the potassium." },
      { q: "When should I apply NPK 12:32:16?", a: "Apply it at the time of sowing or transplanting." },
      { q: "Can I dissolve it in water?", a: "No, it is a granular soil fertiliser, not meant for fertigation." },
      { q: "Does it increase fruit size?", a: "Yes, the 16% Potassium content helps significantly in fruit development." }
    ],
    rating: 4.7
  },
  {
    id: 4,
    name: "IFFCO Sagarika Liquid",
    brand: "IFFCO",
    image: "/fertilisers/nano-urea.jpg",
    type: "Bio-Stimulant (Seaweed Extract)",
    bestCrops: ["Paddy", "Cotton", "Tomato", "Wheat", "Chilli"],
    notRecommendedFor: ["None"],
    price: { perBag: "₹250", bagSize: "500 ml", perKg: "₹500" },
    prices: [
      { seller: "IFFCO eBazar", price: "₹250", rating: 4.9, url: "https://www.iffcoebazar.in/en/product/sagarika-liquid-seaweed-extract" },
      { seller: "BigHaat", price: "₹260", rating: 4.7, url: "https://www.bighaat.com/collections/bio-stimulant-1" },
    ],
    application: { stage: "Vegetative / Flowering", quantity: "2.5 ml per liter", method: "Foliar Spray", bestTime: "Morning" },
    advantages: ["Improves root growth", "100% Organic", "Relieves plant stress"],
    disadvantages: ["Needs regular application"],
    organicAlternatives: [{ name: "This is an organic product", benefits: "Seaweed base", cost: "N/A" }],
    faqs: [
      { q: "Is Sagarika a chemical?", a: "No, it is a 100% organic bio-stimulant extracted from Red Seaweed." },
      { q: "Can I mix it with insecticides?", a: "Yes, it is compatible with most common agricultural chemicals." },
      { q: "When should I spray it on Cotton?", a: "Spray at square formation and peak flowering stages." },
      { q: "Does it boost yield?", a: "Yes, it promotes cell division and enhances overall yield by reducing flower drop." }
    ],
    rating: 4.9
  },
  {
    id: 5,
    name: "IFFCO Water Soluble 19:19:19",
    brand: "IFFCO",
    image: "/fertilisers/mahadhan-19.jpg",
    type: "Chemical (Water Soluble)",
    bestCrops: ["Tomato", "Cotton", "Vegetables", "Paddy"],
    notRecommendedFor: ["Basal application"],
    price: { perBag: "₹140", bagSize: "1 kg", perKg: "₹140" },
    prices: [
      { seller: "IFFCO eBazar", price: "₹140", rating: 4.8, url: "https://www.iffcoebazar.in/en/product/npk-19-19-19" },
      { seller: "BigHaat", price: "₹150", rating: 4.6, url: "https://www.bighaat.com/products/katyayani-npk-19-19-19-water-soluble-fertilizer" },
    ],
    application: { stage: "Vegetative", quantity: "5g/liter", method: "Foliar Spray / Drip", bestTime: "Morning" },
    advantages: ["100% water soluble", "Instant greening", "Balances nutrition"],
    disadvantages: ["Short-term effect"],
    organicAlternatives: [{ name: "Panchagavya", benefits: "Organic growth promoter", cost: "Low" }],
    faqs: [
      { q: "Can I use it in Drip irrigation?", a: "Yes, it is 100% water soluble and perfect for fertigation." },
      { q: "Is it better to spray or run through drip?", a: "Both are effective. Spraying provides instant results." },
      { q: "When to use in Paddy?", a: "Spray around 45-50 days after transplanting." },
      { q: "Does it contain micronutrients?", a: "No, it contains only Nitrogen (19%), Phosphorus (19%), and Potassium (19%)." }
    ],
    rating: 4.8
  },
  {
    id: 6,
    name: "Katyayani Activated Humic Acid",
    brand: "Katyayani",
    image: "/fertilisers/rcf-sujala.jpg",
    type: "Organic (Bio-Stimulant)",
    bestCrops: ["Tomato", "Cotton", "Paddy", "Sugarcane"],
    notRecommendedFor: ["Foliar spray during heavy rain"],
    price: { perBag: "₹450", bagSize: "1 kg", perKg: "₹450" },
    prices: [
      { seller: "Katyayani Organics", price: "₹450", rating: 4.7, url: "https://www.bighaat.com/products/katyayani-activated-humic-acid-flakes" },
      { seller: "BigHaat", price: "₹480", rating: 4.6, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Early Vegetative", quantity: "1 kg/acre", method: "Drip / Soil", bestTime: "Anytime" },
    advantages: ["Improves soil structure", "Increases nutrient uptake", "Promotes white roots"],
    disadvantages: ["Not a direct nutrient replacement"],
    organicAlternatives: [{ name: "Compost Tea", benefits: "Adds humic substances", cost: "Low" }],
    faqs: [
      { q: "What does Humic Acid do?", a: "It improves the soil's ability to hold nutrients and water, promoting massive root growth." },
      { q: "Can it be mixed with Urea?", a: "Yes, mixing it with urea reduces nitrogen loss." },
      { q: "Is it suitable for hydroponics?", a: "Yes, 100% water soluble flakes are ideal for hydroponics." },
      { q: "Will it burn my plants?", a: "No, it is a natural organic compound and will not burn plants." }
    ],
    rating: 4.7
  },
  {
    id: 7,
    name: "Mahadhan Smartek 10:26:26",
    brand: "Mahadhan",
    image: "/fertilisers/mahadhan-smartek.jpg",
    type: "Chemical",
    bestCrops: ["Paddy", "Sugarcane", "Tomato", "Cotton"],
    notRecommendedFor: ["Early vegetative stage"],
    price: { perBag: "₹1,470", bagSize: "50 kg", perKg: "₹29.4" },
    prices: [
      { seller: "BigHaat", price: "₹1,470", rating: 4.8, url: "https://www.bighaat.com/collections/fertilizers" },
      { seller: "Local Dealers", price: "₹1,490", rating: 4.5, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Flowering / Fruiting", quantity: "50 kg/acre", method: "Soil application", bestTime: "Mid-stage" },
    advantages: ["High P & K for fruit/grain development", "Smartek coating improves efficiency"],
    disadvantages: ["Low nitrogen"],
    organicAlternatives: [{ name: "Wood Ash", benefits: "Natural potassium", cost: "Almost free" }],
    faqs: [
      { q: "When to apply in Paddy?", a: "Apply during the panicle initiation stage." },
      { q: "What is Smartek technology?", a: "It is a special coating that increases nutrient availability to the roots." },
      { q: "Is it good for Tomatoes?", a: "Yes, excellent for increasing tomato size and weight." },
      { q: "How is it different from normal NPK?", a: "The coating prevents nutrient loss in the soil." }
    ],
    rating: 4.7
  },
  {
    id: 8,
    name: "Coromandel Gromor 28-28-0",
    brand: "Coromandel",
    image: "/fertilisers/gromor-28.jpg",
    type: "Chemical",
    bestCrops: ["Paddy", "Cotton", "Maize"],
    notRecommendedFor: ["Crops needing high potassium"],
    price: { perBag: "₹1,450", bagSize: "50 kg", perKg: "₹29" },
    prices: [
      { seller: "BigHaat", price: "₹1,450", rating: 4.8, url: "https://www.bighaat.com/collections/fertilizers" },
      { seller: "Krishi Seva Kendra", price: "₹1,470", rating: 4.6, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Basal", quantity: "50 kg/acre", method: "Broadcasting", bestTime: "Before sowing" },
    advantages: ["Balanced N & P", "Excellent for root establishment", "Granules are uniform"],
    disadvantages: ["Lacks Potassium (0%)"],
    organicAlternatives: [{ name: "Bone Meal", benefits: "Organic phosphorus", cost: "₹800/25kg" }],
    faqs: [
      { q: "Is it good for basal application?", a: "Yes, it provides strong early growth for Paddy and Cotton." },
      { q: "Does it contain Potassium?", a: "No, the N-P-K ratio is 28-28-0." },
      { q: "Can I use it as a top dressing?", a: "It is best used as basal, but can be top-dressed in early stages." },
      { q: "Will it improve tillering in Paddy?", a: "Yes, the high nitrogen and phosphorus boost tillering." }
    ],
    rating: 4.6
  },
  {
    id: 9,
    name: "YaraMila Complex (12-11-18)",
    brand: "Yara",
    image: "/fertilisers/yaramila.jpg",
    type: "Chemical (Imported)",
    bestCrops: ["Tomato", "Potato", "Chilli"],
    notRecommendedFor: ["Broad acre cereals due to cost"],
    price: { perBag: "₹2,100", bagSize: "25 kg", perKg: "₹84" },
    prices: [
      { seller: "BigHaat", price: "₹2,100", rating: 4.9, url: "https://www.bighaat.com/products/yaramila-complex-fertilizer" },
      { seller: "AgroStar", price: "₹2,050", rating: 4.8, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Vegetative/Fruiting", quantity: "25 kg/acre", method: "Broadcasting", bestTime: "Morning" },
    advantages: ["Premium quality", "Contains SOP, Magnesium & trace elements", "Even prill size"],
    disadvantages: ["Very expensive compared to domestic NPK"],
    organicAlternatives: [{ name: "Seaweed Granules", benefits: "Micronutrients", cost: "₹600/10kg" }],
    faqs: [
      { q: "Why is it so expensive?", a: "It contains highly available forms of NPK, sulfur, magnesium, and micro-nutrients." },
      { q: "Is it good for Tomatoes?", a: "It is considered one of the best premium fertilizers for Tomatoes and high-value vegetables." },
      { q: "Can I spray it?", a: "No, it is a soil-applied prilled fertilizer." },
      { q: "Does it contain chlorides?", a: "No, the potassium source is SOP (Sulphate of Potash), making it chloride-free." }
    ],
    rating: 4.9
  },
  {
    id: 10,
    name: "Aries Agro Chelamin (Zinc EDTA)",
    brand: "Aries Agro",
    image: "/fertilisers/aries-chelamin.jpg",
    type: "Micronutrient",
    bestCrops: ["Tomato", "Citrus", "Paddy", "Cotton"],
    notRecommendedFor: ["General macronutrient needs"],
    price: { perBag: "₹450", bagSize: "500 g", perKg: "₹900" },
    prices: [
      { seller: "BigHaat", price: "₹450", rating: 4.8, url: "https://www.bighaat.com/products/katyayani-zinc-sulphate-33-fertilizer" },
      { seller: "AgroStar", price: "₹460", rating: 4.6, url: "https://www.bighaat.com/products/katyayani-zinc-sulphate-33-fertilizer" },
    ],
    application: { stage: "Vegetative/Fruiting", quantity: "1-2g/liter", method: "Foliar spray", bestTime: "Morning" },
    advantages: ["Cures zinc deficiency rapidly", "Chelated form is easily absorbed", "Mixable with most agrochemicals"],
    disadvantages: ["Expensive per kg"],
    organicAlternatives: [{ name: "No direct organic equivalent", benefits: "N/A", cost: "N/A" }],
    faqs: [
      { q: "What does Chelamin do?", a: "It provides Chelated Zinc (12%), which helps in flowering, fruit setting, and preventing Khaira disease in paddy." },
      { q: "Is it better than Zinc Sulphate?", a: "Yes, being in EDTA chelated form, it is absorbed by the leaves much faster." },
      { q: "Can I mix it with DAP?", a: "Yes, chelated zinc can be mixed with phosphorus fertilizers without reacting." },
      { q: "How many sprays?", a: "Usually 1-2 sprays at 15-day intervals." }
    ],
    rating: 4.6
  },
  {
    id: 11,
    name: "RCF Ujjwala Urea (Neem Coated)",
    brand: "RCF",
    image: "/fertilisers/nagarjuna-urea.jpg",
    type: "Chemical",
    bestCrops: ["Paddy", "Cotton", "Maize", "Sugarcane"],
    notRecommendedFor: ["Fruiting stage of vegetables"],
    price: { perBag: "₹266", bagSize: "45 kg", perKg: "₹5.9" },
    prices: [
      { seller: "Local Krishi Kendra", price: "₹266", rating: 4.7, url: "https://www.bighaat.com/collections/nitrogen-fertilizer" },
      { seller: "BigHaat", price: "₹280", rating: 4.5, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Vegetative", quantity: "45 kg/acre", method: "Broadcasting", bestTime: "Evening" },
    advantages: ["High nitrogen (46%)", "Neem coating slows release", "Affordable"],
    disadvantages: ["Volatilizes if not covered by soil/water"],
    organicAlternatives: [{ name: "Neem Cake", benefits: "Slow release N", cost: "₹400/20kg" }],
    faqs: [
      { q: "Why is it Neem Coated?", a: "The neem coating slows down the release of nitrogen, increasing efficiency and reducing environmental loss." },
      { q: "When to apply to Paddy?", a: "Apply as top dressing during the tillering and panicle initiation stages." },
      { q: "Is the price fixed?", a: "Yes, Urea is heavily subsidized by the government, and the MRP is fixed at ₹266.50 per 45kg bag." },
      { q: "Does it kill pests?", a: "The neem oil provides a very mild repellent effect against certain pests and nematodes." }
    ],
    rating: 4.6
  },
  {
    id: 12,
    name: "YaraLiva Nitrabor",
    brand: "Yara",
    image: "/fertilisers/yaraliva.jpg",
    type: "Chemical",
    bestCrops: ["Tomato", "Chilli", "Capsicum", "Cabbage"],
    notRecommendedFor: ["Cereals (due to high cost)"],
    price: { perBag: "₹1,800", bagSize: "25 kg", perKg: "₹72" },
    prices: [
      { seller: "BigHaat", price: "₹1,800", rating: 4.9, url: "https://www.bighaat.com/collections/fertilizers" },
      { seller: "Amazon", price: "₹1,850", rating: 4.8, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Fruiting", quantity: "25 kg/acre", method: "Broadcasting", bestTime: "Post-flowering" },
    advantages: ["Prevents blossom end rot", "Provides Calcium and Boron", "Improves fruit shelf life"],
    disadvantages: ["Highly hygroscopic (melts in open air)"],
    organicAlternatives: [{ name: "Eggshell powder", benefits: "Organic calcium", cost: "Almost free" }],
    faqs: [
      { q: "Why use Calcium on Tomato?", a: "It prevents blossom end rot (bottom rotting) of the tomatoes and improves firmness." },
      { q: "What does Boron do?", a: "Boron acts alongside calcium to improve cell wall strength and fruit setting." },
      { q: "Can I mix it with Sulphates?", a: "No, never mix Calcium fertilizers with Sulphates or Phosphates, it will precipitate." },
      { q: "How to store it?", a: "Keep the bag tightly sealed; it absorbs moisture from the air very quickly." }
    ],
    rating: 4.9
  },
  {
    id: 13,
    name: "Multiplex Kranti",
    brand: "Multiplex",
    image: "/fertilisers/gromor-14.jpg",
    type: "Micronutrient Mixture",
    bestCrops: ["Paddy", "Cotton", "Tomato", "Mango"],
    notRecommendedFor: ["None"],
    price: { perBag: "₹350", bagSize: "1 Liter", perKg: "₹350" },
    prices: [
      { seller: "BigHaat", price: "₹350", rating: 4.6, url: "https://www.bighaat.com/products/kranti-micronutrient-fertilizer" },
      { seller: "AgroStar", price: "₹360", rating: 4.5, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Vegetative", quantity: "2.5 ml/liter", method: "Foliar Spray", bestTime: "Morning" },
    advantages: ["Contains all essential micronutrients", "Prevents multiple deficiencies", "Liquid form is easily absorbed"],
    disadvantages: ["Requires multiple sprays for full effect"],
    organicAlternatives: [{ name: "Panchagavya", benefits: "Broad spectrum nutrients", cost: "Low" }],
    faqs: [
      { q: "What nutrients does it contain?", a: "It contains Zinc, Iron, Manganese, Copper, Boron, and Molybdenum." },
      { q: "When to spray on Cotton?", a: "Spray once at square formation and again during boll development." },
      { q: "Can it be used in soil?", a: "No, it is specifically formulated for foliar application." },
      { q: "Can I mix it with pesticides?", a: "Yes, it is generally compatible, but always do a jar test first." }
    ],
    rating: 4.5
  },
  {
    id: 14,
    name: "IFFCO WSF 0:52:34 (MKP)",
    brand: "IFFCO",
    image: "/fertilisers/mahadhan-19.jpg",
    type: "Chemical (Water Soluble)",
    bestCrops: ["Tomato", "Cotton", "Grapes", "Pomegranate"],
    notRecommendedFor: ["Early vegetative growth"],
    price: { perBag: "₹180", bagSize: "1 kg", perKg: "₹180" },
    prices: [
      { seller: "IFFCO eBazar", price: "₹180", rating: 4.8, url: "https://www.iffcoebazar.in/en/product/water-soluble-fertilizer-0-52-34" },
      { seller: "BigHaat", price: "₹190", rating: 4.7, url: "https://www.bighaat.com/products/katra-mono-potassium-phosphate-0-52-34" },
    ],
    application: { stage: "Pre-flowering / Fruiting", quantity: "5g/liter", method: "Drip/Spray", bestTime: "Morning" },
    advantages: ["High Phosphorus and Potassium", "Zero Nitrogen", "Enhances fruit color and sugar"],
    disadvantages: ["Expensive for broad acre crops"],
    organicAlternatives: [{ name: "Prom", benefits: "Organic P", cost: "Moderate" }],
    faqs: [
      { q: "Why zero Nitrogen?", a: "During fruiting, excessive nitrogen can cause vegetative growth instead of fruit development." },
      { q: "Can it prevent powdery mildew?", a: "Foliar sprays of MKP have been shown to suppress powdery mildew in some crops." },
      { q: "Is it good for Cotton?", a: "Yes, spray during boll development to increase boll size." },
      { q: "Can I mix it with Calcium Nitrate?", a: "No, it will form insoluble Calcium Phosphate. Keep them separate." }
    ],
    rating: 4.8
  },
  {
    id: 15,
    name: "Anand Agro Dr. Bacto's Pseudomonas",
    brand: "Anand Agro",
    image: "/fertilisers/rcf-sujala.jpg",
    type: "Bio-Fertilizer / Bio-Fungicide",
    bestCrops: ["Paddy", "Tomato", "Chilli", "Cotton"],
    notRecommendedFor: ["Mixing with chemical fungicides"],
    price: { perBag: "₹250", bagSize: "1 Liter", perKg: "₹250" },
    prices: [
      { seller: "BigHaat", price: "₹250", rating: 4.7, url: "https://www.bighaat.com/collections/bio-fungicide" },
      { seller: "Amazon", price: "₹280", rating: 4.6, url: "https://www.bighaat.com/collections/fertilizers" },
    ],
    application: { stage: "Seed treatment / Soil", quantity: "5 ml/liter", method: "Drenching", bestTime: "Evening" },
    advantages: ["100% Organic", "Controls soil borne diseases", "Promotes plant growth"],
    disadvantages: ["Killed by chemical fungicides"],
    organicAlternatives: [{ name: "Trichoderma", benefits: "Similar biocontrol", cost: "Similar" }],
    faqs: [
      { q: "Is it a fertilizer or fungicide?", a: "It is a beneficial bacteria that acts as both a bio-fertilizer and a bio-fungicide." },
      { q: "How to use in Paddy?", a: "Use it for seedling root dip before transplanting to prevent blast and blight." },
      { q: "Can I mix it with chemical fertilizers?", a: "Yes, but NEVER mix it with chemical fungicides or bactericides." },
      { q: "What is the shelf life?", a: "Usually 6-12 months in liquid form. Keep away from direct sunlight." }
    ],
    rating: 4.7
  }
];

export const CROP_FAQS = {
  Paddy: [
    { q: "When is the best time to apply Urea in Paddy?", a: "Apply urea in three splits: 25% at basal (sowing), 50% at active tillering (25-30 days), and 25% at panicle initiation (45-50 days)." },
    { q: "Why are my paddy leaves turning yellow?", a: "Yellowing of lower leaves usually indicates Nitrogen deficiency, while yellowing of upper leaves can be Sulfur or Zinc deficiency. A foliar spray of 19:19:19 or Chelated Zinc can help." },
    { q: "Can I mix weedicides with fertilisers?", a: "It is generally not recommended to mix weedicides with chemical fertilisers like Urea, as it can reduce efficiency and burn the crop." }
  ],
  Cotton: [
    { q: "How to prevent flower and boll drop in Cotton?", a: "Flower drop is often caused by nutrient stress. Spraying NPK 19:19:19 or a Bio-stimulant like Sagarika during square formation helps retain bolls." },
    { q: "Is DAP necessary for Cotton?", a: "Yes, DAP provides the necessary phosphorus for strong root development. It should be applied as a basal dose before or during sowing." },
    { q: "When should I apply potassium?", a: "Potassium is crucial during the boll development stage to improve cotton weight and quality. Use Mahadhan Smartek 10:26:26 or spray 0:52:34." }
  ],
  Tomato: [
    { q: "How do I prevent Blossom End Rot (black bottom) in tomatoes?", a: "Blossom End Rot is caused by Calcium deficiency. Apply Calcium Nitrate (like YaraLiva Nitrabor) during the fruiting stage to prevent it." },
    { q: "Which fertiliser is best for increasing tomato size?", a: "Fertilisers high in Potassium and Phosphorus (like NPK 12:32:16 or water-soluble 0:52:34) significantly increase fruit size and weight." },
    { q: "Can I apply fertilisers through drip irrigation?", a: "Yes, Tomato responds excellently to fertigation. Use 100% water-soluble fertilisers like 19:19:19 for best results." }
  ],
  Default: [
    { q: "What is the difference between basal and top-dressing?", a: "Basal fertilisers are applied to the soil before or during sowing (e.g., DAP, NPK 12:32:16). Top-dressing is applied later during crop growth (e.g., Urea)." },
    { q: "Can I mix chemical and organic fertilisers?", a: "Yes, mixing organic matter (like compost) with chemical fertilisers improves nutrient absorption and prevents soil hardening." },
    { q: "Why is soil testing important?", a: "Soil testing tells you exactly which nutrients your soil lacks, saving you money from over-fertilising and preventing crop burning." }
  ]
};
