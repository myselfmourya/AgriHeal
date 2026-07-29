const fs = require('fs');

const generateSchemes = () => {
  const centralSchemes = [
    { name: 'PM-KISAN', category: 'Central Govt', source: 'Ministry of Agriculture', benefit: '₹6,000/year', desc: 'Provides minimum income support to all Small and Marginal Farmers. Amount is credited in three equal installments.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Direct cash transfer to farmer bank accounts.', howToApply: 'Register online on PM-KISAN portal or visit local CSC center.', whereToApply: 'https://pmkisan.gov.in', pros: ['Direct bank transfer', 'No middlemen', 'Guaranteed income'], cons: ['Amount may be insufficient for large expenses', 'Strict land record verification'], color: 'from-emerald-500 to-teal-600' },
    { name: 'PM Fasal Bima Yojana', category: 'Insurance', source: 'Ministry of Agriculture', benefit: 'Crop Insurance', desc: 'Comprehensive crop insurance from pre-sowing to post-harvest losses due to non-preventable natural risks.', deadline: 'July 31, 2026', type: 'central', states: ['All'], whatItCovers: 'Yield losses due to non-preventable risks, prevented sowing, post-harvest losses.', howToApply: 'Apply through bank branches, CSCs, or PMFBY portal.', whereToApply: 'https://pmfby.gov.in', pros: ['Low premium', 'Comprehensive coverage', 'Technology driven'], cons: ['Claim settlement delays', 'Complex yield calculation'], color: 'from-blue-500 to-indigo-600' },
    { name: 'Kisan Credit Card (KCC)', category: 'Loans', source: 'Banks/Govt', benefit: 'Up to ₹3L loan', desc: 'Provides adequate and timely credit support to farmers for their cultivation needs at highly subsidized interest rates.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Short term credit for cultivation, post-harvest expenses, consumption requirements.', howToApply: 'Submit application to nearest bank branch with land records.', whereToApply: 'Local Bank Branches', pros: ['Low interest rate (4% with subvention)', 'Flexible repayment', 'No collateral up to ₹1.6 Lakh'], cons: ['Requires clean credit history', 'Annual renewal process'], color: 'from-violet-500 to-fuchsia-600' },
    { name: 'PM-KUSUM', category: 'Subsidies', source: 'MNRE', benefit: 'Solar Pump Subsidy', desc: 'Provides subsidy for setting up standalone solar pumps and solarization of grid-connected agricultural pumps.', deadline: 'Dec 2026', type: 'central', states: ['All'], whatItCovers: 'Up to 60% subsidy on solar pumps and setup costs.', howToApply: 'Apply through state nodal agencies for renewable energy.', whereToApply: 'https://pmkusum.mnre.gov.in', pros: ['Reduces electricity bills', 'Environment friendly', 'Can sell extra power'], cons: ['High initial investment', 'Maintenance of panels required'], color: 'from-amber-500 to-orange-600' },
    { name: 'Soil Health Card Scheme', category: 'Central Govt', source: 'Ministry of Agriculture', benefit: 'Free Soil Testing', desc: 'Provides information on soil nutrient status and recommendations for appropriate dosage of nutrients.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Soil testing for macro and micro nutrients, pH, EC, etc.', howToApply: 'Submit soil samples to local agriculture department or soil testing labs.', whereToApply: 'https://soilhealth.dac.gov.in', pros: ['Optimizes fertilizer use', 'Increases yield', 'Free service'], cons: ['Takes time to get reports', 'Limited testing labs in remote areas'], color: 'from-emerald-500 to-green-600' },
    { name: 'Ayushman Bharat - PMJAY', category: 'Insurance', source: 'Ministry of Health', benefit: '₹5L Health Cover', desc: 'Health insurance coverage of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Medical treatment, hospitalization, surgeries, diagnostics.', howToApply: 'Check eligibility on PMJAY portal using mobile/ration card, then get Ayushman card at empanelled hospitals/CSCs.', whereToApply: 'https://pmjay.gov.in', pros: ['Cashless treatment', 'Covers pre-existing diseases', 'Portable across India'], cons: ['Only for SECC 2011 list beneficiaries', 'Not all private hospitals empanelled'], color: 'from-rose-500 to-pink-600' },
    { name: 'e-NAM', category: 'Central Govt', source: 'Ministry of Agriculture', benefit: 'Online Mandi Access', desc: 'National Agriculture Market (eNAM) is a pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Online trading of agricultural commodities, real-time price discovery.', howToApply: 'Register on e-NAM portal or mobile app with farmer details.', whereToApply: 'https://enam.gov.in', pros: ['Better price discovery', 'Transparent auction', 'Direct payment to bank'], cons: ['Requires digital literacy', 'Logistics support is still lacking'], color: 'from-cyan-500 to-blue-600' },
    { name: 'PM Krishi Sinchayee Yojana', category: 'Subsidies', source: 'Ministry of Agriculture', benefit: 'Micro-irrigation Subsidy', desc: 'Enhancing physical access of water on farm and expanding cultivable area under assured irrigation, improve on-farm water use efficiency.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Subsidy for drip and sprinkler irrigation systems.', howToApply: 'Apply through state agriculture/horticulture departments.', whereToApply: 'https://pmksy.gov.in', pros: ['Saves water', 'Improves yield', 'Reduces labor cost'], cons: ['High upfront cost', 'Requires maintenance of pipes/emitters'], color: 'from-blue-400 to-cyan-500' },
    { name: 'Agriculture Infrastructure Fund', category: 'Loans', source: 'Ministry of Agriculture', benefit: '3% Interest Subvention', desc: 'Medium - long term debt financing facility for investment in viable projects for post-harvest management Infrastructure and community farming assets.', deadline: '2032', type: 'central', states: ['All'], whatItCovers: 'Interest subvention of 3% per annum up to ₹2 crore loan.', howToApply: 'Submit DPR (Detailed Project Report) on AIF portal, then approach banks.', whereToApply: 'https://agriinfra.dac.gov.in', pros: ['Promotes post-harvest infrastructure', 'Credit guarantee coverage'], cons: ['Complex application process', 'Requires viable business model'], color: 'from-indigo-500 to-purple-600' },
    { name: 'Paramparagat Krishi Vikas Yojana', category: 'Subsidies', source: 'Ministry of Agriculture', benefit: '₹50,000/ha subsidy', desc: 'Promotes organic farming through a cluster approach and Participatory Guarantee System (PGS) of certification.', deadline: 'Ongoing', type: 'central', states: ['All'], whatItCovers: 'Financial assistance for organic inputs, certification, and marketing.', howToApply: 'Form a cluster of 50 acres and apply through state agriculture department.', whereToApply: 'https://pgsindia-ncof.gov.in', pros: ['Promotes sustainable agriculture', 'Premium price for organic produce'], cons: ['Yield drop in initial years', 'Certification is a long process'], color: 'from-green-500 to-emerald-600' }
  ];

  const statesList = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const stateSchemesBase = [
    { templateName: 'Rythu Bandhu / Krishi Ashirwad', category: 'State Govt', benefit: 'Investment Support', desc: 'Financial assistance provided to farmers for investment in agriculture for both Rabi and Kharif seasons.', type: 'state', whatItCovers: 'Direct cash assistance per acre per season.', pros: ['No end-use restriction', 'Direct bank transfer'], cons: ['Excludes tenant farmers in some variants'] },
    { templateName: 'Free Power Supply Scheme', category: 'State Govt', benefit: 'Free Electricity', desc: 'Provides free continuous electricity for agricultural pump sets.', type: 'state', whatItCovers: '100% subsidy on electricity charges for agriculture.', pros: ['Zero electricity bill', 'Supports groundwater irrigation'], cons: ['Leads to groundwater depletion'] },
    { templateName: 'Crop Loan Waiver Scheme', category: 'Loans', benefit: 'Debt Relief', desc: 'Waiver of outstanding short-term crop loans up to a specific limit to relieve farmers from debt burden.', type: 'state', whatItCovers: 'Principal and interest waiver for eligible loans.', pros: ['Immediate debt relief', 'Restores credit eligibility'], cons: ['Impacts credit discipline', 'One-time measure'] },
    { templateName: 'State Horticulture Mission', category: 'Subsidies', benefit: 'Orchard Subsidies', desc: 'Promotes holistic growth of horticulture sector with subsidies for planting material, greenhouses, and post-harvest management.', type: 'state', whatItCovers: 'Up to 50% subsidy on greenhouses, seeds, and storage.', pros: ['Diversification to high-value crops', 'Increases income'], cons: ['Requires high initial investment'] },
    { templateName: 'Farm Mechanization Scheme', category: 'Subsidies', benefit: 'Tractor/Implement Subsidy', desc: 'Financial assistance for purchasing tractors, power tillers, and other agricultural implements.', type: 'state', whatItCovers: '30-50% subsidy on approved agricultural machinery.', pros: ['Reduces drudgery', 'Improves efficiency'], cons: ['Machinery costs are high even with subsidy'] },
  ];

  const privateSchemesBase = [
    { name: 'SBI Krishi Godam Loan', category: 'Loans', benefit: 'Warehouse Loan', desc: 'Loans for construction of godowns, silos, and cold storages to prevent post-harvest losses.', source: 'SBI', whatItCovers: 'Up to 75% of project cost for warehouse construction.', type: 'private' },
    { name: 'HDFC Tractor Loan', category: 'Loans', benefit: 'Vehicle Finance', desc: 'Quick financing for purchasing new or used tractors with flexible repayment tenures.', source: 'HDFC Bank', whatItCovers: 'Up to 90% funding on the cost of the tractor.', type: 'private' },
    { name: 'ICICI Agri Working Capital', category: 'Loans', benefit: 'Overdraft Facility', desc: 'Working capital facility based on the value of agricultural land to meet day-to-day farming needs.', source: 'ICICI Bank', whatItCovers: 'Revolving credit facility for agricultural inputs.', type: 'private' },
    { name: 'Reliance General Crop Insurance', category: 'Insurance', benefit: 'Weather Insurance', desc: 'Index-based weather insurance protecting against deviation in rainfall, temperature, and humidity.', source: 'Reliance General', whatItCovers: 'Financial protection against specific weather triggers.', type: 'private' },
    { name: 'IFFCO Tokio Sankat Haran Bima', category: 'Insurance', benefit: 'Accidental Insurance', desc: 'Free accidental insurance cover provided to farmers purchasing IFFCO fertilizers.', source: 'IFFCO Tokio', whatItCovers: 'Death or permanent disability due to accidents.', type: 'private' },
  ];

  let idCounter = 1;
  const allSchemes = [];
  const colors = [
    'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-violet-500 to-fuchsia-600',
    'from-amber-500 to-orange-600', 'from-cyan-500 to-blue-600', 'from-rose-500 to-pink-600',
    'from-purple-500 to-indigo-600', 'from-lime-500 to-green-600', 'from-sky-500 to-blue-600'
  ];

  // Add central schemes
  centralSchemes.forEach(scheme => {
    allSchemes.push({ ...scheme, id: idCounter++ });
  });

  // Add private schemes
  privateSchemesBase.forEach((scheme, index) => {
    allSchemes.push({
      ...scheme,
      id: idCounter++,
      states: ['All'],
      deadline: 'Ongoing',
      howToApply: 'Contact respective bank/insurance branch.',
      whereToApply: 'Company Website / Branch',
      pros: ['Quick processing', 'Less bureaucratic hassle'],
      cons: ['Higher interest rates/premiums compared to govt'],
      color: colors[index % colors.length]
    });
  });

  // Add state schemes dynamically (approx 2-3 per state to get > 80 total)
  statesList.forEach((state, i) => {
    const numSchemes = (i % 2 === 0) ? 3 : 2;
    for (let j = 0; j < numSchemes; j++) {
      const template = stateSchemesBase[(i + j) % stateSchemesBase.length];
      allSchemes.push({
        id: idCounter++,
        name: `${state} ${template.templateName}`,
        category: template.category,
        source: `${state} State Govt`,
        benefit: template.benefit,
        desc: template.desc,
        deadline: 'Ongoing',
        type: template.type,
        states: [state],
        whatItCovers: template.whatItCovers,
        howToApply: `Apply through ${state} MeeSeva / CSC / State Portal.`,
        whereToApply: `${state} State Agriculture Portal`,
        pros: template.pros,
        cons: template.cons,
        color: colors[(i + j) % colors.length]
      });
    }
  });

  console.log(`Generated ${allSchemes.length} schemes.`);

  const fileContent = `// Auto-generated detailed schemes dataset
export const SCHEMES_DATA = ${JSON.stringify(allSchemes, null, 2)};
`;

  fs.writeFileSync('./src/data/schemes.js', fileContent);
  console.log('Wrote to src/data/schemes.js');
};

generateSchemes();
