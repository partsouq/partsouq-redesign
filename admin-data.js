/* PartSouq shared admin/operations data layer.
   Client-side demo store (localStorage) — every store here is read AND
   written by real pages on the site (not just the admin portal), so admin
   actions actually change what visitors see. A real production version of
   this would live in a backend (e.g. Supabase) rather than the visitor's
   own browser — see the note in chat. */

const PS_REQUESTS_KEY = "ps_part_requests";
const PS_SELLERS_KEY = "ps_sellers_seed_v1";

/* ---------- Part Requests ---------- */
function psGetPartRequests(){
  try { return JSON.parse(localStorage.getItem(PS_REQUESTS_KEY)) || []; }
  catch(e){ return []; }
}
function psSubmitPartRequest(req){
  const list = psGetPartRequests();
  list.unshift(Object.assign({
    id: "PR-" + Math.floor(1000 + Math.random() * 8999),
    status: "New"
  }, req));
  localStorage.setItem(PS_REQUESTS_KEY, JSON.stringify(list));
  return list[0];
}
function psSetRequestStatus(id, status){
  const list = psGetPartRequests();
  const r = list.find(x => x.id === id);
  if (r) r.status = status;
  localStorage.setItem(PS_REQUESTS_KEY, JSON.stringify(list));
}

/* ---------- Applications (seller / garage sign-up, pending admin review) ----------
   become-a-partner.html submits here. Nothing becomes a live seller or garage
   until an admin approves it in Admin > Applications. */
const PS_APPLICATIONS_KEY = "ps_applications";
function psGetApplications(){
  try { return JSON.parse(localStorage.getItem(PS_APPLICATIONS_KEY)) || []; }
  catch(e){ return []; }
}
function psSubmitApplication(app){
  const list = psGetApplications();
  const rec = Object.assign({
    id: "APP-" + Math.floor(1000 + Math.random() * 8999),
    status: "Pending",
    submittedAt: list.length // simple ordering counter, avoids Date.now() dependency
  }, app);
  list.unshift(rec);
  localStorage.setItem(PS_APPLICATIONS_KEY, JSON.stringify(list));
  return rec;
}
function psSetApplicationStatus(id, status){
  const list = psGetApplications();
  const a = list.find(x => x.id === id);
  if (!a) return;
  a.status = status;
  localStorage.setItem(PS_APPLICATIONS_KEY, JSON.stringify(list));
  if (status === "Approved") {
    if (a.applyType === "Garage / Workshop") {
      psAddGarage({
        name: a.businessName, area: a.emirate, emirate: a.emirate,
        specialties: a.specialties || [], rating: 0, jobs: 0,
        etaMin: 30, etaMax: 60, priceMin: 100, priceMax: 400, active: true
      });
    } else {
      psAddSeller({
        name: a.businessName, type: "Spare Part Supplier", emirate: a.emirate,
        idStatus: "Verified", listings: 0
      });
    }
  }
}

/* ---------- Seller directory (seed + persisted edits + admin/application additions) ---------- */
const PS_SELLERS_SEED = [
  {id:"s1", name:"Al Twal Auto Parts",   type:"Spare Part Supplier", emirate:"Dubai",   idStatus:"Verified", listings:6},
  {id:"s2", name:"Gulf Auto Spares",     type:"Spare Part Supplier", emirate:"Sharjah", idStatus:"Verified", listings:6},
  {id:"s3", name:"Sharjah Motor Spares", type:"Spare Part Supplier", emirate:"Sharjah", idStatus:"Verified", listings:6},
  {id:"s4", name:"Deira Auto Traders",   type:"Spare Part Supplier", emirate:"Dubai",   idStatus:"Pending",  listings:6},
  {id:"s5", name:"Al Barsha Garage",     type:"Garage / Workshop",   emirate:"Dubai",   idStatus:"Pending",  listings:0},
  {id:"s6", name:"Speedfix Workshop",    type:"Garage / Workshop",   emirate:"Ajman",   idStatus:"Verified", listings:0}
];
const PS_SELLERS_ADDED_KEY = "ps_sellers_added";
function psGetAddedSellers(){
  try { return JSON.parse(localStorage.getItem(PS_SELLERS_ADDED_KEY)) || []; }
  catch(e){ return []; }
}
function psAddSeller(seller){
  const list = psGetAddedSellers();
  const rec = Object.assign({id: "s-added-" + Math.floor(1000 + Math.random() * 8999)}, seller);
  list.push(rec);
  localStorage.setItem(PS_SELLERS_ADDED_KEY, JSON.stringify(list));
  return rec;
}
function psGetSellers(){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_SELLERS_KEY)) || {}; } catch(e){ overrides = {}; }
  const base = PS_SELLERS_SEED.concat(psGetAddedSellers());
  return base.map(s => Object.assign({}, s, overrides[s.id] || {}));
}
function psSetSellerIdStatus(id, status){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_SELLERS_KEY)) || {}; } catch(e){ overrides = {}; }
  overrides[id] = Object.assign({}, overrides[id], {idStatus: status});
  localStorage.setItem(PS_SELLERS_KEY, JSON.stringify(overrides));
}

/* ---------- Garage directory (seed + overrides + admin/application additions) ----------
   Powers the homepage "Book a Verified Garage" section directly — admin edits
   here are what visitors see, there is no separate copy of this data. */
const PS_GARAGES_OVERRIDES_KEY = "ps_garages_overrides";
const PS_GARAGES_ADDED_KEY = "ps_garages_added";
function psGetAddedGarages(){
  try { return JSON.parse(localStorage.getItem(PS_GARAGES_ADDED_KEY)) || []; }
  catch(e){ return []; }
}
function psAddGarage(garage){
  const list = psGetAddedGarages();
  const rec = Object.assign({id: "g-added-" + Math.floor(1000 + Math.random() * 8999)}, garage);
  list.push(rec);
  localStorage.setItem(PS_GARAGES_ADDED_KEY, JSON.stringify(list));
  return rec;
}
function psGetGarages(includeInactive){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_GARAGES_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  const base = PS_GARAGES_SEED.concat(psGetAddedGarages());
  const merged = base.map(g => Object.assign({}, g, overrides[g.id] || {}));
  return includeInactive ? merged : merged.filter(g => g.active !== false);
}
function psSetGarageActive(id, active){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_GARAGES_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  overrides[id] = Object.assign({}, overrides[id], {active: active});
  localStorage.setItem(PS_GARAGES_OVERRIDES_KEY, JSON.stringify(overrides));
}

/* ---------- Listing approvals + Listing/Service Overrides + Add Listing ----------
   PS_LISTINGS_KEY holds every seller-submitted OR admin-added listing (any status).
   PS_PRODUCT_OVERRIDES_KEY holds admin edits (price/status) applied on TOP of the
   24 hardcoded seed products from products-data.js. psGetAllListings() merges both
   into one real, unified catalog that search-results.html / product-detail.html /
   the homepage all read from — so an admin price change or a "Mark Out of Stock"
   action is immediately visible site-wide, not just inside the admin portal. */
const PS_LISTINGS_KEY = "ps_seller_listings";
const PS_PRODUCT_OVERRIDES_KEY = "ps_product_overrides";

function psGetAllSubmittedListings(){
  try { return JSON.parse(localStorage.getItem(PS_LISTINGS_KEY)) || []; }
  catch(e){ return []; }
}
function psSetListingStatus(id, status){
  const list = psGetAllSubmittedListings();
  const item = list.find(l => l.id === id);
  if (item) item.status = status;
  localStorage.setItem(PS_LISTINGS_KEY, JSON.stringify(list));
}
function psGetProductOverrides(){
  try { return JSON.parse(localStorage.getItem(PS_PRODUCT_OVERRIDES_KEY)) || {}; }
  catch(e){ return {}; }
}
function psOverrideListing(id, fields){
  if (typeof PS_PRODUCTS !== "undefined" && PS_PRODUCTS.some(p => p.id === id)) {
    const overrides = psGetProductOverrides();
    overrides[id] = Object.assign({}, overrides[id], fields);
    localStorage.setItem(PS_PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
  } else {
    const list = psGetAllSubmittedListings();
    const item = list.find(l => l.id === id);
    if (item) Object.assign(item, fields);
    localStorage.setItem(PS_LISTINGS_KEY, JSON.stringify(list));
  }
}
function psAddListingDirect(listing){
  const list = psGetAllSubmittedListings();
  const rec = Object.assign({
    id: "admin-" + Math.floor(1000 + Math.random() * 8999),
    status: "Approved",
    seller: "PartSouq Team",
    rating: 0, reviews: 0
  }, listing);
  list.push(rec);
  localStorage.setItem(PS_LISTINGS_KEY, JSON.stringify(list));
  return rec;
}
/* Unified live catalog: seed products (with admin price/status overrides) +
   every Approved submitted/admin-added listing. This is what the storefront
   should read instead of the raw PS_PRODUCTS constant. */
function psGetAllListings(){
  const overrides = psGetProductOverrides();
  const seed = (typeof PS_PRODUCTS !== "undefined" ? PS_PRODUCTS : []).map(p =>
    Object.assign({}, p, {status: "Approved", origin: "catalog"}, overrides[p.id] || {})
  );
  const submitted = psGetAllSubmittedListings().map(l => Object.assign({origin: "seller"}, l));
  return seed.concat(submitted);
}
function psGetLiveListings(){
  return psGetAllListings().filter(l => l.status === "Approved" && l.status !== "Out of Stock");
}

/* ---------- Garage bookings ("Book a Verified Garage") ---------- */
const PS_GARAGE_BOOKINGS_KEY = "ps_garage_bookings";
function psGetGarageBookings(){
  try { return JSON.parse(localStorage.getItem(PS_GARAGE_BOOKINGS_KEY)) || []; }
  catch(e){ return []; }
}
function psSubmitGarageBooking(booking){
  const list = psGetGarageBookings();
  list.unshift(Object.assign({
    id: "GB-" + Math.floor(1000 + Math.random() * 8999),
    status: "New"
  }, booking));
  localStorage.setItem(PS_GARAGE_BOOKINGS_KEY, JSON.stringify(list));
  return list[0];
}
function psSetGarageBookingStatus(id, status){
  const list = psGetGarageBookings();
  const b = list.find(x => x.id === id);
  if (b) b.status = status;
  localStorage.setItem(PS_GARAGE_BOOKINGS_KEY, JSON.stringify(list));
}

/* ---------- Site content (Featured Banner / Hero Banner / Partner Banner / Deals) ----------
   One editable store behind Operations > Featured Banner Management and
   Marketing > Hero Banners / Partner Banners / Discounts & Deals. The
   homepage and become-a-partner.html render straight from this, so editing
   it in the admin portal really does change the live pages. */
const PS_CONTENT_KEY = "ps_site_content";
const PS_CONTENT_DEFAULTS = {
  hero: {
    title: "Quality Parts. Verified Sellers. Right for Your Car.",
    subtitle: "The platform connecting UAE drivers with verified sellers for quality auto parts — reliable, affordable, and delivered to your doorstep."
  },
  featuredBanner: {
    title: "Every Part. Every Brand. All in One Place.",
    subtitle: "From engine to electrical — we've got you covered.",
    ctaText: "Browse All Parts →", ctaLink: "search-results.html"
  },
  partnerBanner: {
    title: "Grow your business with PartSouq",
    subtitle: "Join 250+ verified sellers and garages already earning through the platform."
  },
  deals: [
    {title:"Up to 40% Off Brake Systems", subtitle:"Pads, discs, calipers • Verified only", ctaText:"Shop Brakes →", category:"Brakes"},
    {title:"Engine & Filter Parts — Save 35%", subtitle:"Genuine fitment • Major UAE brands", ctaText:"Shop Engine →", category:"Engine"},
    {title:"Suspension Deals — Save 25%", subtitle:"Shock absorbers, struts, control arms", ctaText:"Shop Now →", category:"Suspension"}
  ]
};
function psGetSiteContent(){
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(PS_CONTENT_KEY)) || {}; } catch(e){ stored = {}; }
  return Object.assign({}, PS_CONTENT_DEFAULTS, stored, {
    hero: Object.assign({}, PS_CONTENT_DEFAULTS.hero, stored.hero || {}),
    featuredBanner: Object.assign({}, PS_CONTENT_DEFAULTS.featuredBanner, stored.featuredBanner || {}),
    partnerBanner: Object.assign({}, PS_CONTENT_DEFAULTS.partnerBanner, stored.partnerBanner || {}),
    deals: (stored.deals && stored.deals.length) ? stored.deals : PS_CONTENT_DEFAULTS.deals
  });
}
function psSetSiteContent(section, fields){
  const current = psGetSiteContent();
  current[section] = Object.assign({}, current[section], fields);
  localStorage.setItem(PS_CONTENT_KEY, JSON.stringify(current));
}
function psSetDeals(deals){
  const current = psGetSiteContent();
  current.deals = deals;
  localStorage.setItem(PS_CONTENT_KEY, JSON.stringify(current));
}

/* ---------- Category Images ----------
   Admin can override the icon glow color, or attach a custom uploaded image,
   per category — read by the homepage category carousel via psCatStyle()/
   psGetCategoryImage() so an admin change is what visitors actually see. */
const PS_CATEGORY_IMAGE_KEY = "ps_category_images";
function psGetCategoryImageOverrides(){
  try { return JSON.parse(localStorage.getItem(PS_CATEGORY_IMAGE_KEY)) || {}; }
  catch(e){ return {}; }
}
function psSetCategoryImage(category, fields){
  const overrides = psGetCategoryImageOverrides();
  overrides[category] = Object.assign({}, overrides[category], fields);
  localStorage.setItem(PS_CATEGORY_IMAGE_KEY, JSON.stringify(overrides));
}

/* ---------- Contact Submissions ----------
   Fed by the real "Contact Us" form on the homepage (#contact). ---------- */
const PS_CONTACT_KEY = "ps_contact_submissions";
function psGetContactSubmissions(){
  try { return JSON.parse(localStorage.getItem(PS_CONTACT_KEY)) || []; }
  catch(e){ return []; }
}
function psSubmitContactMessage(msg){
  const list = psGetContactSubmissions();
  const rec = Object.assign({id: "CT-" + Math.floor(1000 + Math.random() * 8999), status: "New"}, msg);
  list.unshift(rec);
  localStorage.setItem(PS_CONTACT_KEY, JSON.stringify(list));
  return rec;
}
function psSetContactStatus(id, status){
  const list = psGetContactSubmissions();
  const c = list.find(x => x.id === id);
  if (c) c.status = status;
  localStorage.setItem(PS_CONTACT_KEY, JSON.stringify(list));
}

/* ---------- Support Tickets ----------
   Fed by the real "Raise a Ticket" flow on my-account.html. ---------- */
const PS_TICKETS_KEY = "ps_support_tickets";
function psGetSupportTickets(){
  try { return JSON.parse(localStorage.getItem(PS_TICKETS_KEY)) || []; }
  catch(e){ return []; }
}
function psSubmitSupportTicket(ticket){
  const list = psGetSupportTickets();
  const rec = Object.assign({id: "TK-" + Math.floor(1000 + Math.random() * 8999), status: "Open"}, ticket);
  list.unshift(rec);
  localStorage.setItem(PS_TICKETS_KEY, JSON.stringify(list));
  return rec;
}
function psSetTicketStatus(id, status){
  const list = psGetSupportTickets();
  const t = list.find(x => x.id === id);
  if (t) t.status = status;
  localStorage.setItem(PS_TICKETS_KEY, JSON.stringify(list));
}

/* ---------- Disputes ----------
   Fed by the real "Report an Issue" button on each order in my-account.html. ---------- */
const PS_DISPUTES_KEY = "ps_disputes";
function psGetDisputes(){
  try { return JSON.parse(localStorage.getItem(PS_DISPUTES_KEY)) || []; }
  catch(e){ return []; }
}
function psFileDispute(dispute){
  const list = psGetDisputes();
  const rec = Object.assign({id: "DS-" + Math.floor(1000 + Math.random() * 8999), status: "Open"}, dispute);
  list.unshift(rec);
  localStorage.setItem(PS_DISPUTES_KEY, JSON.stringify(list));
  return rec;
}
function psSetDisputeStatus(id, status){
  const list = psGetDisputes();
  const d = list.find(x => x.id === id);
  if (d) d.status = status;
  localStorage.setItem(PS_DISPUTES_KEY, JSON.stringify(list));
}

/* ---------- Settings ----------
   Real settings that other computations actually use — e.g. the commission
   rate here directly drives the Partner Billing numbers below. ---------- */
const PS_SETTINGS_KEY = "ps_admin_settings";
const PS_SETTINGS_DEFAULTS = {commissionPct: 8, maintenanceMode: false, adminName: "Irfan A."};
function psGetSettings(){
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(PS_SETTINGS_KEY)) || {}; } catch(e){ stored = {}; }
  return Object.assign({}, PS_SETTINGS_DEFAULTS, stored);
}
function psSetSettings(fields){
  const current = psGetSettings();
  localStorage.setItem(PS_SETTINGS_KEY, JSON.stringify(Object.assign(current, fields)));
}

/* ---------- Partner Billing ----------
   Computed live from real placed orders (psGetOrders()) matched by product
   name/id back to the seller who listed it, at the commission rate set in
   Settings. Legacy seed orders whose line items can't be matched to a known
   product are called out as "Unattributed" rather than guessed. ---------- */
function psComputePartnerBilling(){
  const commissionPct = psGetSettings().commissionPct;
  const bySeller = {};
  let unattributed = 0;
  psGetOrders().forEach(order => {
    order.items.forEach(item => {
      const product = item.id ? psFindProduct(item.id) : psFindProductByName(item.name);
      if (!product){ unattributed += (item.qty || 1); return; }
      const seller = product.seller || "Unknown Seller";
      if (!bySeller[seller]) bySeller[seller] = {seller: seller, unitsSold: 0, salesValue: 0};
      bySeller[seller].unitsSold += (item.qty || 1);
      bySeller[seller].salesValue += product.price * (item.qty || 1);
    });
  });
  const rows = Object.values(bySeller).map(r => Object.assign(r, {
    commissionOwed: Math.round(r.salesValue * (commissionPct / 100) * 100) / 100
  }));
  rows.sort((a,b) => b.salesValue - a.salesValue);
  return {rows: rows, unattributedUnits: unattributed, commissionPct: commissionPct};
}

/* ---------- Admin session (demo-only gate — no real backend auth exists) ---------- */
const PS_ADMIN_SESSION_KEY = "ps_admin_session";
function psIsAdminLoggedIn(){ return sessionStorage.getItem(PS_ADMIN_SESSION_KEY) === "1"; }
function psAdminLogin(){ sessionStorage.setItem(PS_ADMIN_SESSION_KEY, "1"); }
function psAdminLogout(){ sessionStorage.removeItem(PS_ADMIN_SESSION_KEY); }
