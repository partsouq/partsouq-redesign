/* PartSouq shared admin/operations data layer.
   Client-side demo store (localStorage) covering: part requests,
   seller directory + ID verification, and listing approvals.
   A real production version of this would live in a backend (e.g. Supabase)
   rather than the visitor's browser — see the note in chat. */

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

/* ---------- Seller / Garage directory (seed + persisted edits) ---------- */
const PS_SELLERS_SEED = [
  {id:"s1", name:"Al Twal Auto Parts",   type:"Spare Part Supplier", emirate:"Dubai",   idStatus:"Verified", listings:6},
  {id:"s2", name:"Gulf Auto Spares",     type:"Spare Part Supplier", emirate:"Sharjah", idStatus:"Verified", listings:6},
  {id:"s3", name:"Sharjah Motor Spares", type:"Spare Part Supplier", emirate:"Sharjah", idStatus:"Verified", listings:6},
  {id:"s4", name:"Deira Auto Traders",   type:"Spare Part Supplier", emirate:"Dubai",   idStatus:"Pending",  listings:6},
  {id:"s5", name:"Al Barsha Garage",     type:"Garage / Workshop",   emirate:"Dubai",   idStatus:"Pending",  listings:0},
  {id:"s6", name:"Speedfix Workshop",    type:"Garage / Workshop",   emirate:"Ajman",   idStatus:"Verified", listings:0}
];
function psGetSellers(){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_SELLERS_KEY)) || {}; } catch(e){ overrides = {}; }
  return PS_SELLERS_SEED.map(s => Object.assign({}, s, overrides[s.id] || {}));
}
function psSetSellerIdStatus(id, status){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_SELLERS_KEY)) || {}; } catch(e){ overrides = {}; }
  overrides[id] = Object.assign({}, overrides[id], {idStatus: status});
  localStorage.setItem(PS_SELLERS_KEY, JSON.stringify(overrides));
}

/* ---------- Listing approvals (reads/writes the same ps_seller_listings
   key seller-dashboard.html uses, so both pages see the same data) ---------- */
const PS_LISTINGS_KEY = "ps_seller_listings";
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
