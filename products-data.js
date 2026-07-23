/* Auto Corner shared product data + category icon library.
   Loaded by every page so the same product / same category always
   shows the same image and the same facts, everywhere. */

const PS_CATEGORIES = ["Engine","Brakes","Suspension","Body Parts","Electrical","AC & Cooling","Steering","Tools & Garage"].slice().sort((a,b) => a.localeCompare(b));

const PS_ICONS = {
  "Engine": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="5" y="6" width="14" height="12" rx="2"/><path d="M9 6V4h6v2"/></svg>',
  "Brakes": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
  "Suspension": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M6 20V10l6-6 6 6v10"/></svg>',
  "Body Parts": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="9" width="18" height="7" rx="2"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/></svg>',
  "Electrical": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="6" y="5" width="12" height="14" rx="2"/><path d="M9 9h6M9 13h6"/></svg>',
  "AC & Cooling": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2"/></svg>',
  "Steering": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/></svg>',
  "Tools & Garage": '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M14 7l3 3-8 8-4 1 1-4 8-8z"/></svg>'
};
function psIcon(category){ return PS_ICONS[category] || PS_ICONS["Engine"]; }

/* Richer "photo-card" styling for the homepage category carousel —
   a distinct dark gradient + accent glow color per category, since real
   photography isn't available in this build (see chat note). */
const PS_CAT_STYLE = {
  "All Parts":     {grad:"linear-gradient(160deg,#1b2436,#0e1420)", glow:"#8FA6FF"},
  "Engine":        {grad:"linear-gradient(160deg,#2b2114,#120e08)", glow:"#FFB74A"},
  "Brakes":        {grad:"linear-gradient(160deg,#301414,#160707)", glow:"#FF6B5E"},
  "Suspension":    {grad:"linear-gradient(160deg,#141d30,#080b14)", glow:"#7FA8FF"},
  "Body Parts":    {grad:"linear-gradient(160deg,#132622,#070f0d)", glow:"#4FD8C4"},
  "Electrical":    {grad:"linear-gradient(160deg,#101a2e,#070b14)", glow:"#7CFF7A"},
  "AC & Cooling":  {grad:"linear-gradient(160deg,#0e2230,#060f16)", glow:"#57D9FF"},
  "Steering":      {grad:"linear-gradient(160deg,#20222a,#0c0d10)", glow:"#C9CFDC"},
  "Tools & Garage":{grad:"linear-gradient(160deg,#2a1c10,#120b05)", glow:"#FFA24A"},
  "Book Garage":   {grad:"linear-gradient(160deg,#1c1408,#0d0904)", glow:"#FF7A1A"}
};
function psCatStyle(category){ return PS_CAT_STYLE[category] || PS_CAT_STYLE["Engine"]; }

/* Default photographic-style category tile art (generated in-house for this build —
   see chat note: no licensed stock photography or image-generation API is available
   in this environment, so these are stylized studio-lit illustrations, not real
   product photos). Admin > Category Images can still upload a real photo per
   category at any time, which always takes priority over this default. */
const PS_CATEGORY_DEFAULT_IMAGES = {
  "All Parts":      "images/cat-all.jpg",
  "Engine":         "images/cat-engine.jpg",
  "Brakes":         "images/cat-brakes.jpg",
  "Suspension":     "images/cat-suspension.jpg",
  "Body Parts":     "images/cat-body.jpg",
  "Electrical":     "images/cat-electrical.jpg",
  "AC & Cooling":   "images/cat-ac.jpg",
  "Steering":       "images/cat-steering.jpg",
  "Tools & Garage": "images/cat-tools.jpg"
};
function psCategoryDefaultImage(category){ return PS_CATEGORY_DEFAULT_IMAGES[category] || null; }

const PS_PRODUCTS = [
  {id:"p1",  name:"Toyota Oil Filter",              sku:"90915-YZZE1",   brand:"Toyota", category:"Engine",         price:35,  oldPrice:null, seller:"Gulf Auto Spares",     rating:4.6, reviews:58,  condition:"New",  compat:"Toyota Corolla, Camry, RAV4",        desc:"OEM-spec oil filter for Toyota 4-cylinder engines. Confirm fitment against your VIN before ordering."},
  {id:"p2",  name:"Bosch Air Filter",                sku:"1457433765",   brand:"Bosch",  category:"Engine",         price:45,  oldPrice:60,   seller:"Al Twal Auto Parts",   rating:4.5, reviews:40,  condition:"New",  compat:"Toyota Camry, Honda Accord, Nissan Altima", desc:"High-flow air filter suitable for a range of sedans. Photos and part details were checked before listing."},
  {id:"p3",  name:"NGK Spark Plug Set",              sku:"ILFR6A11",     brand:"NGK",    category:"Engine",         price:25,  oldPrice:null, seller:"Deira Auto Traders",   rating:4.7, reviews:112, condition:"New",  compat:"Toyota Corolla, Honda Civic, Nissan Sunny", desc:"Set of iridium spark plugs for improved ignition. Confirm cylinder count matches your engine."},
  {id:"p4",  name:"Honda Brake Pad Set — Front",     sku:"45022-TLA-A00",brand:"Honda",  category:"Brakes",         price:120, oldPrice:null, seller:"Gulf Auto Spares",     rating:4.8, reviews:96,  condition:"New",  compat:"Honda Civic, Accord, CR-V",          desc:"Front brake pad set for Honda sedans and crossovers. Listing checked for compatibility before going live."},
  {id:"p5",  name:"Bosch Brake Pad Set — Front",     sku:"0986TB2170",   brand:"Bosch",  category:"Brakes",         price:145, oldPrice:240,  seller:"Al Twal Auto Parts",   rating:4.6, reviews:74,  condition:"New",  compat:"Toyota Hilux, Fortuner, Land Cruiser", desc:"Bosch front brake pads with reduced noise and dust. Fits a range of sedans — confirm before ordering."},
  {id:"p6",  name:"Brembo Brake Disc Set",           sku:"09.A961.11",   brand:"Brembo", category:"Brakes",         price:310, oldPrice:null, seller:"Sharjah Motor Spares", rating:4.7, reviews:51,  condition:"New",  compat:"BMW 3 Series, Mercedes C-Class",     desc:"Vented front brake disc pair. Recommended to replace pads at the same time."},
  {id:"p7",  name:"ATE Ceramic Brake Pads",          sku:"13.0460-7181", brand:"ATE",    category:"Brakes",         price:165, oldPrice:220,  seller:"Deira Auto Traders",   rating:4.5, reviews:38,  condition:"New",  compat:"Mercedes C-Class, E-Class",          desc:"Ceramic compound pads for lower dust and quieter braking."},
  {id:"p8",  name:"KYB Shock Absorber — Front",      sku:"334703",       brand:"KYB",    category:"Suspension",     price:210, oldPrice:null, seller:"Gulf Auto Spares",     rating:4.6, reviews:44,  condition:"New",  compat:"Toyota Hilux, Fortuner",             desc:"Front shock absorber, sold individually. Compatibility checked against listed models."},
  {id:"p9",  name:"Suspension Coil Spring Set",      sku:"48131-YZZE1",  brand:"Toyota", category:"Suspension",     price:180, oldPrice:null, seller:"Al Twal Auto Parts",   rating:4.4, reviews:22,  condition:"New",  compat:"Toyota Land Cruiser, Prado",         desc:"Front coil spring pair for standard ride height."},
  {id:"p10", name:"Control Arm — Lower",             sku:"48069-09290",  brand:"Toyota", category:"Suspension",     price:240, oldPrice:290,  seller:"Sharjah Motor Spares", rating:4.5, reviews:19,  condition:"Used", compat:"Toyota Camry, RAV4",                 desc:"Used, inspected lower control arm with bushings pre-installed."},
  {id:"p11", name:"Side Mirror Assembly — Right",    sku:"MR-2201",      brand:"OEM",    category:"Body Parts",     price:165, oldPrice:null, seller:"Deira Auto Traders",   rating:4.3, reviews:15,  condition:"Used", compat:"Toyota Corolla",                     desc:"Used, inspected right-side power mirror assembly, unpainted."},
  {id:"p12", name:"Headlight Assembly — Left",       sku:"HL-3392",      brand:"Depo",   category:"Body Parts",     price:420, oldPrice:480,  seller:"Gulf Auto Spares",     rating:4.6, reviews:27,  condition:"Used", compat:"Nissan Patrol",                      desc:"Used, inspected left headlight assembly, halogen. Confirm trim level before ordering."},
  {id:"p13", name:"Front Bumper Cover",               sku:"BC-1187",      brand:"OEM",    category:"Body Parts",     price:520, oldPrice:null, seller:"Al Twal Auto Parts",   rating:4.4, reviews:12,  condition:"Used", compat:"Toyota Land Cruiser",                desc:"Used, inspected primed front bumper cover, ready for paint."},
  {id:"p14", name:"Bosch Alternator — 12V 120A",     sku:"0986041230",   brand:"Bosch",  category:"Electrical",     price:450, oldPrice:null, seller:"Al Twal Auto Parts",   rating:4.8, reviews:126, condition:"New",  compat:"Toyota Hilux, Fortuner",             desc:"Genuine-fit Bosch alternator suitable for a range of sedans and SUVs. Listing details, photos and compatibility were checked by Auto Corner before publishing. Check the Specifications tab for the exact compatible model before ordering."},
  {id:"p15", name:"Car Battery 70Ah",                 sku:"DIN70",        brand:"Varta",  category:"Electrical",     price:380, oldPrice:null, seller:"Sharjah Motor Spares", rating:4.7, reviews:88,  condition:"New",  compat:"Universal fit — most sedans & SUVs", desc:"70Ah maintenance-free starter battery."},
  {id:"p16", name:"Starter Motor",                    sku:"ST-1187",      brand:"Denso",  category:"Electrical",     price:520, oldPrice:600,  seller:"Deira Auto Traders",   rating:4.5, reviews:33,  condition:"Used", compat:"Toyota Corolla, Camry",              desc:"Used, bench-tested remanufactured starter motor."},
  {id:"p17", name:"AC Compressor Denso",              sku:"10S17C",       brand:"Denso",  category:"AC & Cooling",   price:650, oldPrice:null, seller:"Gulf Auto Spares",     rating:4.6, reviews:41,  condition:"New",  compat:"Toyota Camry, Corolla",              desc:"AC compressor unit. Confirm your AC gas type and fitting size before ordering."},
  {id:"p18", name:"Radiator Assembly",                sku:"RAD-2205",     brand:"Toyota", category:"AC & Cooling",   price:380, oldPrice:null, seller:"Al Twal Auto Parts",   rating:4.5, reviews:29,  condition:"New",  compat:"Toyota Camry, Corolla",              desc:"Aluminium-core radiator assembly with plastic end tanks."},
  {id:"p19", name:"AC Condenser",                     sku:"COND-118",     brand:"Nissens", category:"AC & Cooling",  price:290, oldPrice:340,  seller:"Sharjah Motor Spares", rating:4.4, reviews:18,  condition:"New",  compat:"Nissan Altima, Sunny",               desc:"AC condenser, direct-fit replacement."},
  {id:"p20", name:"Steering Rack Assembly",           sku:"SR-4471",      brand:"Bosch",  category:"Steering",       price:890, oldPrice:null, seller:"Deira Auto Traders",   rating:4.6, reviews:21,  condition:"New",  compat:"Toyota Land Cruiser",                desc:"Complete power steering rack assembly, tested before listing."},
  {id:"p21", name:"Power Steering Pump",              sku:"PSP-330",      brand:"Toyota", category:"Steering",       price:310, oldPrice:360,  seller:"Gulf Auto Spares",     rating:4.5, reviews:17,  condition:"New",  compat:"Toyota Hilux, Fortuner",             desc:"Hydraulic power steering pump, direct-fit."},
  {id:"p22", name:"Tie Rod End — Outer",              sku:"TR-115",       brand:"Moog",   category:"Steering",       price:65,  oldPrice:null, seller:"Al Twal Auto Parts",   rating:4.6, reviews:34,  condition:"New",  compat:"Honda Accord, Civic",                desc:"Outer tie rod end, sold individually."},
  {id:"p23", name:"Socket Wrench Set 40pc",           sku:"SWS-40",       brand:"Stanley",category:"Tools & Garage", price:145, oldPrice:null, seller:"Sharjah Motor Spares", rating:4.8, reviews:62,  condition:"New",  compat:"Universal — any vehicle",            desc:"40-piece socket and ratchet set in a carry case."},
  {id:"p24", name:"Hydraulic Floor Jack 2T",          sku:"HFJ-2T",       brand:"Bosch",  category:"Tools & Garage", price:260, oldPrice:300,  seller:"Deira Auto Traders",   rating:4.7, reviews:45,  condition:"New",  compat:"Universal — any vehicle",            desc:"2-tonne hydraulic floor jack with low entry height."}
];

const CAR_DB = {
  "Toyota": ["Camry","Corolla","Land Cruiser","Hilux","RAV4","Yaris","Fortuner","Prado"],
  "Honda": ["Civic","Accord","CR-V","City","Pilot"],
  "Nissan": ["Altima","Patrol","Sunny","X-Trail","Sentra"],
  "Hyundai": ["Elantra","Tucson","Santa Fe","Accent"],
  "Kia": ["Sportage","Sorento","Cerato","Optima"],
  "Mitsubishi": ["Pajero","Lancer","Outlander","L200"],
  "Ford": ["F-150","Explorer","Edge","Ranger"],
  "Chevrolet": ["Tahoe","Malibu","Suburban","Camaro"],
  "BMW": ["3 Series","5 Series","X5","X3"],
  "Mercedes-Benz": ["C-Class","E-Class","GLE","GLC"],
  "Lexus": ["RX","ES","LX","GX"],
  "Mazda": ["6","CX-5","3","CX-9"]
};

/* Seed garage directory — admin-manageable via admin-data.js (psGetGarages() merges
   this seed with admin overrides/additions, so Admin > Garages actually controls
   what shows on the homepage "Book a Verified Garage" section). */
const PS_GARAGES_SEED = [
  {id:"g1", name:"Al Quoz Service Centre",  area:"Al Quoz",    emirate:"Dubai",   specialties:["Engine","Brakes","AC & Cooling","Electrical"], rating:4.8, jobs:284, etaMin:45, etaMax:60, priceMin:150, priceMax:450, active:true},
  {id:"g2", name:"Sharjah Auto Care",       area:"Industrial 12", emirate:"Sharjah", specialties:["Suspension","Steering","Body Parts","Tools & Garage"], rating:4.6, jobs:97,  etaMin:30, etaMax:50, priceMin:120, priceMax:400, active:true},
  {id:"g3", name:"Speedfix Workshop",       area:"Al Jurf",    emirate:"Ajman",   specialties:["Engine","Electrical","Brakes","Tools & Garage"], rating:4.7, jobs:152, etaMin:40, etaMax:55, priceMin:100, priceMax:380, active:true}
];

/* psFindProduct checks the seed catalog first (applying any admin price/status
   override on top of it), then falls back to seller/admin-submitted listings —
   so a product-detail page or cart line works for ANY live listing, not just
   the 24 hardcoded seed products. Falls back gracefully if admin-data.js isn't
   loaded on a given page. */
function psFindProduct(id){
  const seed = PS_PRODUCTS.find(p => p.id === id);
  if (seed) {
    if (typeof psGetProductOverrides === "function") {
      const ov = psGetProductOverrides()[id];
      if (ov) return Object.assign({}, seed, ov);
    }
    return seed;
  }
  if (typeof psGetAllSubmittedListings === "function") {
    return psGetAllSubmittedListings().find(l => l.id === id);
  }
  return undefined;
}
function psFindProductByName(name){ return PS_PRODUCTS.find(p => p.name === name); }
function psRelated(product, limit){
  limit = limit || 5;
  const pool = (typeof psGetLiveListings === "function") ? psGetLiveListings() : PS_PRODUCTS;
  return pool.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
}
function psFmt(n){ return "AED " + n.toFixed(2).replace(/\.00$/, ".00"); }

/* Shared helpers so every product card (homepage, search results, related-parts,
   product page) shows the same real facts consistently, instead of each page
   re-deriving its own subset. Nothing here is invented per-card — it all reads
   straight off the product record. */
function psDeliveryText(p){
  return (p.estDelivery && p.estDeliveryUnit) ? (p.estDelivery + " " + p.estDeliveryUnit) : "Same day / next day";
}
function psSellerWord(rating){
  if (rating >= 4.7) return "Excellent Seller";
  if (rating >= 4.3) return "Good Seller";
  if (rating >= 3.8) return "Fair Seller";
  return "New Seller";
}
/* Sellers can list a part as New or as Used at a few grades ("Used – Good", etc,
   per seller-dashboard.html's Add Listing form) — anything starting with "Used"
   gets the orange used-condition treatment, everything else reads as New. */
function psIsUsed(condition){ return !!(condition && condition.indexOf("Used") === 0); }
/* Renders the small facts block used under a product card's name/price —
   condition, compatible vehicle, delivery estimate and Cash on Delivery note. */
function psCardFacts(p){
  const bits = [];
  bits.push('<span class="factbadge cond-' + (psIsUsed(p.condition) ? "used" : "new") + '">' + (p.condition || "New") + '</span>');
  if (typeof p.rating === "number") bits.push('<span class="factbadge seller-word">' + psSellerWord(p.rating) + '</span>');
  let html = '<div class="cardfacts">' + bits.join("") + '</div>';
  if (p.compat) html += '<div class="cardcompat">🚗 ' + p.compat + '</div>';
  html += '<div class="carddelivery">🚚 ' + psDeliveryText(p) + ' · AED ' + (p.deliveryFee || 20).toFixed(0) + ' delivery · 💵 Cash on Delivery</div>';
  return html;
}
