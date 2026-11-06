/**
 * AgroFly - Main Application Script
 * Precision Agricultural Drone Spraying Service Multipage Website
 */
(() => {
  'use strict';

  // Helper selector shortcuts
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROOT = document.body.dataset.root || '';
  const PAGE = document.body.dataset.page || '';

  const formatINR = (n) => '\u20B9' + Math.round(n).toLocaleString('en-IN');
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // Curated High-Definition Agricultural Photography Asset Pool
  const IMAGE_POOL = [
    "1500382017468-9049fed747ef", // Green farm aerial
    "1625246333195-78d9c38ad449", // Farmer & drone in field
    "1574943320219-553eb213f72d", // Crop protection
    "1560493676-04071c5f467b", // Paddy field
    "1592982537447-7440770cbfc9", // Cotton farm
    "1473448912268-2022ce9509d8", // Sugarcane & crops
    "1464226184884-fa280b87c399", // Precision spraying
    "1530836369250-ef72a3f5cda8", // Modern agricultural drone
    "1500937386664-56d1dfef3854", // Farmland landscape
    "1495107334309-fcf20504a5ab", // Sunset field
    "1523348837708-15d4a09cfac2", // Agronomist
    "1416879595882-3373a0480b5b", // Large acreage fields
    "1586771107445-d3ca888129ff", // Precision equipment
    "1471193945509-9ad0617afabf", // Drone rotors & tank
    "1444858291040-58f756a3bdd6", // Field canopy
    "1508614589041-895b88991e3e", // Sprayed foliage & nutrition
    "1508615039623-a25605d2b022", // Irrigation & spraying
    "1507003211169-0a1dd7228f2d", // Pilot Arun
    "1573496359142-b8d87734a5a2", // Agronomist Meena
    "1472099645785-5658abf4ff4e", // Pilot Karthik
    "1494790108377-be9c29b29330", // Operations Divya
    "1488521787991-ed7bbaae773c", // Smart farming
    "1470058869958-2a77ade41c02"  // Aerial panorama
  ];

  const getImgUrl = (index, width = 800) => {
    const id = IMAGE_POOL[Math.abs(index) % IMAGE_POOL.length];
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
  };

  // Robust SVG Fallback generator (prevents broken image boxes)
  const generateFallbackSVG = (hue = 135) => {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hue}, 55%, 26%)"/>
            <stop offset="100%" stop-color="hsl(${hue + 25}, 60%, 42%)"/>
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#g)"/>
        <g fill="#ffffff" opacity="0.9" transform="translate(360, 180) scale(1.6)">
          <circle cx="25" cy="25" r="7"/>
          <path d="M8 25h34M25 8v34" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          <circle cx="8" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
          <circle cx="42" cy="8" r="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
          <circle cx="8" cy="42" r="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
          <circle cx="42" cy="42" r="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
        </g>
        <text x="400" y="325" font-size="28" fill="#ffffff" font-family="sans-serif" font-weight="bold" text-anchor="middle" opacity="0.9">AGROFLY PRECISION</text>
      </svg>
    `);
  };

  const fixImage = (img) => {
    if (!img.dataset.f) {
      img.dataset.f = '1';
      img.src = generateFallbackSVG(120 + Math.floor(Math.random() * 40));
    }
  };

  // Listen for image load errors and fallback automatically
  window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') {
      fixImage(e.target);
    }
  }, true);

  window.addEventListener('load', () => {
    $$('img').forEach(img => {
      if (img.complete && !img.naturalWidth) {
        fixImage(img);
      }
    });
  });

  // UI Toast and Modal
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toastx';
    toast.innerHTML = `<i class="bi bi-info-circle me-2"></i> ${escapeHTML(message)}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  };

  const showModal = (title, bodyHtml, footerHtml = '') => {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content shadow-lg">
          <div class="modal-header border-bottom">
            <h5 class="modal-title font-weight-bold">${escapeHTML(title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">${bodyHtml}</div>
          ${footerHtml ? `<div class="modal-footer border-top">${footerHtml}</div>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);
    const bsModal = new bootstrap.Modal(modalEl);
    modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
    bsModal.show();
    return { el: modalEl, modal: bsModal };
  };

  // Expose UI helpers globally
  window.AgroUI = {
    showToast,
    showModal,
    formatINR,
    escapeHTML,
    getImgUrl
  };

  // 1. Data Definitions
  const SERVICES = [
    {
      id: 0,
      slug: 'paddy',
      t: 'Paddy Drone Spraying',
      c: 'Paddy & Rice',
      cov: '30 – 35 Acres/day',
      rate: 450,
      imgUrl: `${ROOT}assets/img/services/paddy-drone-spraying.jpg`,
      d: 'Specialised ultra-low-volume flight paths for waterlogged paddy fields without soil compaction or crop trampling.',
      b: ['Zero plant trampling or mud tracking', 'Controls blast, sheath blight & BPH', '90% water saving with micron droplet spray'],
      crops: ['Paddy', 'Basmati Rice', 'Non-Basmati Varieties', 'Sona Masuri'],
      ov: 'Paddy farmers lose 5 ? 10% of yield to tractor tyre tracks and manual foot-trampling in standing water. AgroFly drones hover 2 metres above the canopy, delivering uniform micron-atomized protection across every square foot.',
      img: 5
    },
    {
      id: 1,
      slug: 'cotton',
      t: 'Cotton Drone Spraying',
      c: 'Commercial Fiber',
      cov: '25 – 30 Acres/day',
      rate: 480,
      imgUrl: `${ROOT}assets/img/services/cotton-drone-spraying.jpg`,
      d: 'High-downwash penetrating spray for dense cotton canopies targeting bollworm, whitefly, and sucking pests.',
      b: ['Downwash turbulence flips leaves to reach pests', 'Complete bollworm and aphid eradication', 'Fast 6-minute coverage per acre'],
      crops: ['Hybrid Cotton', 'Bt Cotton', 'Desi Cotton', 'Long-Staple Cotton'],
      ov: 'Sucking pests like aphids, thrips, and whiteflies shelter under broad cotton leaves. AgroFly multirotor downwash flips the canopy in real time, guaranteeing 360-degree foliar coating on both upper and lower leaf surfaces.',
      img: 12
    },
    {
      id: 2,
      slug: 'sugarcane',
      t: 'Sugarcane Drone Spraying',
      c: 'Tall Canopies',
      cov: '20 – 25 Acres/day',
      rate: 550,
      imgUrl: `${ROOT}assets/img/services/sugarcane-drone-spraying.jpg`,
      d: 'Safe overhead aerial spraying for 10-foot tall mature sugarcane plantations where ground labour cannot safely enter.',
      b: ['Safely sprays dense 10-ft mature cane', 'Internode and top-borer prevention', 'Eliminates hazardous manual field walking'],
      crops: ['Ratoon Cane', 'Early Plant Cane', 'Late Crop Cane', 'Cooperative Command Plots'],
      ov: 'Entering dense, mature sugarcane carries severe health risks from sharp foliage and reptile encounters. Our drones navigate tall canopies with obstacle radar, dispensing micro-droplets directly onto vulnerable shoot joints.',
      img: 13
    },
    {
      id: 3,
      slug: 'maize',
      t: 'Maize Drone Spraying',
      c: 'Cereal Crops',
      cov: '30 – 35 Acres/day',
      rate: 460,
      imgUrl: `${ROOT}assets/img/services/maize-drone-spraying.jpg`,
      d: 'Fall Armyworm (FAW) whorl-directed spraying and foliar zinc/nitrogen nutrition for fast-growing maize fields.',
      b: ['Deep vortex penetrates corn whorls', 'Fall Armyworm eradication at early stages', 'Even foliar zinc and boron application'],
      crops: ['Sweet Corn', 'Field Maize', 'Fodder Corn', 'Baby Corn'],
      ov: 'Fall Armyworm bores into the central whorl where tractor nozzles cannot easily reach. AgroFly rotary atomizers generate high-velocity downdrafts that force active ingredients straight into leaf whorls for rapid knockdown.',
      img: 14
    },
    {
      id: 4,
      slug: 'groundnut',
      t: 'Groundnut Drone Spraying',
      c: 'Oilseeds & Pulses',
      cov: '25 – 30 Acres/day',
      rate: 450,
      imgUrl: `${ROOT}assets/img/services/groundnut-drone-spraying.jpg`,
      d: 'Uniform ground-level fungicide dispersion for Tikka leaf spot and collar rot prevention in oilseed crops.',
      b: ['Complete low-canopy foliar coverage', 'Effective control of Tikka leaf spot', 'Preserves soil structure and delicate pegging'],
      crops: ['Groundnut (Peanut)', 'Soybean', 'Blackgram', 'Greengram', 'Cowpea'],
      ov: 'Groundnut requires uniform coverage close to the soil surface without disturbing tender pegging zones. Our RTK-guided drones maintain steady altitude ceilings, preventing collar rot and defoliation diseases.',
      img: 2
    },
    {
      id: 5,
      slug: 'vegetable',
      t: 'Vegetable Crop Spraying',
      c: 'Horticulture',
      cov: '18 – 22 Acres/day',
      rate: 520,
      imgUrl: `${ROOT}assets/img/services/vegetable-drone-spraying.jpg`,
      d: 'Precision micro-droplet misting for high-value vegetables, orchards, and trellised crops with zero drift.',
      b: ['Trellis & staked crop compatibility', 'Drift reduction buffers adjacent plots', 'Prevents fruit blemishes and scorch marks'],
      crops: ['Tomato', 'Chilli', 'Brinjal', 'Onion', 'Okra', 'Capsicum', 'Cabbage'],
      ov: 'Horticultural produce demands spotless quality without residue burn. AgroFly variable-rate nozzles tune droplet sizes between 90 and 140 microns, eliminating blight and fruit borers while saving valuable inputs.',
      img: 15
    },
    {
      id: 6,
      slug: 'fertilizer',
      t: 'Fertilizer Spraying',
      c: 'Foliar Nutrition',
      cov: '35 – 45 Acres/day',
      rate: 500,
      imgUrl: `${ROOT}assets/img/services/fertilizer-drone-spraying.jpg`,
      d: 'Water-soluble NPK, nano-urea, bio-stimulants, and micronutrient spraying for accelerated foliar absorption.',
      b: ['Direct nutrient uptake via leaf stomata', 'Cuts chemical run-off and leaching by 30%', 'Rapid canopy greening in 48 hours'],
      crops: ['Paddy', 'Sugarcane', 'Cotton', 'Millets', 'Orchards', 'All Field Crops'],
      ov: 'Deliver chelated zinc, boron, soluble potash, and nano-fertilizers directly to active stomata. Rotor downdrafts evenly disperse nutrition on both upper and lower leaf surfaces for maximum assimilation.',
      img: 1
    },
    {
      id: 7,
      slug: 'large-acreage',
      t: 'Large Acreage Drone Spraying',
      c: 'Enterprise & FPO',
      cov: 'Up to 100+ Acres/day',
      rate: 420,
      imgUrl: `${ROOT}assets/img/services/large-acreage-drone-spraying.jpg`,
      d: 'Multi-drone fleet mobilization with dedicated mobile charging units for corporate estates and Farmer Producer Organizations.',
      b: ['Tiered bulk acreage discounts', 'Multiple coordinated drone teams', 'Comprehensive digital GIS spray audit'],
      crops: ['Large Estates', 'FPO Clusters', 'Corporate Farmlands', 'Sugar Mill Command Areas'],
      ov: 'Designed specifically for FPOs, cooperative clusters, and estate holdings. We mobilize synchronized pilot crews equipped with mobile generators and digital batch mixing stations for high daily acreage throughput.',
      img: 8
    },
    {
      id: 8,
      slug: 'mustard',
      t: 'Mustard Drone Spraying',
      c: 'Oilseeds & Mustard',
      cov: '28 – 32 Acres/day',
      rate: 480,
      imgUrl: `${ROOT}assets/img/services/mustard-drone-spraying.jpg`,
      d: 'Contactless aerial canopy spraying protecting fragile flowering branches from damage while eradicating aphids and Alternaria blight.',
      b: ['Zero branch snapping in flowering crops', 'Complete aphid and blight knockout', 'Ultra-uniform micron spray over blossoms'],
      crops: ['Yellow Mustard', 'Black Mustard (Rai)', 'Canola', 'Toria', 'Sunflower'],
      ov: 'Mustard crops develop brittle flowering branches reaching 4 to 6 feet in height. Conventional backpack sprayers or tractor equipment snap branches, knock off flowering buds, and trample up to 15% of the total harvest. AgroFly drones hover safely above the flowering canopy, delivering uniform micron-atomized protection without physical contact.',
      img: 16
    },
    {
      id: 9,
      slug: 'wheat',
      t: 'Wheat & Cereal Spraying',
      c: 'Cereal Crops',
      cov: '28 – 32 Acres/day',
      rate: 470,
      imgUrl: `${ROOT}assets/img/services/wheat-drone-spraying.jpg`,
      d: 'Broadacre canopy penetration for yellow rust, powdery mildew, and liquid foliar urea nutrition with zero soil compaction.',
      b: ['100% rust & blight canopy coverage', '28 – 32 Acres / day throughput', 'Zero wheel rutting or plant crushing'],
      crops: ['Durum Wheat', 'Sharbati Wheat', 'Barley', 'Oats', 'Rye'],
      ov: 'Wheat crops require rapid timely fungicide application during flag-leaf emergence. AgroFly drones provide precision misting that blankets the entire upper and middle canopy, eradicating stripe rust without tracking muddy wheel ruts across rainfed fields.',
      img: 17
    },
    {
      id: 10,
      slug: 'soybean',
      t: 'Soybean & Pulses Spraying',
      c: 'Oilseeds & Pulses',
      cov: '26 – 30 Acres/day',
      rate: 460,
      imgUrl: `${ROOT}assets/img/services/soybean-drone-spraying.jpg`,
      d: 'Rotary atomized mist targeting pod borers, semiloopers, and anthracnose through dense multi-branching legume canopies.',
      b: ['Deep canopy vortex penetration', 'Effective pod borer suppression', '90% water saving over flood spray'],
      crops: ['Soybean', 'Chickpea', 'Blackgram', 'Pigeon Pea', 'Cowpea'],
      ov: 'Dense legume canopies hide destructive pod borers deep underneath outer foliage. AgroFly rotor downwash creates a turbulent microclimate that turns leaves over, coating undersides and lower stem junctions for complete systemic pest control.',
      img: 18
    },
    {
      id: 11,
      slug: 'plantation',
      t: 'Plantation & Spices Spraying',
      c: 'Horticulture',
      cov: '22 – 26 Acres/day',
      rate: 540,
      imgUrl: `${ROOT}assets/img/services/plantation-drone-spraying.jpg`,
      d: 'Autonomous 3D terrain-following aerial spray for undulating hilly plantations and high-density commercial cash crops.',
      b: ['3D contour terrain-following radar', 'Thorough thrips & mite eradication', 'Reaches steep terraced acreage'],
      crops: ['Chilli', 'Turmeric', 'Ginger', 'Cardamom', 'Tea', 'Coffee'],
      ov: 'Commercial plantations and spice gardens often span sloped terraced terrain where manual spraying is slow, exhausting, and hazardous. AgroFly autonomous obstacle-avoidance and millimetre-wave ground-tracking radar ensure uniform spray height across complex inclines.',
      img: 19
    }
  ];

  const BLOG_POSTS = [
    {
      id: 0,
      t: 'Precision Agriculture: The Next Smart Farming Revolution',
      c: 'Precision Agriculture',
      a: 'Arun Prakash',
      date: '2026-10-18',
      rt: 6,
      ex: 'How RTK GPS, satellite mapping, and autonomous flight routes are helping Indian growers achieve record yields.',
      p1: 'Precision agriculture replaces guesswork with actionable geospatial data. By integrating centimetre-level Real-Time Kinematic (RTK) positioning with multispectral vegetation indices (NDVI), growers can identify crop stress long before physical symptoms appear to the naked eye.',
      p2: 'At AgroFly, our drones follow autonomous waypoint paths programmed down to 2-centimetre accuracy. This guarantees that not a single square metre of crop is skipped or double-sprayed, eliminating wasted chemicals and safeguarding crop safety.',
      imgUrl: `${ROOT}assets/img/blog-precision-agriculture.jpg`,
      img: 7
    },
    {
      id: 1,
      t: 'Benefits of Agricultural Drone Spraying in Modern Farming',
      c: 'Drone Spraying',
      a: 'Meena Krishnan',
      date: '2026-10-14',
      rt: 5,
      ex: 'Drones spray an acre in under 6 minutes, conserve 90% water, and eliminate dangerous worker pesticide contact.',
      p1: 'Agricultural drone spraying is transforming Indian farming economics. Traditional knapsack sprayers require 150 to 200 litres of water per acre and expose farm labourers to toxic chemical vapor for hours. In stark contrast, modern agricultural drones use ultra-low volume (ULV) rotary atomisers that require only 10 to 16 litres of water per acre.',
      p2: 'Because certified drone pilots pilot from field borders using RTK-linked handheld ground stations, farmers and workers never breathe in hazardous mist. Furthermore, the rotor downdraft drives droplets deep into the crop canopy, ensuring up to 35% better chemical efficiency compared to manual methods.',
      imgUrl: `${ROOT}assets/img/blog-drone-spraying.jpg`,
      img: 4
    },
    {
      id: 2,
      t: 'Paddy Crop Protection: Overcoming Waterlogging and Blast Disease',
      c: 'Crop Protection',
      a: 'Meena Krishnan',
      date: '2026-10-10',
      rt: 7,
      ex: 'Eliminating tractor ruts and manual footsteps in flooded paddy fields during the critical tillering phase.',
      p1: 'Flooded paddy fields present severe logistical challenges for conventional spraying equipment. Heavy tractor tires sink into mud, churning roots and causing severe soil hardpan damage. Manual labourers struggle through knee-deep mud, inevitably trampling healthy stems.',
      p2: 'Drone spraying flies above standing water with zero ground disturbance. Research across Tamil Nadu and Andhra Pradesh shows that eliminating field trampling alone boosts harvest yield by 5% to 8% per acre.',
      imgUrl: `${ROOT}assets/img/blog-paddy-protection.jpg`,
      img: 5
    },
    {
      id: 3,
      t: 'Advanced Cotton Farming: Eradicating Whiteflies and Bollworms',
      c: 'Crop Protection',
      a: 'Karthik Raja',
      date: '2026-10-06',
      rt: 5,
      ex: 'Using multirotor propeller downwash to flip cotton leaves and coat pests sheltering on lower leaf surfaces.',
      p1: 'Sucking pests like aphids, thrips, and whiteflies hide under broad cotton leaves, rendering tractor booms and manual nozzles ineffective. Left unchecked, pink bollworm infestations trigger massive square drop and fiber discolouration.',
      p2: 'AgroFly multirotor downdraft creates controlled air turbulence directly within the cotton canopy, flipping foliage mid-flight to ensure both upper and lower leaf surfaces receive a fine, uniform coat of pesticide.',
      imgUrl: `${ROOT}assets/img/blog-cotton-farming.jpg`,
      img: 12
    },
    {
      id: 4,
      t: 'Smart Fertilizer Application: Maximizing Foliar Nutrient Assimilation',
      c: 'Crop Nutrition',
      a: 'Divya Lakshmi',
      date: '2026-10-02',
      rt: 5,
      ex: 'Applying water-soluble NPK, nano-urea, and micro-chelates directly to crop stomata for rapid vegetative growth.',
      p1: 'Soil-applied fertilizers often suffer massive losses from leaching, volatilization, and fixation in alkaline soils. Foliar feeding with drones directly delivers water-soluble nutrients through leaf stomata, achieving 90% absorption within hours.',
      p2: 'AgroFly micro-droplet atomizers generate uniform 120-micron droplets that adhere to the foliage without rolling off into the soil, saving farmers money while preventing groundwater nitrate contamination.',
      imgUrl: `${ROOT}assets/img/crop-nutrition.jpg`,
      img: 15
    },
    {
      id: 5,
      t: 'Sustainable Agriculture: Slashing Chemical Run-Off with Micro-Droplets',
      c: 'Sustainable Farming',
      a: 'Arun Prakash',
      date: '2026-09-28',
      rt: 6,
      ex: 'Promoting soil biology and preserving beneficial predatory insects through targeted micro-droplet spraying.',
      p1: 'Excess chemical runoff into local irrigation canals and village ponds is one of the greatest ecological threats facing rural communities. Traditional flood spraying dumps excess chemicals that soak into the ground.',
      p2: 'Precision drone spraying delivers only the exact biological or chemical dosage required on the crop canopy. By reducing overall chemical consumption by 25 ? 35%, drones protect bees, soil microorganisms, and beneficial predators.',
      imgUrl: `${ROOT}assets/img/blog-sustainable-farming.jpg`,
      img: 9
    },
    {
      id: 6,
      t: 'Modern Farming Technology: RTK GPS and Autonomous Flight Systems',
      c: 'Precision Agriculture',
      a: 'Karthik Raja',
      date: '2026-09-24',
      rt: 6,
      ex: 'Centimetre-accurate field boundary mapping and automated variable-rate spraying without ground compaction.',
      p1: 'Commercial drone spraying relies on centimetre-accurate GNSS/RTK base stations. Obstacle-avoidance millimeter-wave radar continuously scans the flight corridor for power lines, trees, and field bunds.',
      p2: 'Pilots program automated perimeter boundaries on high-brightness ground control displays, ensuring 100% boundary fidelity with zero drift into adjacent sensitive crops or water channels.',
      imgUrl: `${ROOT}assets/img/blog-rtk-technology.jpg`,
      img: 8
    },
    {
      id: 7,
      t: 'Drone-Based Pest Control: Rapid 24-Hour Outbreak Response',
      c: 'Crop Protection',
      a: 'Meena Krishnan',
      date: '2026-09-18',
      rt: 4,
      ex: 'Halting Fall Armyworm and Brown Planthopper devastation within 24 hours with emergency drone fleet mobilization.',
      p1: 'During severe pest infestations such as Spodoptera frugiperda (fall armyworm) or brown planthopper, delay is fatal. A pest population can double within 48 hours, decimating whole fields before manual sprayers can even be mobilized.',
      p2: 'With AgroFly”™s fast online booking and mobile drone fleet, farmers can schedule an emergency spray on the exact day of detection. A 20-acre farm that would take three labourers two days to spray is completed by a single drone in less than two hours.',
      imgUrl: `${ROOT}assets/img/blog-pest-control.jpg`,
      img: 0
    },
    {
      id: 8,
      t: 'Crop Health Monitoring: Multispectral NDVI Canopy Diagnostics',
      c: 'Precision Agriculture',
      a: 'Divya Lakshmi',
      date: '2026-09-12',
      rt: 5,
      ex: 'Detecting nitrogen deficiency, water stress, and pathogen hotspots days before symptoms appear to the naked eye.',
      p1: 'Normalized Difference Vegetation Index (NDVI) mapping captures reflected near-infrared and red light bands from living plant canopies. Vigorous leaves with dense chlorophyll reflect significantly more infrared energy.',
      p2: 'By translating drone multispectral data into digital prescription maps, farmers can spot-spray only distressed sections rather than wasting chemicals treating the entire 50-acre block.',
      imgUrl: `${ROOT}assets/img/blog-crop-health.jpg`,
      img: 1
    },
    {
      id: 9,
      t: 'Boosting Agricultural Productivity: Acreage Maximization for Smallholders',
      c: 'Drone Spraying',
      a: 'Arun Prakash',
      date: '2026-09-06',
      rt: 6,
      ex: 'How smallholder farmer cooperatives and FPOs consolidate acreage to access industrial-grade aerial spraying.',
      p1: 'In India, over 80% of farming households cultivate smallholdings under two hectares. Historically, advanced machinery was financially out of reach for individual smallholders.',
      p2: 'Through Farmer Producer Organizations (FPOs) and AgroFly”™s community cluster booking, contiguous smallholder plots are mapped as a single mission, providing smallholders with corporate-scale precision at affordable per-acre rates.',
      imgUrl: `${ROOT}assets/img/blog-productivity.jpg`,
      img: 2
    },
    {
      id: 10,
      t: 'Smart Irrigation & Water Conservation in Drone Agriculture',
      c: 'Sustainable Farming',
      a: 'Meena Krishnan',
      date: '2026-08-30',
      rt: 5,
      ex: 'Reducing agricultural spraying water usage from 200 litres to just 10 litres per acre through rotary atomization.',
      p1: 'Water scarcity is a critical bottleneck in semi-arid agrarian belts. Hauling hundreds of litres of clean water to remote fields often consumes more labour and diesel than the spraying itself.',
      p2: 'AgroFly ultra-low-volume atomization atomizes spray liquids into uniform droplets between 80 and 150 microns, requiring just 8 to 12 litres of carrier water per acre and conserving up to 90% of local water supplies.',
      imgUrl: `${ROOT}assets/img/blog-water-conservation.jpg`,
      img: 10
    },
    {
      id: 11,
      t: 'The Future of Agricultural Drones: AI Edge Vision and Swarm Operations',
      c: 'Precision Agriculture',
      a: 'Karthik Raja',
      date: '2026-08-22',
      rt: 6,
      ex: 'Autonomous swarms, real-time edge AI pest detection, and autonomous battery swap stations.',
      p1: 'The next frontier in precision agriculture is autonomous drone swarming. Multiple 40-litre drones communicate via mesh networks, dividing a 500-acre estate into optimized flight sectors and completing whole-estate treatments before noon.',
      p2: 'Onboard edge AI processors analyze optical camera feeds at 60 frames per second, identifying individual weeds and activating single solenoid nozzles to spot-apply herbicide only where weeds exist, cutting herbicide use by up to 80%.',
      imgUrl: `${ROOT}assets/img/blog-future-drones.jpg`,
      img: 14
    }
  ];

  const PACKAGES = [
    {
      name: 'Basic Package',
      target: 'Suitable for small farms A up to 5 acres',
      price: 1800,
      features: [
        'Coverage for up to 5 acres',
        'Standard pesticide or fertilizer spray',
        'Standard 48-hr scheduling',
        'Digital job confirmation',
        'DGCA-certified drone pilot'
      ],
      popular: false
    },
    {
      name: 'Standard Package',
      target: 'Suitable for medium farms A up to 15 acres',
      price: 4900,
      features: [
        'Coverage for up to 15 acres',
        'Precision variable-rate spraying',
        'Priority 24-hr scheduling window',
        'Pre-spray boundary mapping',
        'Post-spray acreage & coverage report',
        'Agronomist chemical ratio guidance'
      ],
      popular: true
    },
    {
      name: 'Premium Package',
      target: 'Suitable for large farms A 15+ acres',
      price: 9900,
      features: [
        'Coverage for 15+ acres (scalable)',
        'Full customized multi-crop spraying',
        'Guaranteed same-day emergency dispatch',
        'Dedicated multi-drone pilot team',
        'Comprehensive GPS & NDVI flight audit',
        'Dedicated agronomist phone support'
      ],
      popular: false
    }
  ];

  const TESTIMONIALS = [
    {
      name: 'Murugan S.',
      role: 'Paddy Farmer, Thanjavur (12 Acres)',
      text: 'Spraying 10 acres of paddy used to take three labourers two full days in the mud. AgroFly finished the entire field in one morning. My crop has zero blast disease this season and I saved &#8377;3,500 on chemicals.',
      img: 17
    },
    {
      name: 'Lakshmi P.',
      role: 'Cotton Grower, Erode (8 Acres)',
      text: 'The downwash from the drone flipped the cotton leaves and eradicated bollworms that manual sprayers always missed. Booking from the Farmer Dashboard took me under two minutes.',
      img: 18
    },
    {
      name: 'Ravi K.',
      role: 'Sugarcane Farmer, Salem (25 Acres)',
      text: 'Our sugarcane stands 3 metres tall. Finding workers willing to carry heavy sprayers into the dense crop was impossible. AgroFly handled the whole plantation safely without damaging a single cane.',
      img: 19
    }
  ];

  const FAQS = {
    general: [
      ['Is drone spraying safe for all crops ? ', 'Yes. AgroFly uses calibrated atomizing rotary nozzles with controlled droplet sizing (80 ? 150 microns). This ensures uniform coverage without chemical scorching or excessive drift.'],
      ['Which crops can you spray with drones ? ', 'We routinely spray Paddy, Cotton, Sugarcane, Maize, Groundnut, Pulses, Chilly, Turmeric, Banana, and various vegetable and fruit orchards.'],
      ['How quickly can you arrive at my farm after booking ? ', 'Most standard bookings are dispatched within 24 to 48 hours. Emergency pest-outbreak requests can be scheduled for same-day or next-morning dispatch subject to pilot availability.'],
      ['Do farmers need to provide water and chemicals ? ', 'Yes, farmers supply their preferred agronomy-approved chemicals and clean water. Our certified team brings the drone, batteries, portable charging generators, and digital mixing stations.'],
      ['What weather conditions prevent drone flights ? ', 'For safety and spray efficacy, drones do not operate during heavy rainfall or high wind speeds exceeding 18 km/h. If weather delays a flight, we reschedule to the next calm window immediately.']
    ],
    pricing: [
      ['Are the prices listed on this website final ? ', 'Prices shown are illustrative standard packages for demonstration. Final pricing depends on exact acreage, terrain, chemical volume, and travel distance.'],
      ['Is there a minimum acreage requirement for booking ? ', 'Our single-booking minimum is 1 acre. For smaller plots, we recommend grouping with adjacent farmers to share the minimum operational fee.'],
      ['Does the booking estimate include GST ? ', 'Yes, all estimated totals generated in our online booking tool and dashboard include 5% GST applicable to agricultural machinery services.'],
      ['Can I cancel or reschedule my spraying booking ? ', 'Yes, you can cancel or change your booking date from your Farmer Dashboard up to 12 hours prior to the scheduled slot with zero penalty.']
    ]
  };

  // Expose Data
  window.AgroData = {
    services: SERVICES,
    blog: BLOG_POSTS,
    packages: PACKAGES,
    testimonials: TESTIMONIALS,
    faqs: FAQS
  };

  // 2. Renderers
  const renderServiceCard = (s) => `
    <div class="col-md-6 col-lg-4" data-cat="${escapeHTML(s.c)}">
      <div class="svc reveal h-100 d-flex flex-column">
        <div class="im position-relative overflow-hidden" style="border-radius: 16px 16px 0 0;">
          <img loading="lazy" src="${s.imgUrl || getImgUrl(s.img)}" alt="${escapeHTML(s.t)}" style="object-fit: cover; width: 100%; height: 220px; transition: transform 0.35s ease;">
          <span class="badge-c position-absolute top-3 start-3 m-3">${escapeHTML(s.c)}</span>
        </div>
        <div class="bd d-flex flex-column flex-grow-1 p-3 pt-2.5">
          <h5 class="fw-bold mb-2">${escapeHTML(s.t)}</h5>
          <div class="svc-meta mb-2 d-flex flex-wrap gap-2">
            <span class="badge bg-light text-success border"><i class="bi bi-speedometer2 me-1"></i>${escapeHTML(s.cov || '25 – 30 Acres/day')}</span>
            <span class="badge bg-light text-dark border"><i class="bi bi-tag me-1"></i>${formatINR(s.rate)}/acre</span>
          </div>
          <p class="text-muted small mb-2"><strong>Suitable Crops:</strong> ${escapeHTML(Array.isArray(s.crops) ? s.crops.join(', ') : s.crops)}</p>
          <p class="mb-3 text-secondary flex-grow-1">${escapeHTML(s.d)}</p>
          <div class="mb-3">
            <strong class="d-block small text-dark mb-1">Key Spraying Benefits:</strong>
            <ul class="list-unstyled mb-0 small text-muted">
              ${s.b.map(item => `<li class="d-flex align-items-center mb-1"><i class="bi bi-check-circle-fill text-success me-2"></i>${escapeHTML(item)}</li>`).join('')}
            </ul>
          </div>
          <div class="svc-actions d-flex gap-2 mt-auto pt-3 border-top">
            <a class="btn btn-agro btn-sm flex-fill fw-semibold text-center" href="${ROOT}dashboard/book-spraying.html ? service=${encodeURIComponent(s.t)}&crop=${encodeURIComponent(s.crops[0] || 'Crop')}">
              <i class="bi bi-calendar-check me-1"></i>Book Now
            </a>
            <a class="btn btn-outline-agro btn-sm flex-fill fw-semibold text-center" href="${ROOT}service-details.html?s=${s.id}">
              <i class="bi bi-info-circle me-1"></i>View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  const renderBlogCard = (b) => {
    const formattedDate = new Date(b.date + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    return `
      <div class="col-md-6 col-lg-4">
        <article class="bcard card-lift h-100 reveal">
          <a class="th" href="${ROOT}blog-details.html?id=${b.id}">
            <img loading="lazy" src="${b.imgUrl || getImgUrl(b.img, 650)}" alt="${escapeHTML(b.t)}">
            <span class="chip">${escapeHTML(b.c)}</span>
          </a>
          <div class="bd d-flex flex-column flex-grow-1 p-3 pt-2.5">
            <div class="meta mb-1">
              <span><i class="bi bi-clock me-1 text-agro"></i>${b.rt} min read</span>
              <span class="mx-1 text-muted">&bull;</span>
              <span><i class="bi bi-calendar3 me-1 text-agro"></i>${formattedDate}</span>
            </div>
            <h5><a href="${ROOT}blog-details.html?id=${b.id}">${escapeHTML(b.t)}</a></h5>
            <p class="muted">${escapeHTML(b.ex)}</p>
            <a class="rm mt-auto" href="${ROOT}blog-details.html?id=${b.id}">
              <span>Read Article</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </article>
      </div>
    `;
  };

  const renderPackageCard = (p, mode = 'once') => {
    const calculatedPrice = mode === 'season' ? Math.round(p.price * 2.7) : p.price;
    return `
      <div class="col-md-6 col-lg-4">
        <div class="pkg ${p.popular ? 'pop' : ''} reveal">
          ${p.popular ? '<span class="tag">Most Popular</span>' : ''}
          <h4>${p.name}</h4>
          <p class="muted">${p.target}</p>
          <div class="pr" data-base="${p.price}">${formatINR(calculatedPrice)}</div>
          <small class="muted">${mode === 'season' ? 'per season (3 complete sprays)' : 'starting rate per job'}</small>
          <ul class="ticks">
            ${p.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <a class="btn ${p.popular ? 'btn-agro' : 'btn-outline-agro'} w-100 mt-auto" href="${ROOT}dashboard/book-spraying.html">
            Book Package Now
          </a>
        </div>
      </div>
    `;
  };

  const renderFaqAccordion = (container, key) => {
    const items = FAQS[key] || FAQS.general;
    const accordionId = 'faq_' + Math.random().toString(36).substring(2, 7);
    container.id = accordionId;
    container.innerHTML = items.map((item, idx) => `
      <div class="accordion-item mb-2 border rounded-3 overflow-hidden">
        <h3 class="accordion-header">
          <button class="accordion-button ${idx === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionId}_item${idx}">
            ${item[0]}
          </button>
        </h3>
        <div id="${accordionId}_item${idx}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" data-bs-parent="#${accordionId}">
          <div class="accordion-body text-muted">
            ${item[1]}
          </div>
        </div>
      </div>
    `).join('');
  };

  // Populate [data-r] markup elements
  const renderDeclarativeSections = () => {
    const urlParams = new URLSearchParams(window.location.search);

    $$('[data-r]').forEach(el => {
      const type = el.dataset.r;
      const count = parseInt(el.dataset.n, 10) || 999;

      if (type === 'services') {
        el.innerHTML = SERVICES.slice(0, count).map(renderServiceCard).join('');
      } else if (type === 'blog') {
        el.innerHTML = BLOG_POSTS.slice(0, count).map(renderBlogCard).join('');
      } else if (type === 'pkgs') {
        el.innerHTML = PACKAGES.map(p => renderPackageCard(p, 'once')).join('');
      } else if (type === 'tests') {
        el.innerHTML = TESTIMONIALS.map(t => `
          <div class="col-md-4">
            <div class="tcard reveal">
              <div class="star-rating d-inline-flex align-items-center gap-1 mb-2" aria-label="5 out of 5 stars">
                <i class="bi bi-star-fill text-warning"></i>
                <i class="bi bi-star-fill text-warning"></i>
                <i class="bi bi-star-fill text-warning"></i>
                <i class="bi bi-star-fill text-warning"></i>
                <i class="bi bi-star-fill text-warning"></i>
                <span class="ms-1.5 fw-bold rating-badge">5.0</span>
              </div>
              <p class="muted">&ldquo;${t.text}&rdquo;</p>
              <div class="d-flex align-items-center mt-3">
                <img loading="lazy" src="${getImgUrl(t.img, 150)}" alt="${t.name}">
                <div>
                  <strong>${t.name}</strong><br>
                  <small class="muted">${t.role}</small>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      } else if (type === 'faq') {
        renderFaqAccordion(el, el.dataset.k || 'general');
      } else if (type === 'related') {
        const curId = parseInt(urlParams.get('s'), 10) || 0;
        const related = SERVICES.filter(s => s.id !== curId).slice(0, 3);
        el.innerHTML = related.map(renderServiceCard).join('');
      } else if (type === 'related-blog') {
        const curId = parseInt(urlParams.get('id'), 10) || 0;
        const related = BLOG_POSTS.filter(b => b.id !== curId).slice(0, 3);
        el.innerHTML = related.map(renderBlogCard).join('');
      }
    });
  };

  // 3. Interactive Features & Page Handlers
  const setupServicesFilter = () => {
    const filterContainer = document.getElementById('svcFilters');
    const grid = document.getElementById('svcGrid');
    if (!filterContainer || !grid) return;

    const categories = ['All', 'Crop Protection', 'Nutrition', 'Crop-Specific', 'Precision', 'Custom'];
    filterContainer.innerHTML = categories.map((cat, idx) => `
      <button type="button" class="${idx === 0 ? 'on' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      $$('button', filterContainer).forEach(b => b.classList.toggle('on', b === btn));

      const selectedCat = btn.dataset.cat;
      const cards = $$('[data-cat]', grid);
      cards.forEach(card => {
        card.style.display = (selectedCat === 'All' || card.dataset.cat === selectedCat) ? '' : 'none';
      });
    });
  };

  const setupPricingToggle = () => {
    const toggle = document.getElementById('priceToggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      $$('button', toggle).forEach(b => b.classList.toggle('on', b === btn));

      const mode = btn.dataset.m;
      $$('.pkg .pr').forEach(priceEl => {
        const base = parseFloat(priceEl.dataset.base);
        const newPrice = mode === 'season' ? Math.round(base * 2.7) : base;
        priceEl.textContent = formatINR(newPrice);
        const subtext = priceEl.nextElementSibling;
        if (subtext) {
          subtext.textContent = mode === 'season' ? 'per season (3 complete sprays)' : 'starting rate per job';
        }
      });
    });
  };

  const setupServiceDetailsPage = () => {
    const detailBox = document.getElementById('svcDetail');
    if (!detailBox) return;

    const urlParams = new URLSearchParams(window.location.search);
    let serviceId = parseInt(urlParams.get('s') || urlParams.get('id') || '0', 10);
    const cropParam = (urlParams.get('crop') || '').toLowerCase();

    if (cropParam) {
      const matchIdx = SERVICES.findIndex(sv => sv.t.toLowerCase().includes(cropParam) || sv.c.toLowerCase().includes(cropParam));
      if (matchIdx !== -1) serviceId = matchIdx;
    }

    if (isNaN(serviceId) || serviceId < 0 || serviceId >= SERVICES.length) {
      serviceId = 0;
    }

    const s = SERVICES[serviceId];

    // Rich agronomic, operational, and visual dataset tailored for each individual service
    const SERVICE_SPECIFIC_DETAILS = {
      0: {
        category: 'Paddy & Rice Protection',
        tagline: 'Zero crop trampling, 90% water reduction, and 100% blast & stem borer knockdown in flooded fields.',
        heroImg: `${ROOT}assets/img/services/paddy-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/paddy-gallery-1.jpg`,
        cap1: 'Downwash spray mist penetrating dense paddy tillers and water line',
        img2: `${ROOT}assets/img/services/paddy-gallery-2.jpg`,
        cap2: 'High-altitude autonomous swath mapping across flooded geometric rice terraces',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '30 – 35 Acres / Day (Single Pilot Crew)',
        lead: 'Flooded paddy fields present severe logistical barriers for traditional knapsack sprayers. Laborers trudging through knee-deep mud inadvertently shear tender tillering roots and trample up to 8% of harvestable panicles. Heavy tractor sprayers sink into mud and damage the delicate subsoil hardpan.',
        challenge: 'In addition to physical root trampling, devastating sucking pests like the Brown Planthopper (Nilaparvata lugens) and fungal pathogens like Sheath Blight (Rhizoctonia solani) colonize the lower 15cm of tillers right at the waterline. Standard manual lances spray from an angle, failing to penetrate dense vegetative canopies and leaving pest colonies completely intact.',
        solution: 'AgroFly multirotor flight dynamics use high-speed propeller downwash to actively part the dense paddy canopy in real time. Rotary centrifugal atomizers produce uniform 120-micron droplets that are driven straight down into the tiller bases and waterline. Flying 2.0 meters above standing water with millimeter RTK positioning, our licensed pilots complete an acre in under 6 minutes with zero ground compaction.',
        params: {
          altitude: '1.8m ? 2.2m above water line',
          speed: '4.5 ? 5.2 m/s uniform',
          droplet: '110 ? 140 µm fine mist',
          carrier: '8 ? 10 Litres / Acre (90% saved)'
        },
        pests: [
          'Brown Planthopper (BPH)',
          'Yellow Stem Borer',
          'Paddy Blast (Pyricularia oryzae)',
          'Sheath Blight & Rot',
          'Leaf Folder (Cnaphalocrocis medinalis)',
          'False Smut & Bacterial Leaf Streak'
        ],
        chemistry: 'Compatible with systemic fungicides (Azoxystrobin, Difenoconazole, Tricyclazole), insecticide suspensions (Chlorantraniliprole, Pymetrozine), and liquid Nano-Urea. Tank batches include organosilicone non-ionic surfactants for immediate rainfast adherence on slippery waxy leaves.',
        sop: [
          { title: 'Bund & Waterway Boundary Telemetry', desc: 'Pilots establish centimeter-level RTK GIS field boundaries, mapping drainage canals, bund walls, and nearby fish ponds to set strict 5-meter zero-spray buffer strips.' },
          { title: 'Ultra-Low Volume Batching', desc: 'Active fungicides or insecticides are metered with filtered de-silted water into a concentrated 10L/acre mix using non-shearing batch pumps.' },
          { title: 'Autonomous Swath Downwash Flight', desc: 'Drone navigates parallel swath lines at 2.0m AGL, using rotor wind wash to invert foliage and deposit droplets down to the submerged root collars.' },
          { title: 'Digital GIS Spray Audit & Sign-off', desc: 'Upon touchdown, a timestamped KML flight path and chemical usage certificate are exported directly to the farmer\'s mobile dashboard.' }
        ],
        prep: [
          { title: 'Water Depth Management', desc: 'Maintain 3 ? 5 cm standing water in paddy; avoid draining completely before foliar blast and sheath blight sorties.' },
          { title: 'Bund Boundary Flags', desc: 'Place visible markers along field corners and identify adjacent fish ponds or apiaries to establish no-fly buffers.' },
          { title: 'Clean Water Arrangement', desc: 'Provide 50 ? 70 liters of clean, de-silted water near the field bund for tank chemical mixing.' },
          { title: 'Takeoff Pad Clearing', desc: 'Ensure a dry, firm 5Ã—5m bund area free from overhanging branches and powerlines for safe drone launch.' }
        ],
        safety: [
          { title: 'Aquatic Buffer Strips', desc: 'Strict 5-meter zero-spray buffer zone observed near all fish ponds, irrigation canals, and drinking water wells.' },
          { title: 'Bystander Clearance', desc: 'Keep all field hands, children, and domestic cattle at least 30 meters upwind during active flight.' },
          { title: 'Chemical Handler PPE', desc: 'Mandatory chemical-resistant nitrile gloves, vapor respirator masks, and eye shields during batch mixing.' },
          { title: 'Pre-Harvest Interval (PHI)', desc: 'Adhere to mandatory 15-day safety interval between systemic fungicide spray and final grain harvesting.' }
        ],
        faqs: [
          { q: 'Can drones spray when water is standing in the paddy field ? ', a: 'Yes! Operating completely decoupled from the ground, drones fly effortlessly over standing water with zero wheel ruts, mud tracking, or root trampling.' },
          { q: 'Does propeller downwash shake off delicate grains during flowering ? ', a: 'No. Our flight computers govern altitude and rotor RPM dynamically during panicle emergence to produce gentle leaf fluttering without mechanical grain shedding.' },
          { q: 'How effective is drone spraying against Brown Planthoppers at the base ? ', a: 'Extremely effective. Aerodynamic downwash pushes micro-droplets directly to the bottom 15cm of tillers where planthoppers shelter, achieving 98% contact coverage.' },
          { q: 'Is chemical drift prevented near village fish ponds ? ', a: 'RTK centimeter guidance and millimeter-wave boundary sensors guarantee precise swath cutoffs with zero drift into adjacent water bodies.' }
        ]
      },
      1: {
        category: 'Commercial Fiber Protection',
        tagline: 'Vortex canopy inversion coats lower leaf surfaces to eradicate whiteflies, aphids, and pink bollworms.',
        heroImg: `${ROOT}assets/img/services/cotton-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/cotton-gallery-1.jpg`,
        cap1: 'High-downwash agricultural drone inverting cotton canopy for underside coverage',
        img2: `${ROOT}assets/img/services/cotton-gallery-2.jpg`,
        cap2: 'Precision drone spraying across healthy flowering cotton bolls and squares',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '25 – 30 Acres / Day (Single Pilot Crew)',
        lead: 'Cotton foliage is dense, thick, and umbrella-shaped. Destructive sucking pests ? including silverleaf whiteflies, jassids, and early-instar pink bollworms ? shelter almost exclusively on the undersides of broad leaves. Standard tractor booms spray downward from above, missing these pests and triggering massive square shedding.',
        challenge: 'Pink bollworm larvae bore into tender squares and bolls within hours of hatching. When conventional knapsack sprayers apply coarse droplets, over 40% of the active ingredient rolls off waxy cotton foliage onto the ground, wasting expensive inputs and failing to arrest lint damage.',
        solution: 'AgroFly\'s multirotor vortex inversion technique generates controlled downward aerodynamic turbulence that rolls cotton leaves 180 degrees in mid-air. Rotary atomizers produce fine 110-micron droplets that coat both upper and lower leaf surfaces in a single pass, slashing chemical waste by 35%.',
        params: {
          altitude: '1.8m ? 2.4m above cotton canopy',
          speed: '4.2 ? 5.0 m/s uniform',
          droplet: '100 ? 130 µm micro-mist',
          carrier: '10 ? 12 Litres / Acre'
        },
        pests: [
          'Silverleaf Whitefly (Bemisia tabaci)',
          'Pink Bollworm (Pectinophora gossypiella)',
          'Cotton Jassids & Aphids',
          'Thrips & Red Spider Mites',
          'Alternaria Leaf Spot',
          'Bacterial Blight (Black Arm)'
        ],
        chemistry: 'Optimized for translaminar and systemic insecticides (Diafenthiuron, Flonicamid, Spinetoram, Pyriproxyfen), neem triterpenoid bio-repellents, and foliar magnesium/boron nutrition during peak flowering.',
        sop: [
          { title: 'Egg Clutch & Nymph Hotspot Scouting', desc: 'Pilots identify canopy density and infestation severity across field blocks to calibrate precise spray dosages.' },
          { title: 'Rotary Atomizer Micron Tuning', desc: 'Atomizer discs are tuned to 110 microns to ensure microscopic droplets drift into dense whorls without thermal evaporation.' },
          { title: 'Canopy Vortex Inversion Sweep', desc: 'Multirotor wake creates high-velocity air vortices that flip leaves, coating lower surfaces with an unbroken protective barrier.' },
          { title: 'Residual Foliar Inspection', desc: 'Field agronomists verify droplet coverage across mid-canopy leaves with water-sensitive indicator cards.' }
        ],
        prep: [
          { title: 'Nymph Hotspot Tagging', desc: 'Locate whether whitefly nymphs or bollworm larvae are concentrated in middle or bottom foliage layers.' },
          { title: 'Furrow Pathway Access', desc: 'Clear edge headlands of thorny brush so flight crew can maintain continuous visual line-of-sight along rows.' },
          { title: 'Insecticide Staging', desc: 'Keep recommended translaminar chemical bottles ready in shade adjacent to the plot perimeter.' },
          { title: 'Calm Morning Window', desc: 'Schedule sortie between 6:30 AM and 9:30 AM when relative humidity is high and wind velocity is below 6 km/h.' }
        ],
        safety: [
          { title: 'Pollinator Safety Window', desc: 'Avoid spraying during peak morning bee activity when open floral squares are actively pollinating.' },
          { title: 'Canopy Velocity Governance', desc: 'Flight altitude maintained strictly at 2.0m AGL to prevent downdraft pressure from snapping lateral branches.' },
          { title: 'Anti-Drift Calibration', desc: 'Use anti-drift adjuvant whenever cotton fields border organic vegetable or horticultural plots.' },
          { title: 'Operator Respirator Mandate', desc: 'Full vapor respirators and chemical overalls required during handling of organophosphates and synthetic pyrethroids.' }
        ],
        faqs: [
          { q: 'Does drone spraying reach the undersides of cotton leaves ? ', a: 'Yes. Multirotor aerodynamic downwash creates controlled turbulence that flips foliage 180 degrees, coating underside shelter zones.' },
          { q: 'How quickly can AgroFly mobilize during a sudden bollworm outbreak ? ', a: 'We dispatch DGCA-certified flight crews from our regional hubs within 24 hours of booking confirmation.' },
          { q: 'Does atomized spray stain or damage open cotton bolls ? ', a: 'No. Controlled 110-micron droplets evaporate cleanly without staining fiber or dampening open bolls.' },
          { q: 'What is the best time of day for whitefly eradication ? ', a: 'Early mornings between 6:30 AM and 9:30 AM when relative humidity is high and sucking pests are resting sluggishly on lower leaf surfaces.' }
        ]
      },
      2: {
        category: 'Tall Canopy Protection',
        tagline: 'Safe overhead spraying for 10-foot tall mature plantations where manual laborers cannot safely enter.',
        heroImg: `${ROOT}assets/img/services/sugarcane-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/sugarcane-gallery-1.jpg`,
        cap1: 'Heavy-payload agricultural drone operating above 10-foot tall mature sugarcane',
        img2: `${ROOT}assets/img/services/sugarcane-gallery-2.jpg`,
        cap2: 'Autonomous aerial misting penetrating thick sugarcane canopy and internodes',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '20 – 25 Acres / Day (Single Pilot Crew)',
        lead: 'Mature sugarcane stands 10 to 12 feet tall in an impenetrable, razor-sharp thicket. Manual field laborers face extreme laceration risks, heat exhaustion, and snakebite hazards, while tractors cannot navigate the narrow rows. Consequently, late-season borer attacks often go untreated.',
        challenge: 'Top borer (Scirpophaga excerptalis) and internode borers attack the growing shoot tip and internodes, creating dead hearts and hollowing out canes. This reduces total cane tonnage by up to 25% and causes severe sucrose inversion at sugar mills.',
        solution: 'AgroFly hexacopters fly 2.5 meters above the tallest cane stalks, guided by millimeter-wave terrain-following radar. The concentrated rotor downdraft drives active droplets deep into the spindle leaf clusters and shoot joints, providing total crop protection without putting a single human foot into the field.',
        params: {
          altitude: '2.2m ? 2.8m above cane canopy',
          speed: '4.5 ? 5.5 m/s',
          droplet: '120 ? 160 µm controlled',
          carrier: '12 ? 16 Litres / Acre'
        },
        pests: [
          'Sugarcane Top Borer',
          'Internode & Stalk Borer',
          'Red Rot (Colletotrichum falcatum)',
          'Pyrilla Leafhopper',
          'Sugarcane Woolly Aphid',
          'Grassy Shoot Disease Vectors'
        ],
        chemistry: 'Specialized for systemic chlorantraniliprole formulations, carbendazim fungicides, and foliar potash sprays to enhance brix and sugar content before harvest.',
        sop: [
          { title: 'Digital Elevation Terrain Mapping', desc: 'Terrain radar continuously locks onto undulating canopy heights at 100 Hz, maintaining uniform spray altitude across sloped fields.' },
          { title: 'High-Shear Chemical Batching', desc: 'Thick suspension formulations are emulsified with anti-foaming agents to ensure uninterrupted rotary atomization.' },
          { title: 'Spindle-Penetrating Swath Run', desc: 'Drones deposit concentrated mist into top whorl spindles where borers enter, neutralizing larvae before stalk burrowing.' },
          { title: 'Mill Command Area Reporting', desc: 'Comprehensive field records are exported for sugar factory agricultural officers and farmer cooperative registers.' }
        ],
        prep: [
          { title: 'Powerline & Obstacle Tagging', desc: 'Alert pilots to overhead electricity transmission lines, borewell pipes, or tall palm trees around cane edges.' },
          { title: 'Canopy Height Measurement', desc: 'Inform crew of average stalk height (8 ? 12 feet) to establish millimeter-wave terrain radar parameters.' },
          { title: 'Clean Water Point', desc: 'Provide 80 ? 100 liters of filtered canal water along perimeter road for high-volume foliar batches.' },
          { title: 'Field Evacuation', desc: 'Confirm zero human workers or livestock remain within the impenetrable cane plantation before takeoff.' }
        ],
        safety: [
          { title: '40m Radar Collision Lock', desc: 'Millimeter-wave radar remains active at all times to prevent rotor collision with electrical cables.' },
          { title: 'Perimeter Standoff Buffer', desc: 'Keep all onlookers and farm animals at least 40 meters away from cane borders during high-downwash sorties.' },
          { title: 'Pilot Heat Protocol', desc: 'Mandatory rotation and hydration breaks for pilots working around reflective sugarcane canopy microclimates.' },
          { title: 'Sugar Factory Harvest PHI', desc: 'Strict 21-day pre-harvest waiting interval before commencing cane cutting for mill crushing.' }
        ],
        faqs: [
          { q: 'Can drones spray 12-foot mature cane before harvest ? ', a: 'Yes. Overhead aerial flight completely eliminates crop height limits, allowing safe spraying at all maturity stages.' },
          { q: 'How do drones avoid tall trees and powerlines near cane fields ? ', a: 'Spherical 40-meter millimeter-wave radar continuously scans flight corridors, automatically diverting around obstacles.' },
          { q: 'Does the spray reach inner stalk nodes ? ', a: 'Yes. High-volume multirotor downwash pushes atomized mist down into the leaf sheaths and lower shoot internodes.' },
          { q: 'Is this service available for sugar mill cooperative clusters ? ', a: 'Yes! We routinely mobilize synchronized multi-drone fleets capable of spraying 100+ acres daily across factory command zones.' }
        ]
      },
      3: {
        category: 'Cereal Crop Defense',
        tagline: 'Direct whorl-penetrating downdraft for rapid Fall Armyworm (FAW) knockdown and foliar zinc nutrition.',
        heroImg: `${ROOT}assets/img/services/maize-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/maize-gallery-1.jpg`,
        cap1: 'Drone downwash driving bio-insecticide directly into the central corn whorl',
        img2: `${ROOT}assets/img/services/maize-gallery-2.jpg`,
        cap2: 'Broadacre maize field uniform foliar nutrition and pest defense',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '30 – 35 Acres / Day (Single Pilot Crew)',
        lead: 'Fall Armyworm (Spodoptera frugiperda) can consume an entire corn field in 48 hours. Young caterpillars bore deep into the central vegetative whorl and plug the opening with thick fecal frass, creating a barrier that deflects standard horizontal sprays.',
        challenge: 'Knapsack sprayers produce broad, low-velocity mist that settles on outer leaves, completely failing to penetrate the central cone. By the time damage is visible, the apical growing point is destroyed, resulting in stunted plants and barren cobs.',
        solution: 'AgroFly\'s concentrated downward rotor downwash acts like a pneumatic plunger, blowing away loose frass and forcing fine 110-micron droplets straight into the apical whorl cone where armyworms feed. Combined with foliar zinc and boron, corn recovers vegetative vigor rapidly.',
        params: {
          altitude: '1.8m ? 2.2m above maize whorls',
          speed: '4.5 ? 5.2 m/s',
          droplet: '110 ? 140 µm whorl-directed',
          carrier: '10 ? 12 Litres / Acre'
        },
        pests: [
          'Fall Armyworm (Spodoptera frugiperda)',
          'Maize Stem Borer (Chilo partellus)',
          'Turcicum Leaf Blight',
          'Maydis Blight',
          'Shoot Fly & Aphids',
          'Banded Leaf and Sheath Blight'
        ],
        chemistry: 'Compatible with emamectin benzoate, chlorantraniliprole, spinetoram, and Bacillus thuringiensis (Bt) bio-insecticides, blended with chelated zinc (EDTA Zn 12%) for rapid vegetative growth.',
        sop: [
          { title: 'Vegetative Whorl Scouting', desc: 'Pilots identify V3 to V6 crop stages to time spraying before larvae penetrate deep stalk tissue.' },
          { title: 'Funnel-Calibrated Micron Tuning', desc: 'Atomizers are dialed to 120 microns to maximize droplet momentum into the central funnel.' },
          { title: 'High-Velocity Downwash Sortie', desc: 'Multirotor prop wash forces active mist deep into the central cone, coating early-instar larvae instantly.' },
          { title: 'Cob Vigor & Mortality Audit', desc: 'High-resolution photo audit 24 hours post spray verifies cessation of pinhole leaf skeletonization.' }
        ],
        prep: [
          { title: 'Vegetative Stage Audit', desc: 'Confirm crop is between V3 and V8 stages when Fall Armyworm caterpillars feed inside the funnel whorl.' },
          { title: 'Landing Pad Staging', desc: 'Set up clean 5Ã—5m takeoff pad along field road verge away from tall corn plants.' },
          { title: 'Bio-Insecticide Storage', desc: 'Keep biological products (Bt or NPV) in a cool, shaded container shielded from direct UV sun rays.' },
          { title: 'Clean Water Prep', desc: 'Prepare 60 liters of particulate-free clean water per 5 acres for rotary atomizer tank batches.' }
        ],
        safety: [
          { title: 'Tassel Pollination Care', desc: 'During silking and pollination, flight altitude is elevated to 2.5m with gentler airflow to protect pollen shedding.' },
          { title: 'Field Hand Clearance', desc: 'Ensure all weeding and inter-cultivation workers exit the maize field before drone launch.' },
          { title: 'Sweet Corn Table PHI', desc: 'Observe mandatory 10-day safety period for sweet corn varieties destined for fresh vegetable markets.' },
          { title: 'Tank Flush Protocol', desc: 'Clean and neutralize atomizer discs with fresh water after emamectin and spinetoram sorties.' }
        ],
        faqs: [
          { q: 'How does drone spraying defeat Fall Armyworm hiding in the whorl ? ', a: 'Rotor downdraft creates high vertical air velocity that displaces loose frass and pushes micro-droplets directly down the funnel cone.' },
          { q: 'What is the optimal crop stage to spray for armyworm ? ', a: 'Early vegetative stage (V3 to V6) before caterpillars bore into stalk tissue and cobs.' },
          { q: 'Can we combine zinc and boron nutrients with the insecticide ? ', a: 'Yes. Our flight desk verifies chemical and micronutrient compatibility for efficient single-pass nutrition and protection.' },
          { q: 'Does drone downwash damage tassels during pollination ? ', a: 'Flight altitude is elevated to 2.5m with gentler airflow during silking to safeguard pollination.' }
        ]
      },
      4: {
        category: 'Oilseeds & Legume Protection',
        tagline: 'Even low-canopy misting for Tikka leaf spot, collar rot, and rust without disturbing tender pegging zones.',
        heroImg: `${ROOT}assets/img/services/groundnut-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/groundnut-gallery-1.jpg`,
        cap1: 'Low-altitude drone spraying across sprawling groundnut foliage',
        img2: `${ROOT}assets/img/services/groundnut-gallery-2.jpg`,
        cap2: 'Uniform mist application safeguarding tender underground pegging',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '25 – 30 Acres / Day (Single Pilot Crew)',
        lead: 'Groundnut develops pods underground through tender aerial pegs that grow downwards from flowers into the soil. Heavy foot traffic and equipment compact the topsoil, severing pegs and drastically reducing harvest yield.',
        challenge: 'Groundnuts and pulses are extremely susceptible to Cercospora leaf spot (Tikka) and collar rot during warm, humid conditions. Defoliation reduces photosynthetic capacity by up to 50%, preventing pod filling.',
        solution: 'Operating 1.5 meters above the groundnut canopy, AgroFly drones maintain a low-altitude precision misting line. Delivering broad-spectrum fungicides with zero soil contact, the soil remains loose, friable, and aerated for maximum peg entry and pod expansion.',
        params: {
          altitude: '1.5m ? 2.0m above ground level',
          speed: '4.5 ? 5.0 m/s',
          droplet: '110 ? 140 µm fine mist',
          carrier: '8 ? 10 Litres / Acre'
        },
        pests: [
          'Tikka Leaf Spot (Cercospora arachidicola)',
          'Collar Rot & Stem Rot (Sclerotium rolfsii)',
          'Groundnut Rust (Puccinia arachidis)',
          'Tobacco Caterpillar (Spodoptera litura)',
          'Thrips & Jassids (Peanut Clump Vectors)',
          'Groundnut Leaf Miner'
        ],
        chemistry: 'Compatible with hexaconazole, tebuconazole, mancozeb, and Trichoderma bio-fungicides, combined with water-soluble 19:19:19 foliar fertilizer and chelated boron.',
        sop: [
          { title: 'Pegging Zone Survey', desc: 'Pilots identify canopy closure and peg development to set low-altitude flight paths without soil contact.' },
          { title: 'Fine Mist Atomization', desc: 'Centrifugal discs produce fine mist that coats low-lying creeping foliage uniformly.' },
          { title: 'Soil-Safe Swath Execution', desc: 'Drone navigates parallel passes, coating bottom leaves and stem collars where fungal spores germinate.' },
          { title: 'Foliar Retention Verification', desc: 'Audit cards confirm uniform coverage without soil puddling or chemical runoff.' }
        ],
        prep: [
          { title: 'Soil Moisture Check', desc: 'Ensure soil around plant root zones has baseline moisture to facilitate systemic fungicide assimilation.' },
          { title: 'Strict Foot-Traffic Ban', desc: 'Prevent laborers and livestock from walking into the parcel during peak flower pegging.' },
          { title: 'Wettable Powder Pre-Slurry', desc: 'Dissolve wettable powders (Mancozeb / Carbendazim) into a smooth slurry before tank batching.' },
          { title: 'Boundary Peg Marking', desc: 'Flag field corners clearly for precise autonomous GNSS waypoint corridor calculation.' }
        ],
        safety: [
          { title: 'Low Altitude Collision Avoidance', desc: 'Radar maintains continuous 1.5m AGL with automated obstacle avoidance over field perimeter fences.' },
          { title: 'Crosswind Thresholds', desc: 'Cease spraying if crosswinds exceed 8 km/h to prevent chemical drift onto neighboring legume plots.' },
          { title: 'Operator Protective Gear', desc: 'Chemical overalls, nitrile gloves, and eye protection required during slurry preparation.' },
          { title: 'Fodder Waiting Interval', desc: 'Maintain 14-day safety waiting interval before harvesting peanut haulms for livestock fodder.' }
        ],
        faqs: [
          { q: 'Does drone spraying protect the subsurface pegging process ? ', a: 'Yes! Operating aerially with zero ground contact keeps soil friable and prevents accidental peg shearing.' },
          { q: 'How many sprays are recommended for groundnut Tikka spot ? ', a: 'Typically 2 preventive sprays at 45 and 65 days after sowing ensure complete season-long canopy retention.' },
          { q: 'Can bio-fungicides like Trichoderma be applied with drones ? ', a: 'Yes. Our rotary atomizers handle biological suspensions cleanly without nozzle clogging.' },
          { q: 'Is this service suitable for blackgram and greengram pulses ? ', a: 'Yes, all oilseed and legume crops share identical low-drift, soil-safe flight parameters.' }
        ]
      },
      5: {
        category: 'Horticulture & Trellised Crops',
        tagline: 'Precision micro-droplet misting for high-value vegetables, staked crops, and horticulture with zero drift.',
        heroImg: `${ROOT}assets/img/services/vegetable-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/vegetable-gallery-1.jpg`,
        cap1: 'Precision drone nozzle spraying over organized vegetable rows',
        img2: `${ROOT}assets/img/services/vegetable-gallery-2.jpg`,
        cap2: 'Targeted droplet deposition minimizing chemical residue on fresh produce',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '18 – 22 Acres / Day (Single Pilot Crew)',
        lead: 'High-value vegetables like tomato, chilli, capsicum, onion, and brinjal require frequent crop protection against fruit borers, thrips, and powdery mildew. Coarse manual spraying scorches delicate fruit skin and leaves excessive chemical residues.',
        challenge: 'Staked tomatoes, trellised gourds, and nursery beds present vertical obstacles that ground machinery cannot negotiate. Manual laborers drag heavy hoses between plants, breaking stems and knocking off flowering blossoms.',
        solution: 'AgroFly uses ultra-fine 90 ? 120 micron rotary atomizers to deposit a uniform, non-dripping micro-sheen over vegetable beds. Even on staked or trellised crops, our certified flight crews program obstacle-aware corridors that coat leaves without blossom shedding or fruit blemishes.',
        params: {
          altitude: '1.8m ? 2.2m above trellises',
          speed: '4.0 ? 4.8 m/s',
          droplet: '90 ? 120 µm micro-atomized',
          carrier: '12 ? 14 Litres / Acre'
        },
        pests: [
          'Chilli Thrips & Yellow Mites',
          'Tomato Fruit Borer (Helicoverpa armigera)',
          'Early & Late Blight (Phytophthora infestans)',
          'Powdery Mildew & Downy Mildew',
          'Whiteflies & Aphids (Virus Vectors)',
          'Brinjal Shoot & Fruit Borer'
        ],
        chemistry: 'Specialized for low-residue formulations (Spinosad, Cyantraniliprole, Azoxystrobin), copper hydroxide bactericides, and organic bio-stimulants safe for export-grade vegetables.',
        sop: [
          { title: 'Trellis & Staking Corridor Mapping', desc: 'Pilots log wire heights, support poles, and irrigation drip lines to compute obstacle-free flight lines.' },
          { title: 'Ultra-Fine Droplet Calibration', desc: 'Atomizers are tuned to 100 microns to deposit a fine protective sheen without droplet pooling on fruit.' },
          { title: 'Gentle Swath Canopy Coating', desc: 'Drone maintains steady ground speed, preventing blossom drop while saturating leaf undersides.' },
          { title: 'Residue & Pre-Harvest Interval Audit', desc: 'Farmers receive digital records confirming adherence to recommended Pre-Harvest Intervals (PHI).' }
        ],
        prep: [
          { title: 'Overhead Wire Flagging', desc: 'Point out GI trellis wires, wooden support stakes, and surface drip lines to pilot crew.' },
          { title: 'Marketable Fruit Harvest', desc: 'Harvest all mature, ripe tomatoes, chillies, or brinjals before the scheduled drone application.' },
          { title: 'De-Mineralized Water Source', desc: 'Use clean water without high salt contents to prevent mineral staining on delicate vegetable surfaces.' },
          { title: 'Optimal Timing', desc: 'Schedule application during early morning (6:00 AM ? 8:30 AM) or late afternoon after 4:30 PM.' }
        ],
        safety: [
          { title: 'Export MRL Compliance', desc: 'Strict observation of CODEX Maximum Residue Limits and certified pre-harvest safety intervals.' },
          { title: 'Blossom Protection', desc: 'Governed rotor RPM prevents physical detachment of tender tomato and pepper floral blossoms.' },
          { title: 'Sensitive Crop Buffers', desc: 'Maintain 10m buffer from adjacent open apiaries, salad greens, and open water bodies.' },
          { title: 'Full Operator PPE', desc: 'Full protective chemical suits, vapor respirators, and nitrile gloves mandatory during tank mixing.' }
        ],
        faqs: [
          { q: 'Will the drone mist damage staked tomato poles and netting ? ', a: 'No. RTK positioning and obstacle radar maintain exact row heading without snagging trellises.' },
          { q: 'Does fine mist leave chemical residue on export-grade produce ? ', a: 'Micro-droplet atomization ensures uniform distribution with fast residue degradation and zero scorch marks.' },
          { q: 'Can organic bio-pesticides and seaweed extracts be sprayed ? ', a: 'Yes. Our pumps and atomizers are 100% compatible with organic-certified botanical and microbial inputs.' },
          { q: 'How soon after spraying can vegetable harvesting resume ? ', a: 'Depending on the chemical label, harvesting typically resumes within 24 to 48 hours.' }
        ]
      },
      6: {
        category: 'Foliar Nutrient Dispersion',
        tagline: 'Direct stomatal foliar feeding with liquid Nano-Urea, water-soluble NPK, and chelated micronutrients.',
        heroImg: `${ROOT}assets/img/services/fertilizer-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/fertilizer-gallery-1.jpg`,
        cap1: 'High-payload drone spreading liquid foliar fertilizer over lush farmland',
        img2: `${ROOT}assets/img/services/fertilizer-gallery-2.jpg`,
        cap2: 'Rapid aerial fertilization maximizing uniform nitrogen absorption',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '35 – 45 Acres / Day (Single Pilot Crew)',
        lead: 'Broadcasting granular chemical fertilizers onto soil leads to massive nutrient wastage: up to 60% of nitrogen is lost through ammonia volatilization and deep groundwater nitrate leaching. In high-pH soils, essential micronutrients become fixed and inaccessible to roots.',
        challenge: 'Carrying heavy 45kg fertilizer sacks and broadcasting by hand causes uneven crop stands, with some patches burned by excess nitrogen and others stunted. Soil salinization worsens with every broadcast cycle.',
        solution: 'Foliar nutrition bypasses soil locks by applying nutrients directly onto active leaf stomata. AgroFly\'s rotary atomizers create 120-micron droplets that adhere to leaves without runoff. One 500ml bottle of IFFCO Nano-Urea sprayed aerially replaces an entire 45kg sack of conventional urea at half the cost.',
        params: {
          altitude: '2.0m ? 2.5m above canopy',
          speed: '4.5 ? 5.2 m/s',
          droplet: '120 ? 160 µm nutrient mist',
          carrier: '10 ? 14 Litres / Acre'
        },
        pests: [
          'Liquid Nano-Urea & Nano-DAP',
          '19:19:19 & 13:0:45 Water Soluble NPK',
          'Chelated Zinc (EDTA Zn 12%)',
          'Soluble Boron (20%) & Ferrous Sulphate',
          'µmino Acid & Seaweed Bio-Stimulants',
          'Plant Growth Regulators (Gibberellic Acid)'
        ],
        chemistry: 'Formulated with organic humic acid complexes, fulvic chelators, and non-foaming sticking agents that promote rapid stomatal uptake within 4 hours of morning application.',
        sop: [
          { title: 'Morning Stomatal Dilation Timing', desc: 'Spraying commences between 6:00 AM and 9:30 AM when crop stomata are fully open and transpiration is active.' },
          { title: 'Nano-Chelated Solution Emulsion', desc: 'Liquid Nano-Urea and micronutrients are blended in non-shearing tanks to preserve nano-cluster structure.' },
          { title: 'Uniform Foliar Sheen Deposition', desc: 'Drones deposit an even micro-sheen across top and mid foliage without droplet coalescence or ground drip.' },
          { title: 'Chlorophyll Vigor Verification', desc: 'Follow-up multispectral index audits confirm nitrogen assimilation and canopy greening within 48 to 72 hours.' }
        ],
        prep: [
          { title: 'Nutrient Stock Staging', desc: 'Keep required bottles of IFFCO Nano-Urea or water-soluble NPK ready along the field perimeter.' },
          { title: 'Baseline Soil Moisture', desc: 'Ensure soil has baseline moisture so crop foliage is turgid and stomatal pores are receptive.' },
          { title: 'Mixing Vessels Ready', desc: 'Provide two clean 20-liter plastic containers and clean wooden/plastic stirring paddles.' },
          { title: 'Acreage Confirmation', desc: 'Verify exact acreage with flight crew to ensure optimal fertilizer dilution ratios per acre.' }
        ],
        safety: [
          { title: 'Midday Heat Ceasefire', desc: 'Spraying strictly suspended if ambient temperature exceeds 35°C to avoid leaf margin scorch.' },
          { title: 'Atomization Check', desc: 'Atomizers calibrated to 130 microns to ensure microscopic sheen without droplet coalescence.' },
          { title: 'Protective Safety Eyewear', desc: 'Standard goggles and nitrile gloves required during concentrate pouring and handling.' },
          { title: '4-Hour Rain Window', desc: 'Check local 4-hour forecast to ensure foliar nutrients are absorbed prior to rainfall.' }
        ],
        faqs: [
          { q: 'How much granular urea does one drone Nano-Urea spray replace ? ', a: 'One 500ml bottle of Nano-Urea sprayed aerially replaces a full 45kg sack of conventional granular urea.' },
          { q: 'What is the optimal time of day for foliar nutrient spraying ? ', a: 'Early mornings (6:00 AM to 9:30 AM) when stomata are fully dilated and relative humidity exceeds 60%.' },
          { q: 'Can micronutrients like Zinc and Boron be combined with Nano-Urea ? ', a: 'Yes. Our agronomists test pH and chemical compatibility to ensure complete single-pass nutrition.' },
          { q: 'How quickly do plants absorb the foliar nutrients ? ', a: 'Over 90% of atomized foliar nutrients are absorbed through stomatal pores within 4 hours of spraying.' }
        ]
      },
      7: {
        category: 'Enterprise & FPO Clusters',
        tagline: 'Synchronized multi-drone fleet deployment with mobile power generation for corporate estates and Farmer Producer Organizations.',
        heroImg: `${ROOT}assets/img/services/large-acreage-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/large-acreage-gallery-1.jpg`,
        cap1: 'Multi-drone autonomous fleet operating across extensive commercial estate',
        img2: `${ROOT}assets/img/services/large-acreage-gallery-2.jpg`,
        cap2: 'Real-time telemetry and swath mapping over contiguous agricultural land',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: 'Up to 100+ Acres / Day (Multi-Drone Fleet)',
        lead: 'Managing crop protection across 50 to 500 acres of contiguous farmland presents massive labor coordination hurdles. Manual labor shortages delay spraying windows, allowing pest outbreaks to spread unchecked between neighboring plots.',
        challenge: 'Smallholder farmers with 1-to-2 acre holdings often face higher individual contractor rates. When an entire village hamlet needs simultaneous spraying, individual contractor coordination collapses.',
        solution: 'AgroFly deploys coordinated multi-drone squads equipped with mobile diesel charging stations, high-shear chemical batching tanks, and digital parcel trackers. By treating large blocks continuously, we cover 100+ acres per day, cutting operational costs by 30% and providing individual member certificates for FPO traceability.',
        params: {
          altitude: '2.0m ? 3.0m fleet coverage',
          speed: '5.5 ? 6.5 m/s continuous',
          droplet: '110 ? 160 µm programmable',
          carrier: '8 ? 14 Litres / Acre'
        },
        pests: [
          'Contiguous FPO Village Cluster Missions',
          'Sugar Factory Command Area Spraying',
          'Seed Production Estates & Plantations',
          'Emergency Broadacre Pest Invasions',
          'Unified Soil Conditioning & Bio-Drenches',
          'Corporate Farm Digital Acreage Audits'
        ],
        chemistry: 'Tailored to bulk agricultural supply contracts, supporting organic bio-inputs, liquid fertilizers, and CIBRC-registered broadacre crop protection chemicals.',
        sop: [
          { title: 'FPO Acreage Aggregation & GIS Partitioning', desc: 'Digital boundary consolidation merges hundreds of smallholder parcels into unified flight corridors.' },
          { title: 'Mobile Command Unit Deployment', desc: 'Fully equipped field vans with 10kVA generators and digital batch stations arrive at village centers.' },
          { title: 'Continuous Swarm Swath Spraying', desc: 'Multiple drones fly coordinated sectors with hot-swap battery rotations, maintaining sunrise-to-sunset operations.' },
          { title: 'Individual Farmer Plot Certificates', desc: 'Each member farmer receives a distinct digital certificate and invoice detailing treated acreage and timestamps.' }
        ],
        prep: [
          { title: 'Land Survey Compilation', desc: 'FPO coordinator consolidates land survey numbers and maps boundary polygons into a contiguous cluster.' },
          { title: 'Central Staging Hub', desc: 'Designate a village community center or wide farm road for mobile command vehicle and generator setup.' },
          { title: 'Bulk Water Tanker', desc: 'Arrange a 500 ? 1000 liter water tanker or bowser for high-speed automated chemical batching.' },
          { title: 'Village Coordinator Attendance', desc: 'Ensure local farmer representative is present to guide pilot crews between smallholder boundaries.' }
        ],
        safety: [
          { title: 'Fleet Airspace Deconfliction', desc: 'Autonomous UTM air traffic management assigns discrete flight corridors and altitudes to each drone.' },
          { title: 'Village Public Advisory', desc: 'Broadcast village loudspeaker advisory prior to fleet startup informing residents to stay clear.' },
          { title: 'High-Tension Wire Standoff', desc: 'Strict 50m minimum standoff distance from 11kV/33kV rural agricultural transmission lines.' },
          { title: 'Real-time Telemetry Supervision', desc: 'Flight operations director continuously monitors live telemetry, battery voltages, and geofences.' }
        ],
        faqs: [
          { q: 'How do smallholder farmers benefit from cluster spraying ? ', a: 'By aggregating through an FPO, small plots are sprayed consecutively at wholesale bulk rates, saving up to 30%.' },
          { q: 'What is the minimum acreage required for multi-drone deployment ? ', a: 'Typically 30 contiguous acres or an aggregated cluster of at least 15 smallholder farms.' },
          { q: 'Does each member farmer receive an individual spray certificate ? ', a: 'Yes! Each farmer receives an individual KML map, treated acreage record, and chemical usage receipt.' },
          { q: 'How does the fleet handle charging in rural areas without electricity ? ', a: 'Our mobile support vans carry onboard diesel generators and rapid battery charging banks for 100% self-sufficient field operations.' }
        ]
      },
      8: {
        category: 'Oilseeds & Mustard',
        tagline: 'Contactless aerial canopy protection preserving delicate flowering branches while eradicating aphids and Alternaria blight.',
        heroImg: `${ROOT}assets/img/services/mustard-drone-spraying.jpg`,
        img1: `${ROOT}assets/img/services/mustard-gallery-1.jpg`,
        cap1: 'Autonomous drone maintaining precise height above yellow flowering mustard canopy',
        img2: `${ROOT}assets/img/services/mustard-gallery-2.jpg`,
        cap2: 'High-downwash micro-mist reaching deep into lower stems without branch damage',
        turnaround: 'Within 24 Hours of Booking',
        dailyThroughput: '28 – 32 Acres / Day',
        lead: 'Mustard crops develop brittle flowering branches reaching 4 to 6 feet in height. Conventional backpack sprayers or tractor equipment snap branches, knock off flowering buds, and trample up to 15% of the total harvest.',
        challenge: 'Mustard aphids (Lipaphis erysimi) attack flower buds and seed pods during winter flowering. In manual spraying, workers cannot navigate the dense, tangled stems without causing severe mechanical crop trauma.',
        solution: 'AgroFly drones glide smoothly 1.5 to 2.0 metres above the flowering canopy. Our rotor downwash creates a gentle turbulence that disperses 90-130 micron droplets into flower clusters and inner branches, eliminating pests with 0% mechanical crop loss.',
        params: {
          altitude: '1.5m ? 2.0m above crop flowers',
          speed: '4.5 ? 5.5 m/s steady flight',
          droplet: '90 ? 130 µm atomized mist',
          carrier: '8 ? 10 Litres / Acre'
        },
        pests: [
          'Mustard Aphids (Lipaphis erysimi)',
          'Alternaria Leaf Blight & Stem Rot',
          'White Rust (Albugo candida)',
          'Downy Mildew of Crucifers',
          'Sawfly & Painted Bug (Bagrada hilaris)',
          'Sclerotinia Stem Rot & Pod Blight'
        ],
        chemistry: 'Compatible with Dimethoate, Imidacloprid, Mancozeb, Ridomil Gold, Metalaxyl, and certified organic neem-based bio-pesticides.',
        sop: [
          { title: 'Flower-Safe Swath Planning', desc: 'Pre-flight LiDAR telemetry scans field contours to maintain exact flight levels above yellow blossom canopies.' },
          { title: 'Pollinator-Friendly Timing', desc: 'Spray missions are scheduled during early morning or late dusk hours to prevent interference with honeybee pollination.' },
          { title: 'High-Downwash Atomization', desc: 'Centrifugal discs create controlled micro-droplets that penetrate deep into the lower stems where aphids colonize.' },
          { title: 'Post-Flight Coverage Audit', desc: 'Water-sensitive test strips confirm 98% droplet distribution across all flower clusters and inner foliage.' }
        ],
        prep: [
          { title: 'Field Boundary Demarcation', desc: 'Identify tall boundary trees or electric poles along the field perimeter.' },
          { title: 'Clean Water Arrangement', desc: 'Provide 8 to 10 litres of clean water per acre at the designated staging point.' },
          { title: 'Recommended Chemical Supply', desc: 'Ensure recommended insecticides or fungicides are readily available in verified dosages.' },
          { title: 'Honeybee Activity Check', desc: 'Inform pilots of any nearby apiary boxes so safe buffer margins can be maintained.' }
        ],
        safety: [
          { title: 'Bee & Pollinator Protection', desc: 'Strict flight protocols prioritize non-toxic or biological solutions during peak flowering hours.' },
          { title: 'Wind Drift Buffers', desc: 'Automatic spray cutoff whenever ambient crosswinds exceed 12 km/h.' },
          { title: 'Contactless Flight Profile', desc: 'Guarantees zero physical contact with brittle flowering branches and fragile pods.' },
          { title: 'Zero Soil Compaction', desc: 'Completely eliminates soil hardening and root trampling associated with tractors.' }
        ],
        faqs: [
          { q: 'Will drone spraying damage open mustard flowers or reduce pod setting ? ', a: 'No! The atomized micro-mist is exceptionally light (90-130 microns) and lands like natural dew without shaking off delicate petals or disturbing pod setting.' },
          { q: 'How does drone spraying protect honeybees pollinating mustard fields ? ', a: 'We strictly schedule our sorties during early dawn or late afternoon when pollinator activity is low, using targeted nozzles that minimize airborne drift.' },
          { q: 'Can drones control severe mustard aphid infestations ? ', a: 'Yes! The rotor downdraft flips the flowering clusters and delivers active ingredients directly to aphid colonies clustered along the central stems.' },
          { q: 'How much water and time is saved compared to manual knapsack spraying ? ', a: 'Drone spraying uses only 8-10 litres of water per acre compared to 150-200 litres for manual spraying, and covers an acre in just 6-8 minutes!' }
        ]
      }
    };

    const details = SERVICE_SPECIFIC_DETAILS[serviceId] || SERVICE_SPECIFIC_DETAILS[0];

    // Page metadata and hero background update
    document.title = `${s.t} | AgroFly Agricultural Drone Services`;
    const heroTitle = $('.page-hero h1');
    const heroDesc = $('.page-hero p');
    const heroBg = $('.page-hero .hero-bg');
    const heroLabel = $('.page-hero .label');

    if (heroTitle) heroTitle.textContent = s.t;
    if (heroDesc) heroDesc.textContent = details.tagline;
    if (heroLabel) heroLabel.textContent = details.category.toUpperCase();
    if (heroBg) {
      heroBg.src = details.heroImg;
      heroBg.alt = s.t;
    }

    const bookThisBtn = document.getElementById('bookThis');
    if (bookThisBtn) {
      bookThisBtn.href = `${ROOT}dashboard/book-spraying.html ? svc=${s.id}&crop=${encodeURIComponent(s.crops[0] || 'Crop')}`;
    }

    // Render Rich, Individualized, Responsive Layout
    detailBox.innerHTML = `
      <div class="svc-detail-wrap">
        <!-- Top Navigation Bar: Back Button & Meta Badges -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <a href="services.html" class="btn btn-outline-agro btn-sm d-inline-flex align-items-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-pill">
            <i class="bi bi-arrow-left"></i>
            <span>Back to All Services</span>
          </a>
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill fw-semibold">
              <i class="bi bi-tag-fill me-1"></i> From &#8377;${s.rate}/Acre (Indicative)
            </span>
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold">
              <i class="bi bi-lightning-charge-fill me-1"></i> 24h Rapid Dispatch
            </span>
            <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-1.5 rounded-pill fw-semibold">
              <i class="bi bi-speedometer2 me-1"></i> ${escapeHTML(s.cov || '25 – 35 Acres/day')}
            </span>
          </div>
        </div>

        <div class="row g-4 g-lg-5">
          <!-- Main Content Column -->
          <div class="col-lg-8">
            <!-- Executive Lead Paragraph -->
            <div class="lead fw-semibold text-dark mb-4 p-3.5 rounded-3 bg-light border-start border-4 border-success" style="line-height: 1.7; font-size: 1.15rem;">
              ${details.lead}
            </div>

            <!-- Suitable Crops & Throughput Bar -->
            <div class="p-3 mb-4 rounded-4 border bg-card shadow-xs">
              <div class="row g-3">
                <div class="col-md-7">
                  <span class="d-block text-muted small fw-bold text-uppercase mb-1">
                    <i class="bi bi-flower1 text-agro me-1"></i>Recommended Suitable Crops
                  </span>
                  <div class="d-flex flex-wrap gap-1.5">
                    ${(Array.isArray(s.crops) ? s.crops : [s.crops]).map(c => `
                      <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1">
                        ${escapeHTML(c)}
                      </span>
                    `).join('')}
                  </div>
                </div>
                <div class="col-md-5 border-start-md">
                  <span class="d-block text-muted small fw-bold text-uppercase mb-1">
                    <i class="bi bi-clock-history text-agro me-1"></i>Daily Spray Coverage
                  </span>
                  <strong class="text-dark">${escapeHTML(s.cov || '25 – 35 Acres per Flight Crew / Day')}</strong>
                </div>
              </div>
            </div>

            <!-- Section 1: Agronomic Challenge & Field Realities -->
            <h3 class="h4 fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <i class="bi bi-shield-exclamation text-danger fs-4"></i>
              <span>1. The Agronomic Challenge</span>
            </h3>
            <p class="text-secondary" style="line-height: 1.75;">${details.challenge}</p>

            <!-- Two Side-by-Side Featured Crop & Operation Images -->
            <div class="svc-img-grid my-4">
              <div class="svc-img-card">
                <img src="${details.img1}" alt="${escapeHTML(s.t)} field inspection" loading="lazy">
                <div class="svc-img-caption">
                  <i class="bi bi-camera me-1 text-agro"></i>
                  <span>${details.cap1}</span>
                </div>
              </div>
              <div class="svc-img-card">
                <img src="${details.img2}" alt="${escapeHTML(s.t)} telemetry flight" loading="lazy">
                <div class="svc-img-caption">
                  <i class="bi bi-cpu me-1 text-agro"></i>
                  <span>${details.cap2}</span>
                </div>
              </div>
            </div>

            <!-- Section 2: Technical Aerial Solution & Mechanism -->
            <h3 class="h4 fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <i class="bi bi-cpu-fill text-agro fs-4"></i>
              <span>2. Technical Aerial Solution &amp; Mechanism</span>
            </h3>
            <p class="text-secondary" style="line-height: 1.75;">${details.solution}</p>

            <!-- Key Spraying Benefits -->
            <h4 class="h5 fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <i class="bi bi-award-fill text-agro"></i>
              <span>Core Operational Benefits</span>
            </h4>
            <div class="row g-3 mb-4">
              ${(s.b || []).map((b, idx) => `
                <div class="col-sm-6">
                  <div class="p-3 rounded-3 border bg-card h-100 shadow-xs d-flex align-items-start gap-2.5">
                    <i class="bi bi-check2-circle text-success fs-5 flex-shrink-0 mt-0.5"></i>
                    <span class="small fw-semibold text-secondary">${escapeHTML(b)}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Target Operational Parameters Grid -->
            <h4 class="h5 fw-bold mt-4 mb-3 text-dark">Target Flight &amp; Misting Parameters</h4>
            <div class="svc-param-grid">
              <div class="svc-param-card">
                <span class="lbl"><i class="bi bi-arrows-vertical text-agro me-1"></i>Flight Altitude</span>
                <strong class="val">${details.params.altitude}</strong>
              </div>
              <div class="svc-param-card">
                <span class="lbl"><i class="bi bi-speedometer2 text-agro me-1"></i>Ground Speed</span>
                <strong class="val">${details.params.speed}</strong>
              </div>
              <div class="svc-param-card">
                <span class="lbl"><i class="bi bi-droplet-half text-agro me-1"></i>Droplet Micron</span>
                <strong class="val">${details.params.droplet}</strong>
              </div>
              <div class="svc-param-card">
                <span class="lbl"><i class="bi bi-water text-agro me-1"></i>Carrier Liquid</span>
                <strong class="val">${details.params.carrier}</strong>
              </div>
            </div>

            <!-- Target Pests & Diseases Grid -->
            <h4 class="h5 fw-bold mt-4 mb-3 text-dark">Target Pests, Pathogens &amp; Stress Factors</h4>
            <div class="svc-pest-grid mb-4">
              ${details.pests.map(p => `
                <div class="svc-pest-item">
                  <i class="bi bi-check-circle-fill text-success fs-6"></i>
                  <span>${escapeHTML(p)}</span>
                </div>
              `).join('')}
            </div>

            <!-- Chemical Compatibility Callout Box -->
            <div class="p-3 p-md-4 rounded-4 border bg-card shadow-sm my-4" style="border-left: 4px solid var(--g) !important;">
              <div class="d-flex align-items-start gap-3">
                <i class="bi bi-flask-fill text-agro fs-3 mt-1 flex-shrink-0"></i>
                <div>
                  <h6 class="fw-bold mb-1 text-dark">Formulations &amp; Tank-Mix Chemistry</h6>
                  <p class="small text-muted mb-0" style="line-height: 1.6;">${details.chemistry}</p>
                </div>
              </div>
            </div>

            <!-- Farmer Preparation Requirements & Safety Precautions -->
            <div class="row g-4 my-3">
              <div class="col-md-6">
                <div class="p-3.5 rounded-4 border bg-card h-100 shadow-xs">
                  <h5 class="fw-bold text-dark h6 mb-3 d-flex align-items-center gap-2">
                    <i class="bi bi-clipboard-check-fill text-agro fs-5"></i>
                    <span>Farmer Preparation Checklist</span>
                  </h5>
                  <ul class="list-unstyled mb-0 small text-secondary d-flex flex-column gap-2">
                    ${(details.prep || []).map(item => `
                      <li class="d-flex align-items-start gap-2">
                        <i class="bi bi-check-circle text-success mt-0.5 flex-shrink-0"></i>
                        <span>${escapeHTML(item)}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3.5 rounded-4 border bg-card h-100 shadow-xs">
                  <h5 class="fw-bold text-dark h6 mb-3 d-flex align-items-center gap-2">
                    <i class="bi bi-shield-lock-fill text-warning fs-5"></i>
                    <span>Safety Protocols &amp; Precautions</span>
                  </h5>
                  <ul class="list-unstyled mb-0 small text-secondary d-flex flex-column gap-2">
                    ${(details.safety || []).map(item => `
                      <li class="d-flex align-items-start gap-2">
                        <i class="bi bi-exclamation-triangle-fill text-warning mt-0.5 flex-shrink-0"></i>
                        <span>${escapeHTML(item)}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Standard Operating Procedure Steps -->
            <h3 class="h4 fw-bold mt-4 mb-3 text-dark d-flex align-items-center gap-2">
              <i class="bi bi-list-check text-agro fs-4"></i>
              <span>3. Standard Operating Procedure (SOP)</span>
            </h3>
            <div class="article-step-list mb-4">
              ${details.sop.map((st, i) => `
                <div class="article-step-item">
                  <span class="article-step-num">${i + 1}</span>
                  <div>
                    <h6 class="fw-bold mb-1 text-dark">${escapeHTML(st.title)}</h6>
                    <p class="small text-muted mb-0" style="line-height: 1.6;">${escapeHTML(st.desc)}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Crop-Specific FAQ Accordion -->
            <h3 class="h4 fw-bold mt-5 mb-3 text-dark d-flex align-items-center gap-2">
              <i class="bi bi-question-circle-fill text-agro fs-4"></i>
              <span>Frequently Asked Questions ? ${escapeHTML(s.t)}</span>
            </h3>
            <div class="accordion faq mb-5" id="svcSpecificFaq">
              ${details.faqs.map((f, i) => `
                <div class="accordion-item">
                  <h2 class="accordion-header" id="heading${i}">
                    <button class="accordion-button ${i === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="collapse${i}">
                      ${escapeHTML(f.q)}
                    </button>
                  </h2>
                  <div id="collapse${i}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" aria-labelledby="heading${i}" data-bs-parent="#svcSpecificFaq">
                    <div class="accordion-body">
                      ${escapeHTML(f.a)}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Related Services Section -->
            <div class="mt-5 pt-4 border-top">
              <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                <h4 class="h5 fw-bold text-dark mb-0">Related Drone Spraying Services</h4>
                <a href="services.html" class="small fw-semibold text-agro text-decoration-none">
                  View All Services <i class="bi bi-arrow-right"></i>
                </a>
              </div>
              <div class="row g-3">
                ${SERVICES.filter((_, idx) => idx !== serviceId).slice(0, 3).map((relSvc) => {
                  const relIdx = SERVICES.findIndex(sv => sv.id === relSvc.id);
                  return `
                    <div class="col-sm-4">
                      <div class="card h-100 border rounded-4 overflow-hidden shadow-xs d-flex flex-column">
                        <img src="${getImgUrl(relSvc.img, 400)}" alt="${escapeHTML(relSvc.t)}" class="card-img-top" style="height: 120px; object-fit: cover;">
                        <div class="p-3 d-flex flex-column flex-grow-1">
                          <h6 class="fw-bold mb-1 text-truncate" title="${escapeHTML(relSvc.t)}">${escapeHTML(relSvc.t)}</h6>
                          <div class="text-success small fw-bold mb-2">&#8377;${relSvc.rate} / Acre</div>
                          <a href="service-details.html?s=${relIdx}" class="btn btn-outline-agro btn-sm mt-auto w-100 fw-semibold">
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Bottom Back & Book Action Bar -->
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-5 pt-3 border-top">
              <a href="services.html" class="btn btn-outline-secondary px-4 py-2.5 rounded-pill fw-semibold">
                <i class="bi bi-arrow-left me-1"></i> Back to Services
              </a>
              <a href="${ROOT}dashboard/book-spraying.html ? service=${encodeURIComponent(s.t)}&crop=${encodeURIComponent(s.crops[0] || 'Crop')}" class="btn btn-agro px-4 py-2.5 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                <i class="bi bi-calendar-check-fill"></i>
                <span>Book ${escapeHTML(s.t)}</span>
              </a>
            </div>
          </div>

          <!-- Sticky Booking & Rate Card Sidebar -->
          <div class="col-lg-4">
            <div class="svc-sticky-card">
              <!-- Pricing & Dynamic Estimator Card -->
              <div class="dcard p-4 mb-4 shadow-sm border rounded-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted small fw-bold text-uppercase tracking-wider">Commercial Rate</span>
                  <span class="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill fw-semibold">
                    Instant Booking
                  </span>
                </div>
                <div class="d-flex align-items-baseline gap-1 mb-2">
                  <span class="display-6 fw-bold text-success font-monospace" id="svcRateDisplay">&#8377;${s.rate}</span>
                  <span class="text-muted small fw-semibold">/ acre</span>
                </div>
                <div class="p-2 mb-3 bg-light rounded-3 small text-muted border border-light-subtle">
                  <i class="bi bi-info-circle text-agro me-1"></i>
                  <strong>Indicative Base Rate:</strong> Final quotation is confirmed post automated RTK GIS farm boundary survey.
                </div>
                <p class="small text-muted mb-3">Includes DGCA-certified remote pilot crew, RTK telemetry mapping, de-silted carrier water, and digital spray audit certificate.</p>

                <!-- Acreage Calculator Box -->
                <div class="svc-estimator-box">
                  <label class="form-label small fw-bold text-dark d-flex justify-content-between mb-1" for="svcEstAcreage">
                    <span>Calculate Your Farm Cost:</span>
                    <span class="text-agro fw-bold" id="svcEstAcreLabel">5 Acres</span>
                  </label>
                  <div class="input-group input-group-sm mb-2">
                    <input type="number" id="svcEstAcreage" class="form-control fw-bold" min="1" max="500" value="5" aria-label="Acreage">
                    <span class="input-group-text bg-light text-muted">Acres</span>
                  </div>
                  <div class="d-flex justify-content-between small text-muted border-top pt-2 mt-2">
                    <span>Estimated Total:</span>
                    <strong class="text-success fs-6 font-monospace" id="svcEstTotal">&#8377;${(s.rate * 5).toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <!-- Rate Tiers Table -->
                <h6 class="fw-bold mb-2 small text-dark text-uppercase tracking-wider">Volume Discount Tiers</h6>
                <div class="svc-spec-table mb-4">
                  <div class="svc-spec-row">
                    <span class="text-muted">1 to 5 Acres</span>
                    <strong class="font-monospace text-dark">&#8377;${s.rate}/Ac (Standard)</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">6 to 15 Acres</span>
                    <strong class="font-monospace text-success">&#8377;${Math.round(s.rate * 0.92)}/Ac (8% Off)</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">16+ Acres</span>
                    <strong class="font-monospace text-success">&#8377;${Math.round(s.rate * 0.85)}/Ac (15% Off)</strong>
                  </div>
                </div>

                <a id="btnBookServiceDirect" class="btn btn-agro w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" href="${ROOT}dashboard/book-spraying.html ? service=${encodeURIComponent(s.t)}&crop=${encodeURIComponent(s.crops[0] || 'Crop')}">
                  <i class="bi bi-calendar-check-fill"></i>
                  <span>Book This Service Now</span>
                </a>
              </div>

              <!-- Technical Drone Platform Specs -->
              <div class="dcard p-4 shadow-sm border rounded-4 mb-4">
                <h6 class="fw-bold mb-3 small text-dark text-uppercase tracking-wider d-flex align-items-center gap-2">
                  <i class="bi bi-gear-wide-connected text-agro"></i>
                  <span>Flight Specifications</span>
                </h6>
                <div class="svc-spec-table">
                  <div class="svc-spec-row">
                    <span class="text-muted">Aircraft Platform</span>
                    <strong class="text-dark">AgroFly Pro-16 Hexacopter</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">Type Certification</span>
                    <strong class="text-success">DGCA Certified Fleet</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">Positioning</span>
                    <strong class="text-dark">Dual RTK GNSS (±1.5 cm)</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">Obstacle Avoidance</span>
                    <strong class="text-dark">40m Spherical Radar</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">Effective Swath</span>
                    <strong class="text-dark">4.5m ? 6.0m Overlap</strong>
                  </div>
                  <div class="svc-spec-row">
                    <span class="text-muted">Weather Tolerance</span>
                    <strong class="text-dark">Winds â‰¤ 8 m/s A IP67</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Dynamic Acreage Estimator Handler
    const acreInput = document.getElementById('svcEstAcreage');
    const acreLabel = document.getElementById('svcEstAcreLabel');
    const totalDisplay = document.getElementById('svcEstTotal');
    const directBookBtn = document.getElementById('btnBookServiceDirect');

    if (acreInput && totalDisplay) {
      acreInput.addEventListener('input', () => {
        let acres = parseFloat(acreInput.value) || 1;
        if (acres < 1) acres = 1;
        if (acres > 1000) acres = 1000;

        let unitRate = s.rate;
        if (acres >= 16) {
          unitRate = Math.round(s.rate * 0.85);
        } else if (acres >= 6) {
          unitRate = Math.round(s.rate * 0.92);
        }

        const totalCost = Math.round(acres * unitRate);
        if (acreLabel) acreLabel.textContent = `${acres} Acre${acres > 1 ? 's' : ''}`;
        totalDisplay.textContent = `&#8377;${totalCost.toLocaleString('en-IN')}`;

        if (directBookBtn) {
          directBookBtn.href = `${ROOT}dashboard/book-spraying.html ? svc=${s.id}&crop=${encodeURIComponent(s.crops[0] || 'Crop')}&acres=${acres}`;
        }
      });
    }
  };

  const setupBlogPage = () => {
    const grid = document.getElementById('blogGrid');
    const searchInput = document.getElementById('blogSearch');
    const filtersContainer = document.getElementById('blogFilters');
    const pager = document.getElementById('blogPager');
    if (!grid || !searchInput || !filtersContainer) return;

    if (pager) {
      const pagerNav = pager.closest('nav');
      if (pagerNav) pagerNav.style.display = 'none';
      pager.style.display = 'none';
    }

    let currentCategory = 'All';
    let searchQuery = '';

    const categories = ['All', 'Precision Agriculture', 'Drone Spraying', 'Crop Protection', 'Crop Nutrition', 'Sustainable Farming'];
    filtersContainer.innerHTML = categories.map((cat, idx) => `
      <button type="button" class="${idx === 0 ? 'on' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');

    const renderBlogList = () => {
      const filtered = BLOG_POSTS.filter(b => {
        const matchesCat = currentCategory === 'All' || b.c === currentCategory;
        const matchesQuery = (b.t + b.ex + b.c + b.a).toLowerCase().includes(searchQuery);
        return matchesCat && matchesQuery;
      });

      // Display all 12 cards in 4 complete rows (3 per row on desktop) without pagination
      grid.innerHTML = filtered.map(renderBlogCard).join('') || `
        <div class="col-12 text-center py-5">
          <p class="text-muted fs-5">No articles found matching "${escapeHTML(searchQuery)}".</p>
        </div>
      `;

      observeRevealElements();
    };

    filtersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      currentCategory = btn.dataset.cat;
      $$('button', filtersContainer).forEach(b => b.classList.toggle('on', b === btn));
      renderBlogList();
    });

    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      renderBlogList();
    });

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('q')) {
      searchInput.value = urlParams.get('q');
      searchQuery = urlParams.get('q').toLowerCase();
    }
    if (urlParams.get('cat')) {
      currentCategory = urlParams.get('cat');
      $$('button', filtersContainer).forEach(b => b.classList.toggle('on', b.dataset.cat === currentCategory));
    }

    renderBlogList();
  };

  const setupBlogDetailsPage = () => {
    const articleBox = document.getElementById('art');
    if (!articleBox) return;

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = parseInt(urlParams.get('id'), 10) || 0;
    const post = BLOG_POSTS[blogId] || BLOG_POSTS[0];

    document.title = `${post.t} | AgroFly Agricultural Insights`;
    const heroTitle = $('.page-hero h1');
    const heroDesc = $('.page-hero p');
    const heroBg = $('.page-hero .hero-bg');

    const formattedDate = new Date(post.date + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    if (heroTitle) heroTitle.textContent = post.t;
    if (heroDesc) heroDesc.textContent = `${post.c} • By ${post.a} • ${formattedDate}`;
    if (heroBg) {
      // Hero background matches the clicked post image
      heroBg.src = post.imgUrl || getImgUrl(post.img, 1600);
      heroBg.alt = post.t;
    }

    // Article Content Database tailored for each specific post
    const ARTICLE_EXTRAS = {
      0: {
        subtitle: 'How Centimeter RTK Navigation and Digital Waypoints Eliminate Field Overlaps',
        stats: [
          { val: '±1.5 cm', lbl: 'GNSS RTK Swath Precision' },
          { val: '100%', lbl: 'Zero Overlap or Missed Rows' },
          { val: '14 Days', lbl: 'Advance Stress Identification' },
          { val: '35%', lbl: 'Reduced Active Chemical Inputs' }
        ],
        params: {
          altitude: '1.8m ? 2.2m above canopy',
          speed: '4.5 ? 5.5 m/s uniform',
          droplet: '120 ? 160 µm fine mist',
          carrier: '8 ? 12 Litres / Acre'
        },
        takeaway: 'RTK centimeter accuracy enables exact repeatable flight tracks across undulating terraced fields. Ensure the RTK mobile base station maintains line-of-sight telemetry with at least 18 tracked satellites for sub-inch precision.',
        steps: [
          { title: 'Boundary Polygon GIS Mapping', desc: 'Pilots fly an automated perimeter reconnaissance sweep, logging geo-fenced boundaries and marking hazards like power lines and irrigation canals.' },
          { title: 'Prescription Waypoint Generation', desc: 'The flight computer automatically computes optimum track heading, rotor overlap margins, and speed-synchronized spray rates.' },
          { title: 'Autonomous Swath Execution', desc: 'Drone carries out millimeter-accurate flight lines, adjusting dynamic pump output in real time based on instantaneous ground speed.' },
          { title: 'Post-Mission Quality Audit', desc: 'Digital KML mission logs and spray completion certificates are exported directly to the farmer\'s mobile dashboard.' }
        ]
      },
      1: {
        subtitle: 'Economic & Safety Advantages of Ultra-Low Volume Rotary Atomization',
        stats: [
          { val: '90%', lbl: 'Water Conserved vs Knapsack' },
          { val: '6 Mins', lbl: 'Average Spray Time Per Acre' },
          { val: 'Zero', lbl: 'Direct Worker Toxic Exposure' },
          { val: '&#8377;650', lbl: 'Average Savings Per Acre' }
        ],
        params: {
          altitude: '1.5m ? 2.0m above canopy',
          speed: '4.8 ? 6.0 m/s',
          droplet: '90 ? 140 µm controlled',
          carrier: '10 ? 14 Litres / Acre'
        },
        takeaway: 'Traditional knapsack spraying requires up to 200 litres of water per acre, posing massive hauling labor costs. AgroFly rotary atomizers reduce carrier water to 10 litres, delivering higher active ingredient contact density.',
        steps: [
          { title: 'Concentrated Chemical Preparation', desc: 'Active fungicides or insecticides are metered with surfactant adjuvants designed specifically for ultra-low volume aerial misting.' },
          { title: 'Centrifugal Nozzle Calibration', desc: 'High-torque brushless atomizer discs are dialed to match liquid viscosity and ambient relative humidity.' },
          { title: 'Prop Wash Canopy Penetration', desc: 'Downward rotor aerodynamic downdraft actively separates dense leaves, depositing active droplets on both upper and lower leaf surfaces.' },
          { title: 'Immediate Drift-Free Clean Up', desc: 'Mission concludes with automated line purging and instant verification of zero off-target chemical drift.' }
        ]
      },
      2: {
        subtitle: 'Protecting Tillering Stems & Yield Without Compacting Submerged Paddy Soil',
        stats: [
          { val: 'Zero', lbl: 'Root Trampling & Mud Ruts' },
          { val: '+8.2%', lbl: 'Harvest Yield Improvement' },
          { val: '8 L/Ac', lbl: 'Calibrated Water Carrier' },
          { val: '100%', lbl: 'Tiller Base Spray Saturation' }
        ],
        params: {
          altitude: '1.6m ? 2.0m above water line',
          speed: '4.2 ? 5.0 m/s',
          droplet: '110 ? 150 µm',
          carrier: '8 ? 10 Litres / Acre'
        },
        takeaway: 'In flooded paddy fields during tillering and panicle initiation, foot traffic and tractor tires cause irrecoverable root shearing. Drone flight operates completely decoupled from soil moisture, eliminating all field disturbance.',
        steps: [
          { title: 'Flooded Field Boundary Telemetry', desc: 'Water boundaries and bund perimeters are logged via high-contrast optical sensors, preventing spray drift into irrigation drains.' },
          { title: 'Systemic Fungicide Emulsion', desc: 'Formulations targeting sheath blight and blast are blended with rainfast silicone adjuvants for fast foliar adherence.' },
          { title: 'Downdraft Waterline Penetration', desc: 'Propeller wind wash parts the dense paddy crop canopy, pushing micro-droplets directly to the bottom tiller nodes where brown planthoppers breed.' },
          { title: 'Rapid Re-Entry Clearance', desc: 'Fields are fully treated in minutes, with active protection established without muddying water or disturbing beneficial aquatic fauna.' }
        ]
      },
      3: {
        subtitle: 'Canopy Vortex Inversion for Lower-Leaf Whitefly and Pink Bollworm Control',
        stats: [
          { val: '100%', lbl: 'Underside Leaf Coating' },
          { val: '35%', lbl: 'Chemical Input Reduction' },
          { val: '12 Min', lbl: 'Turnaround Per Sortie' },
          { val: 'Zero', lbl: 'Square Drop Devastation' }
        ],
        params: {
          altitude: '1.8m ? 2.4m above cotton',
          speed: '4.0 ? 5.0 m/s',
          droplet: '100 ? 130 µm micro-spray',
          carrier: '10 ? 12 Litres / Acre'
        },
        takeaway: 'Whiteflies, aphids, and early-instar bollworm larvae shelter exclusively beneath broad cotton foliage. Standard tractor booms spray downward from above, failing to reach lower surfaces. Multirotor vortices flip the leaves mid-air.',
        steps: [
          { title: 'Pest Scouting & Density Mapping', desc: 'Field agronomists identify egg clutches and nymph hotspots to program variable-rate target zones.' },
          { title: 'Droplet Spectrum Modulation', desc: 'Atomizers are tuned to 110 microns to ensure microscopic droplets drift into dense mid-canopy whorls without falling to ground.' },
          { title: 'Vortex Inversion Flight Sweep', desc: 'Downwash rotor wake creates controlled turbulence that rolls leaves 180 degrees, applying uniform chemical contact on leaf undersides.' },
          { title: 'Residual Protective Barrier', desc: 'Systemic insecticide creates a 21-day residual defense against emerging bollworm broods and secondary sucking pest vectors.' }
        ]
      },
      4: {
        subtitle: 'Direct Stomatal Nutrition via Liquid Nano-Urea and Micronutrient Dispersion',
        stats: [
          { val: '95%', lbl: 'Immediate Stomatal Bio-Uptake' },
          { val: '4Ã—', lbl: 'Faster Foliar Absorption' },
          { val: '0%', lbl: 'Soil Runoff & Nitrate Leaching' },
          { val: '+14%', lbl: 'Vegetative Biomass Boost' }
        ],
        params: {
          altitude: '2.0m ? 2.5m above canopy',
          speed: '4.5 ? 5.2 m/s',
          droplet: '130 ? 180 µm nutrient mist',
          carrier: '12 ? 16 Litres / Acre'
        },
        takeaway: 'Granular urea applied to soil suffers up to 65% loss via ammonia volatilization and deep leaching. Liquid Nano-Urea sprayed aerially during morning stomatal transpiration achieves over 90% direct plant absorption within hours.',
        steps: [
          { title: 'Morning Transpiration Window Timing', desc: 'Spraying commences between 6:00 AM and 9:00 AM when stomata are fully dilated and relative humidity exceeds 65%.' },
          { title: 'Nano-Chelated Solution Preparation', desc: 'Liquid Nano-Urea is blended with chelated zinc, boron, and organic bio-stimulants using non-shearing mixing pumps.' },
          { title: 'Micro-Droplet Canopy Misting', desc: 'Drones deposit a uniform micro-sheen across the top and mid canopy without droplet coalescence or leaf runoff.' },
          { title: 'Chlorophyll Vigor Verification', desc: 'Follow-up multispectral scans measure nitrogen assimilation index within 72 hours post application.' }
        ]
      },
      5: {
        subtitle: 'Preserving Village Watersheds and Soil Ecology with Ultra-Fine Atomization',
        stats: [
          { val: '35%', lbl: 'Active Chemical Reduction' },
          { val: '100%', lbl: 'Non-Target Drift Prevention' },
          { val: '90%', lbl: 'Water Conserved Per Acre' },
          { val: 'Protected', lbl: 'Beneficial Soil Microbiome' }
        ],
        params: {
          altitude: '1.5m ? 2.0m above canopy',
          speed: '4.5 ? 5.0 m/s',
          droplet: '120 ? 150 µm anti-drift',
          carrier: '10 Litres / Acre'
        },
        takeaway: 'Over-spraying with high-volume manual pumps contaminates groundwater, kills beneficial earthworms, and harms predatory pollinators like honeybees. Drone atomization applies the exact biological threshold required.',
        steps: [
          { title: 'Ecological Sensitive Buffer Zones', desc: 'Automatic 15-meter GPS buffer strips are established along village water bodies, bee hives, and residential zones.' },
          { title: 'Targeted Bio-Pesticide Selection', desc: 'Prioritizing biological formulations like Bacillus thuringiensis (Bt) and neem triterpenoids with low non-target toxicity.' },
          { title: 'Precision Swath Confined Flight', desc: 'Downward prop wash prevents atmospheric thermal plumes from carrying active chemical outside designated crop plots.' },
          { title: 'Zero Ground Runoff Validation', desc: 'Absence of chemical pooling preserves soil mycorrhizal fungi and beneficial beneficial insect predator populations.' }
        ]
      },
      6: {
        subtitle: 'Centimeter-Level Swath Accuracy & Autonomous Radar Hazard Avoidance',
        stats: [
          { val: '±1.5 cm', lbl: 'RTK Sub-Inch Repeatability' },
          { val: '40m', lbl: 'Spherical Obstacle Detection' },
          { val: '0.5m-30m', lbl: 'Terrain Follow Radar' },
          { val: '100%', lbl: 'Digital Flight Telemetry Audit' }
        ],
        params: {
          altitude: '1.5m ? 3.0m dynamic radar',
          speed: '5.0 ? 6.5 m/s auto',
          droplet: '100 ? 250 µm programmable',
          carrier: '8 ? 14 Litres / Acre'
        },
        takeaway: 'High-voltage power lines, coconut palms, and sloped terrain present significant flight hazards. Phased-array millimeter-wave radar continuously maps obstacles 40 meters ahead, executing automatic avoidance maneuvers.',
        steps: [
          { title: 'Multi-Frequency Base Station Lock', desc: 'Dual-antenna RTK receivers link with GPS, GLONASS, Galileo, and BeiDou satellite constellations for centimeter positioning.' },
          { title: 'Digital Elevation Model Synchronization', desc: 'Terrain-following radar continuously reads ground distance at 100 Hz, maintaining identical flight height over undulating hills.' },
          { title: 'Dynamic Speed-Flow Coupling', desc: 'If the drone slows for a tree or boundary turn, spray pumps instantaneously reduce flow rate to prevent over-dosing.' },
          { title: 'Encrypted Telemetry Archival', desc: 'Every flight path coordinate, dosage rate, and timestamp is stored in tamper-proof GeoJSON format for insurance and traceability.' }
        ]
      },
      7: {
        subtitle: 'Halting Fall Armyworm and Locust Invasions with Same-Day Drone Mobilization',
        stats: [
          { val: '< 24 Hours', lbl: 'Emergency Hub Deployment' },
          { val: '100+ Ac', lbl: 'Daily Coordinated Coverage' },
          { val: '98.5%', lbl: 'Instant Larval Mortality' },
          { val: 'Zero', lbl: 'Neighboring Crop Outbreaks' }
        ],
        params: {
          altitude: '1.5m ? 2.0m low pass',
          speed: '5.0 m/s rapid sweep',
          droplet: '100 ? 140 µm fast contact',
          carrier: '10 Litres / Acre'
        },
        takeaway: 'Invasive pests like Spodoptera frugiperda (fall armyworm) can consume an entire corn field within 48 hours. AgroFly rapid-response dispatch centers mobilize multi-drone teams within hours of farmer booking.',
        steps: [
          { title: 'Urgent Digital Plot Registration', desc: 'Farmer submits field location and crop photo via dashboard; local hub immediately dispatches DGCA flight crew.' },
          { title: 'Cluster Grid Strategy', desc: 'Multiple hexacopters divide the affected acreage into synchronized sectors to surround and neutralize the advancing infestation.' },
          { title: 'Whorl-Penetrating Downwash', desc: 'Powerful rotor wake pushes contact bio-chemicals deep into the central apical whorl where armyworm larvae feed.' },
          { title: 'Infestation Containment Report', desc: 'High-resolution post-spray photo audit confirms mortality of early-instar caterpillars and cessation of leaf skeletonization.' }
        ]
      },
      8: {
        subtitle: 'Pre-Visual Stress Diagnostics Using Near-Infrared and Red Edge Sensors',
        stats: [
          { val: '±2 cm/px', lbl: 'Multispectral Spatial Resolution' },
          { val: '14 Days', lbl: 'Early Chlorosis Detection' },
          { val: '5 Bands', lbl: 'Spectral Imaging Channels' },
          { val: '80%', lbl: 'Spot Treatment Savings' }
        ],
        params: {
          altitude: '30m ? 50m scout pass',
          speed: '8.0 ? 10.0 m/s mapping',
          droplet: 'Diagnostic Imaging Pass',
          carrier: 'Prescription Map Generation'
        },
        takeaway: 'Healthy vegetation reflects high amounts of near-infrared (NIR) light while absorbing red wavelengths for photosynthesis. Multispectral sensors detect drops in cell wall hydration and chlorophyll before leaves turn yellow.',
        steps: [
          { title: 'High-Altitude Aerial Survey', desc: 'Drone equipped with calibrated 5-band multispectral camera flies an automated grid survey capturing geo-tagged radiance data.' },
          { title: 'Photogrammetric Orthomosaic Stitching', desc: 'Cloud GIS algorithms stitch thousands of raw frames into a calibrated, seamless orthophoto map.' },
          { title: 'NDVI & NDRE Vegetation Index Computation', desc: 'Color-coded heat maps classify field vigor into high, moderate, stressed, and barren management zones.' },
          { title: 'Variable-Rate Spray Prescription', desc: 'Prescription files load directly into spraying drones to apply nutrients and fungicides exclusively to stressed zones.' }
        ]
      },
      9: {
        subtitle: 'How Smallholder Cooperatives and FPOs Unlock Commercial Aerial Economies',
        stats: [
          { val: '60%', lbl: 'Labor Cost Reductions' },
          { val: '1 Day', lbl: 'Village Cluster Turnaround' },
          { val: '&#8377;420/Ac', lbl: 'Affordable FPO Group Rate' },
          { val: '100%', lbl: 'Modern Tech Access' }
        ],
        params: {
          altitude: '1.8m ? 2.2m',
          speed: '5.0 m/s',
          droplet: '110 ? 160 µm',
          carrier: '10 Litres / Acre'
        },
        takeaway: 'Smallholder farmers with 1-to-2 acre plots often face prohibitive individual contractor rates. By aggregating through Farmer Producer Organizations (FPOs), contiguous plots are treated as a unified mission at wholesale rates.',
        steps: [
          { title: 'Community Acreage Aggregation', desc: 'FPO coordinator collects farmer booking requests into a contiguous 50-to-100 acre cluster booking.' },
          { title: 'Unified Master Boundary Mission', desc: 'AgroFly pilots map individual plot borders while computing a continuous flight route to maximize battery operational efficiency.' },
          { title: 'Consecutive Swath Execution', desc: 'Drone completes plots one after another without landing, lowering mobilization costs and finishing whole hamlets in a single day.' },
          { title: 'Individual Farmer Plot Certificates', desc: 'Each member farmer receives a distinct digital certificate and invoice detailing their exact treated acreage and timestamp.' }
        ]
      },
      10: {
        subtitle: 'Replacing 200 Litres of Knapsack Water with 10 Litres of Controlled Micro-Mist',
        stats: [
          { val: '90%', lbl: 'Water Conserved vs Manual' },
          { val: '190 Litres', lbl: 'Clean Water Saved Per Acre' },
          { val: '10 L/Ac', lbl: 'Carrier Liquid Volume' },
          { val: 'Zero', lbl: 'Water Hauling Vehicle Costs' }
        ],
        params: {
          altitude: '1.6m ? 2.2m',
          speed: '4.8 ? 5.5 m/s',
          droplet: '90 ? 130 µm micro-mist',
          carrier: '8 ? 10 Litres / Acre'
        },
        takeaway: 'In rainfed and drought-affected belts, procuring hundreds of litres of clean water for knapsack spraying is financially and physically crippling. Drone rotary atomization turns a single 10-litre tank into billions of target droplets.',
        steps: [
          { title: 'Clean Water Quality Testing', desc: 'Only 10 litres of water per acre is required; pH and turbidity are checked to maximize adjuvant bio-performance.' },
          { title: 'High-Shear Emulsion Blending', desc: 'Concentrated crop protection chemical is dispersed uniformly through the micro-carrier volume.' },
          { title: 'Controlled Droplet Dispersion', desc: 'Rotary atomizers produce uniform micron droplets that remain suspended in prop downwash, preventing ground runoff.' },
          { title: 'Significant Resource Conservation', desc: 'A 50-acre farm saves nearly 10,000 litres of clean village water on every single seasonal spraying cycle.' }
        ]
      },
      11: {
        subtitle: 'Autonomous Swarm Coordination and 60-FPS Deep Learning Weed Recognition',
        stats: [
          { val: '60 FPS', lbl: 'Edge AI Computer Vision' },
          { val: '80%', lbl: 'Spot Herbicide Reduction' },
          { val: '4 Drones', lbl: 'Mesh Network Swarm' },
          { val: '150+ Ac', lbl: 'Daily Swarm Capacity' }
        ],
        params: {
          altitude: '2.0m ? 3.0m swarm flight',
          speed: '6.0 ? 8.0 m/s',
          droplet: '100 ? 160 µm pulsed',
          carrier: 'Variable Rate / Spot'
        },
        takeaway: 'Future farm operations leverage edge AI neural networks that detect invasive broadleaf weeds in real time. Single solenoid nozzles pulse for milliseconds directly over weed shoots, slashing herbicide usage by 80%.',
        steps: [
          { title: 'Swarm Mission Sectoring', desc: 'A master pilot launches 3 to 4 drones that coordinate via low-latency mesh radio, dividing massive estate blocks automatically.' },
          { title: 'Real-Time Visual Edge Inference', desc: 'High-speed 4K cameras feed onboard neural processing chips that classify crops vs weeds at 60 frames per second.' },
          { title: 'Pulsed Solenoid Spot Spraying', desc: 'Selective micro-bursts of herbicide are sprayed only on weed targets, completely bypassing healthy crop leaves.' },
          { title: 'Automated Battery Hot-Swap Rotation', desc: 'Drones land on automated battery swap decks, swapping fresh packs in 90 seconds for continuous sunrise-to-sunset missions.' }
        ]
      }
    };

    const details = ARTICLE_EXTRAS[post.id] || ARTICLE_EXTRAS[0];

    // Build the Rich, Beautiful Editorial Layout
    articleBox.innerHTML = `
      <div class="article-editorial">
        <!-- Article Meta Bar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 50px; height: 50px; font-size: 1.15rem; background: linear-gradient(135deg, #1b7a45, #104d32) !important;">
              ${post.a.charAt(0)}
            </div>
            <div>
              <div class="fw-bold text-dark fs-6">${escapeHTML(post.a)}</div>
              <small class="text-muted d-block">Senior Agronomist A AgroFly Precision Farming Desk</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-3 text-muted small">
            <span><i class="bi bi-calendar3 me-1 text-agro"></i> ${formattedDate}</span>
            <span><i class="bi bi-clock me-1 text-agro"></i> ${post.rt} min read</span>
            <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill fw-semibold">${escapeHTML(post.c)}</span>
          </div>
        </div>

        <!-- Featured Image: Matches the exact clicked card image -->
        <div class="article-featured-img-wrap">
          <img class="article-featured-img" src="${post.imgUrl || getImgUrl(post.img, 1200)}" alt="${escapeHTML(post.t)}" fetchpriority="high">
          <div class="article-caption">
            <i class="bi bi-camera me-1.5 text-agro"></i>
            <span>Field Case Study: ${escapeHTML(post.t)}</span>
          </div>
        </div>

        <!-- Executive Lead Paragraph -->
        <div class="article-lead">
          ${escapeHTML(post.ex)} ${escapeHTML(details.subtitle)}
        </div>

        <!-- Section 1: In-depth Agronomic Challenge -->
        <h2 class="h3 fw-bold mt-4 mb-3">1. Agronomic Challenge &amp; Field Realities</h2>
        <p>${escapeHTML(post.p1)}</p>
        <p>Across traditional farming practices in southern India, manual backpack spraying consistently results in erratic droplet distribution, uneven chemical penetration, and dangerous toxic exposure for agricultural labourers. Precision aerial drone deployment eliminates these hazards through automated flight paths, uniform downwash agitation, and real-time RTK positioning.</p>

        <!-- KPI Metrics & Statistics Grid -->
        <div class="article-stat-grid my-4">
          ${details.stats.map(s => `
            <div class="article-stat-card">
              <div class="stat-val">${s.val}</div>
              <div class="text-muted small fw-semibold">${s.lbl}</div>
            </div>
          `).join('')}
        </div>

        <!-- Section 2: Technical Field Recommendations -->
        <h2 class="h3 fw-bold mt-4 mb-3">2. Field Recommendations &amp; Technical Analysis</h2>
        <p>${escapeHTML(post.p2)}</p>

        <!-- Key Agronomic Takeaway Callout Box -->
        <div class="article-callout my-4">
          <div class="d-flex align-items-start gap-3">
            <i class="bi bi-lightbulb-fill text-agro fs-3 mt-1 flex-shrink-0"></i>
            <div>
              <h5 class="fw-bold mb-1">Key Agronomic Field Protocol</h5>
              <p class="mb-0 small text-muted" style="line-height: 1.6;">${escapeHTML(details.takeaway)}</p>
            </div>
          </div>
        </div>

        <!-- Operational Parameters Grid -->
        <h3 class="h4 fw-bold mt-4 mb-3">Target Operational Parameters</h3>
        <div class="article-protocol-grid">
          <div class="article-protocol-item">
            <span class="lbl"><i class="bi bi-arrows-vertical text-agro me-1"></i>Flight Altitude</span>
            <strong class="val">${details.params.altitude}</strong>
          </div>
          <div class="article-protocol-item">
            <span class="lbl"><i class="bi bi-speedometer2 text-agro me-1"></i>Flight Speed</span>
            <strong class="val">${details.params.speed}</strong>
          </div>
          <div class="article-protocol-item">
            <span class="lbl"><i class="bi bi-droplet-half text-agro me-1"></i>Droplet Micron</span>
            <strong class="val">${details.params.droplet}</strong>
          </div>
          <div class="article-protocol-item">
            <span class="lbl"><i class="bi bi-water text-agro me-1"></i>Carrier Volume</span>
            <strong class="val">${details.params.carrier}</strong>
          </div>
        </div>

        <!-- Step-by-Step Execution Protocol -->
        <h3 class="h4 fw-bold mt-4 mb-3">Step-by-Step Field Execution Guide</h3>
        <div class="article-step-list">
          ${details.steps.map((st, i) => `
            <div class="article-step-item">
              <span class="article-step-num">${i + 1}</span>
              <div>
                <h6 class="fw-bold mb-1 text-body">${escapeHTML(st.title)}</h6>
                <p class="small text-muted mb-0">${escapeHTML(st.desc)}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Section 3: Conclusion & Economic Impact -->
        <h2 class="h3 fw-bold mt-4 mb-3">3. Economic Impact &amp; Next Steps</h2>
        <p>Precision drone technology bridges the vital gap between agronomic science and on-field execution. By adopting automated aerial spraying, modern commercial farmers not only protect their yields from sudden pest infestations, but also achieve substantial cost savings, conserve scarce ground water, and protect long-term soil microbiome health.</p>

        <!-- Author Bio Card -->
        <div class="article-author-card">
          <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold fs-4 flex-shrink-0 shadow-sm" style="width: 64px; height: 64px; background: linear-gradient(135deg, #1b7a45, #104d32) !important;">
            ${post.a.charAt(0)}
          </div>
          <div>
            <h5 class="fw-bold mb-1">${escapeHTML(post.a)}</h5>
            <p class="text-muted small mb-0">Senior Agronomist at AgroFly. Specialises in precision aerial crop protection, ultra-low volume foliar fertilization, and integrated pest management (IPM) across paddy, cotton, sugarcane, and horticulture ecosystems.</p>
          </div>
        </div>

        <!-- Bottom Actions Bar -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-3 border-top">
          <a href="blog.html" class="btn btn-outline-agro px-4 py-2">
            <i class="bi bi-arrow-left me-1"></i> Back to All Articles
          </a>
          <a href="dashboard/book-spraying.html" class="btn btn-agro px-4 py-2">
            <i class="bi bi-calendar-check me-1"></i> Book Drone Service
          </a>
        </div>
      </div>
    `;

    // Sidebar: Recent Posts (4 items)
    const recentContainer = document.getElementById('recent');
    if (recentContainer) {
      recentContainer.innerHTML = BLOG_POSTS.slice(0, 4).map(p => `
        <a class="d-flex gap-3 mb-3 align-items-center text-decoration-none group" href="blog-details.html?id=${p.id}">
          <img style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover;" loading="lazy" src="${getImgUrl(p.img, 160)}" alt="${escapeHTML(p.t)}">
          <div>
            <strong class="d-block text-dark small" style="line-height: 1.35;">${escapeHTML(p.t)}</strong>
            <small class="text-muted"><i class="bi bi-clock me-1"></i> ${p.rt} min read</small>
          </div>
        </a>
      `).join('');
    }

    // Sidebar: Popular Articles (3 items)
    const popularContainer = document.getElementById('popularPosts');
    if (popularContainer) {
      popularContainer.innerHTML = BLOG_POSTS.slice(4, 7).map(p => `
        <a class="d-flex gap-3 mb-3 align-items-center text-decoration-none group" href="blog-details.html?id=${p.id}">
          <img style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover;" loading="lazy" src="${getImgUrl(p.img, 160)}" alt="${escapeHTML(p.t)}">
          <div>
            <strong class="d-block text-dark small" style="line-height: 1.35;">${escapeHTML(p.t)}</strong>
            <small class="text-agro fw-semibold">${escapeHTML(p.c)}</small>
          </div>
        </a>
      `).join('');
    }

    // Sidebar: Categories
    const catsContainer = document.getElementById('cats');
    if (catsContainer) {
      const uniqueCats = [...new Set(BLOG_POSTS.map(b => b.c))];
      catsContainer.innerHTML = uniqueCats.map(c => `
        <a class="badge-c me-1 mb-1 text-decoration-none" href="blog.html ? cat=${encodeURIComponent(c)}">${escapeHTML(c)}</a>
      `).join('');
    }

    // Sidebar: Search Form
    const sideSearch = document.getElementById('sideSearch');
    if (sideSearch) {
      sideSearch.onsubmit = (e) => {
        e.preventDefault();
        const input = $('input', sideSearch);
        if (input && input.value.trim()) {
          window.location.href = `blog.html ? q=${encodeURIComponent(input.value.trim())}`;
        }
      };
    }

    // Bottom Related Articles (Genuinely related articles matching category/topics)
    const relatedContainer = document.querySelector('[data-r="related-blog"]');
    if (relatedContainer) {
      // Prioritize same category first, then remaining
      const sameCategory = BLOG_POSTS.filter(b => b.id !== post.id && b.c === post.c);
      const otherCategory = BLOG_POSTS.filter(b => b.id !== post.id && b.c !== post.c);
      const related = [...sameCategory, ...otherCategory].slice(0, 3);

      relatedContainer.innerHTML = related.map(b => {
        const formattedDate = new Date(b.date + 'T00:00:00').toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
        return `
          <div class="col-md-6 col-lg-4">
            <article class="bcard card-lift h-100 reveal">
              <a class="th" href="blog-details.html?id=${b.id}">
                <img loading="lazy" src="${b.imgUrl || getImgUrl(b.img, 650)}" alt="${escapeHTML(b.t)}">
                <span class="chip">${escapeHTML(b.c)}</span>
              </a>
              <div class="bd d-flex flex-column flex-grow-1 p-3 pt-2.5">
                <div class="meta mb-1">
                  <span><i class="bi bi-clock me-1 text-agro"></i>${b.rt} min read</span>
                  <span class="mx-1 text-muted">A</span>
                  <span><i class="bi bi-calendar3 me-1 text-agro"></i>${formattedDate}</span>
                </div>
                <h5><a href="blog-details.html?id=${b.id}">${escapeHTML(b.t)}</a></h5>
                <p class="muted">${escapeHTML(b.ex)}</p>
                <a class="rm mt-auto" href="blog-details.html?id=${b.id}">
                  <span>Read Article</span>
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </article>
          </div>
        `;
      }).join('');
    }
  };

    const setupComingSoonCountdown = () => {
    const cd = document.getElementById('cd');
    if (!cd) return;

    let targetTime = localStorage.getItem('agro_cd_time');
    if (!targetTime) {
      targetTime = Date.now() + 28 * 24 * 60 * 60 * 1000; // 28 days
      localStorage.setItem('agro_cd_time', targetTime);
    }

    const updateTimer = () => {
      const remainingSeconds = Math.max(0, Math.floor((parseInt(targetTime, 10) - Date.now()) / 1000));
      const days = Math.floor(remainingSeconds / 86400);
      const hours = Math.floor((remainingSeconds % 86400) / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;

      const units = [
        ['Days', days],
        ['Hours', hours],
        ['Mins', minutes],
        ['Secs', seconds]
      ];

      cd.innerHTML = units.map(u => `
        <div>
          <b>${u[1]}</b>
          <span>${u[0]}</span>
        </div>
      `).join('');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  };

  const setupContactForm = () => {
    const form = document.querySelector('[data-form="contact"]');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!window.AgroValidator.validateForm(form)) return;

      const nameVal = document.getElementById('cn').value;
      showModal(
        'Message Sent Successfully',
        `<p>Thank you, <strong>${escapeHTML(nameVal)}</strong>! We have received your inquiry. An AgroFly agronomy specialist will contact you on your registered phone within one business day.</p>`
      );
      form.reset();
    });
  };

  const setupNewsletterForms = () => {
    $$('[data-form="news"]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!window.AgroValidator.validateForm(form)) return;
        showToast('Thank you for subscribing to AgroFly agricultural insights!');
        form.reset();
      });
    });
  };

  // 4. Scroll Reveal & Counters (IntersectionObserver)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  const runCounter = (el) => {
    const target = parseInt(el.dataset.to, 10) || 0;
    const startTime = performance.now();
    const duration = 1500;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(target * ease).toLocaleString('en-IN');
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const observeRevealElements = () => {
    $$('.reveal:not(.observed)').forEach(el => {
      el.classList.add('observed');
      revealObserver.observe(el);
    });

    $$('.count:not(.observed)').forEach(el => {
      el.classList.add('observed');
      counterObserver.observe(el);
    });
  };

  // Parallax helper for Home 2 video card
  const setupParallax = () => {
    const el = document.querySelector('[data-parallax]');
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        el.style.transform = `translateY(${scrolled * -0.045}px)`;
      }
    }, { passive: true });
  };

  // Sticky navbar shadow on scroll
  const setupNavbarScroll = () => {
    const header = document.getElementById('hdr') || document.getElementById('authHdr');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    }, { passive: true });
  };

  // Active navigation link highlighting
  const highlightActiveNav = () => {
    const page = document.body.dataset.page || '';
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    $$('.navbar .nav-link, .navbar .dropdown-item').forEach(el => el.classList.remove('active'));

    if (path === '' || path === 'index.html' || path === 'home-2.html' || page.startsWith('home')) {
      const homeLink = $('.nav-item.dropdown > a.nav-link');
      if (homeLink) homeLink.classList.add('active');
      const targetSub = $(`a.dropdown-item[href="${path === 'home-2.html' ? 'home-2.html' : 'index.html'}"]`);
      if (targetSub) targetSub.classList.add('active');
    } else if (path === 'about.html' || page === 'about') {
      const el = $('a.nav-link[href="about.html"]');
      if (el) el.classList.add('active');
    } else if (path.startsWith('service') || page.startsWith('service')) {
      const el = $('a.nav-link[href="services.html"]');
      if (el) el.classList.add('active');
    } else if (path === 'pricing.html' || page === 'pricing') {
      const el = $('a.nav-link[href="pricing.html"]');
      if (el) el.classList.add('active');
    } else if (path.startsWith('blog') || page.startsWith('blog')) {
      const el = $('a.nav-link[href="blog.html"]');
      if (el) el.classList.add('active');
    } else if (path === 'contact.html' || page === 'contact') {
      const el = $('a.nav-link[href="contact.html"]');
      if (el) el.classList.add('active');
    } else if (path.includes('dashboard') || page.startsWith('d-')) {
      const el = $('a.nav-link[href*="dashboard"]');
      if (el) el.classList.add('active');
    }
  };

  // Bulletproof Mobile Navbar Toggle & Return-Click Handler
  const setupMobileNavToggle = () => {
    const togglers = document.querySelectorAll('.navbar-toggler');
    const mnav = document.getElementById('mnav');
    if (!mnav || !togglers.length) return;

    // Disarm any conflicting Bootstrap Collapse instance on mnav
    if (window.bootstrap && bootstrap.Collapse) {
      const bsCollapse = bootstrap.Collapse.getInstance(mnav);
      if (bsCollapse) {
        try { bsCollapse.dispose(); } catch (_) {}
      }
    }

    // Create backdrop element if it doesn't exist
    let backdrop = document.getElementById('mnavBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'mnavBackdrop';
      backdrop.className = 'mnav-backdrop';
      document.body.appendChild(backdrop);
    }

    const closeMobileNav = () => {
      mnav.classList.remove('show');
      if (backdrop) backdrop.classList.remove('show');
      togglers.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-list';
        }
      });
      mnav.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
    };

    const openMobileNav = () => {
      mnav.classList.add('show');
      if (backdrop) backdrop.classList.add('show');
      togglers.forEach(btn => {
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation menu');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'bi bi-x-lg';
        }
      });
    };

    const toggleMobileNav = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (mnav.classList.contains('show')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    };

    // Neutralize conflicting Bootstrap collapse attributes & attach clean toggle handlers
    togglers.forEach(btn => {
      btn.removeAttribute('data-bs-toggle');
      btn.removeAttribute('data-bs-target');
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', toggleMobileNav);
      btn.addEventListener('touchend', (e) => {
        // Prevent touchend on toggler from leaking to document outside-click handler
        e.stopPropagation();
      });
    });

    // Return-click on backdrop closes immediately
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
    });
    backdrop.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeMobileNav();
    }, { passive: false });

    // Return-click anywhere outside closes mobile nav (guarded against theme/rtl toggles)
    const handleOutsideClick = (e) => {
      if (e.target.closest('.js-theme, .js-rtl, .navbar-toggler')) return;
      if (window.innerWidth < 992 && mnav.classList.contains('show')) {
        if (!mnav.contains(e.target)) {
          closeMobileNav();
        }
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchend', handleOutsideClick);

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && mnav.classList.contains('show')) {
        closeMobileNav();
      }
    });

    // Disarm conflicting Bootstrap Dropdown data-api on mobile nav links
    if (window.innerWidth < 992) {
      mnav.querySelectorAll('.navbar-nav [data-bs-toggle="dropdown"]').forEach(el => {
        el.removeAttribute('data-bs-toggle');
        el.dataset.agroToggle = 'dropdown';
      });
    }

    // Debounce tracker to prevent ghost clicks on mobile touch
    let lastNavToggleTime = 0;

    const toggleNavDropdownMenu = (dropBtn) => {
      const parent = dropBtn.closest('.dropdown, .nav-item');
      const menu = parent ? parent.querySelector('.dropdown-menu') : null;
      if (!menu) return;

      const isMenuOpen = menu.classList.contains('show');

      // Close any other open nav dropdown menus inside mnav
      mnav.querySelectorAll('.navbar-nav .dropdown-menu.show').forEach(m => {
        if (m !== menu) {
          m.classList.remove('show');
          const b = m.closest('.dropdown, .nav-item') ?.querySelector('.dropdown-toggle, [data-agro-toggle="dropdown"]');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });

      if (isMenuOpen) {
        menu.classList.remove('show');
        dropBtn.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.add('show');
        dropBtn.setAttribute('aria-expanded', 'true');
      }
    };

    // Delegated click handling on mnav
    mnav.addEventListener('click', (e) => {
      // 1. Regular nav link or dropdown navigation item clicked on mobile: navigate and close drawer
      const navItemLink = e.target.closest('.nav-link:not(.dropdown-toggle), .navbar-nav .dropdown-item');
      if (navItemLink && window.innerWidth < 992) {
        const href = navItemLink.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          closeMobileNav();
        }
        return;
      }

      // 2. Dropdown toggle clicked
      const dropBtn = e.target.closest('.dropdown-toggle, [data-agro-toggle="dropdown"]');
      if (!dropBtn) return;

      // EXCLUSION: User profile dropdown is managed exclusively by authentication.js
      if (dropBtn.classList.contains('user-profile-trigger') || dropBtn.closest('.agro-user-dropdown')) {
        return;
      }

      // On mobile screens (< 992px), custom toggle nav dropdowns (e.g. Home)
      if (window.innerWidth < 992) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        const now = Date.now();
        if (now - lastNavToggleTime < 320) return;
        lastNavToggleTime = now;

        toggleNavDropdownMenu(dropBtn);
      }
    });

    // Instant, lag-free mobile touch response for dropdown toggles
    mnav.addEventListener('touchend', (e) => {
      const dropBtn = e.target.closest('.dropdown-toggle, [data-agro-toggle="dropdown"]');
      if (dropBtn && !dropBtn.classList.contains('user-profile-trigger') && !dropBtn.closest('.agro-user-dropdown') && window.innerWidth < 992) {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastNavToggleTime < 320) return;
        lastNavToggleTime = now;
        toggleNavDropdownMenu(dropBtn);
      }
    }, { passive: false });

    // On resize between mobile and desktop, synchronize toggle attributes
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        closeMobileNav();
        mnav.querySelectorAll('.navbar-nav [data-agro-toggle="dropdown"]').forEach(el => {
          el.setAttribute('data-bs-toggle', 'dropdown');
          delete el.dataset.agroToggle;
        });
      } else {
        mnav.querySelectorAll('.navbar-nav [data-bs-toggle="dropdown"]').forEach(el => {
          el.removeAttribute('data-bs-toggle');
          el.dataset.agroToggle = 'dropdown';
        });
      }
    }, { passive: true });
  };

  // Lifecycle Initialization
  document.addEventListener('DOMContentLoaded', () => {
    setupMobileNavToggle();
    renderDeclarativeSections();
    setupServicesFilter();
    setupPricingToggle();
    setupServiceDetailsPage();
    setupBlogPage();
    setupBlogDetailsPage();
    setupComingSoonCountdown();
    setupContactForm();
    setupNewsletterForms();
    setupNavbarScroll();
    setupParallax();
    highlightActiveNav();
    observeRevealElements();
  });
})();
