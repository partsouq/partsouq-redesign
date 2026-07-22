/* AvoraSouq shared cart + order engine.
   Uses localStorage so cart/orders persist across pages on this site
   (this is the visitor's own browser storage — not the artifact sandbox). */

const PS_CART_KEY = "ps_cart";
const PS_ORDERS_KEY = "ps_orders";

function psGetCart(){
  try { return JSON.parse(localStorage.getItem(PS_CART_KEY)) || []; }
  catch(e){ return []; }
}
function psSaveCart(cart){
  localStorage.setItem(PS_CART_KEY, JSON.stringify(cart));
  psUpdateCartBadge();
}
function psAddToCart(id, qty){
  if (!psIsBuyerLoggedIn()){ psRequireBuyerLogin(); return; }
  qty = qty || 1;
  const cart = psGetCart();
  const line = cart.find(c => c.id === id);
  if (line) line.qty += qty; else cart.push({id: id, qty: qty});
  psSaveCart(cart);
}
function psSetQty(id, qty){
  let cart = psGetCart();
  if (qty <= 0) cart = cart.filter(c => c.id !== id);
  else { const line = cart.find(c => c.id === id); if (line) line.qty = qty; }
  psSaveCart(cart);
}
function psRemoveFromCart(id){ psSetQty(id, 0); }
function psCartLines(){
  return psGetCart().map(c => {
    const p = psFindProduct(c.id);
    return p ? {product: p, qty: c.qty} : null;
  }).filter(Boolean);
}
function psCartCount(){ return psGetCart().reduce((n,c) => n + c.qty, 0); }
function psCartSubtotal(){ return psCartLines().reduce((s,l) => s + l.product.price * l.qty, 0); }

function psUpdateCartBadge(){
  const n = psCartCount();
  document.querySelectorAll(".ps-cart-badge").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}

/* ---------- Wishlist (real localStorage-backed, not decorative) ---------- */
const PS_WISHLIST_KEY = "ps_wishlist";
function psGetWishlist(){
  try { return JSON.parse(localStorage.getItem(PS_WISHLIST_KEY)) || []; }
  catch(e){ return []; }
}
function psIsWishlisted(id){ return psGetWishlist().indexOf(id) !== -1; }
function psToggleWishlist(id){
  let list = psGetWishlist();
  const on = list.indexOf(id) !== -1;
  list = on ? list.filter(x => x !== id) : list.concat([id]);
  localStorage.setItem(PS_WISHLIST_KEY, JSON.stringify(list));
  psUpdateWishlistBadge();
  return !on; // returns the new state (true = now wishlisted)
}
function psUpdateWishlistBadge(){
  const n = psGetWishlist().length;
  document.querySelectorAll(".ps-wishlist-badge").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}
document.addEventListener("DOMContentLoaded", psUpdateWishlistBadge);

/* ---------- Saved delivery addresses (buyer address book) ---------- */
const PS_ADDRESSES_KEY = "ps_buyer_addresses";
function psGetAddresses(){
  try { return JSON.parse(localStorage.getItem(PS_ADDRESSES_KEY)) || []; }
  catch(e){ return []; }
}
function psSaveAddresses(list){ localStorage.setItem(PS_ADDRESSES_KEY, JSON.stringify(list)); }
function psAddAddress(addr){
  const list = psGetAddresses();
  const rec = Object.assign({id: "addr-" + Math.floor(1000 + Math.random()*8999)}, addr);
  if (rec.isDefault || !list.length) list.forEach(a => a.isDefault = false);
  list.push(rec);
  psSaveAddresses(list);
  return rec;
}
function psDeleteAddress(id){ psSaveAddresses(psGetAddresses().filter(a => a.id !== id)); }
function psSetDefaultAddress(id){
  const list = psGetAddresses();
  list.forEach(a => a.isDefault = (a.id === id));
  psSaveAddresses(list);
}
function psGetDefaultAddress(){ return psGetAddresses().find(a => a.isDefault) || psGetAddresses()[0] || null; }

/* ---------- Buyer profile (display name / email shown across the site) ---------- */
const PS_PROFILE_KEY = "ps_buyer_profile";
function psGetProfile(){
  try {
    const stored = JSON.parse(localStorage.getItem(PS_PROFILE_KEY));
    if (stored && stored.name) return stored;
  } catch(e){}
  return {name: "Irfan A.", email: "irfan.aidigital@gmail.com"};
}
function psSaveProfile(profile){ localStorage.setItem(PS_PROFILE_KEY, JSON.stringify(profile)); }

/* ---------- Buyer login (real, required before checkout/Add to Cart) ----------
   Any real email can register as a buyer — unlike sellers/garages there is no
   admin-approval step for buyers, so this is a lightweight "prove you own this
   email" check rather than a registry lookup: log in by entering an email,
   then a verification code. Since this static site has no real mail server to
   send that code to, the code is shown on-screen, clearly labeled as a demo
   stand-in for what would be emailed in production. */
const PS_BUYER_SESSION_KEY = "ps_buyer_session";
function psIsBuyerLoggedIn(){ return !!sessionStorage.getItem(PS_BUYER_SESSION_KEY); }
function psGetLoggedInBuyerEmail(){ return sessionStorage.getItem(PS_BUYER_SESSION_KEY) || null; }
function psBuyerLogin(email){
  sessionStorage.setItem(PS_BUYER_SESSION_KEY, email);
  const profile = psGetProfile();
  psSaveProfile(Object.assign({}, profile, {email: email}));
}
function psBuyerLogout(){ sessionStorage.removeItem(PS_BUYER_SESSION_KEY); }
function psGenerateVerificationCode(){ return String(Math.floor(100000 + Math.random() * 899999)); }
/* Sends the visitor to the login page and back again once they're signed in —
   used by psAddToCart()/psPlaceOrder() below so there is no way to add an item
   or place an order while logged out. */
function psRequireBuyerLogin(){
  const back = location.pathname.split("/").pop() + location.search;
  location.href = "login-register.html?type=buyer&redirect=" + encodeURIComponent(back);
}

/* ---------- Header account dropdown (Sign In / My Account / Log Out / Partner Dashboard) ----------
   Shared by every page's header so "My Account" always reflects real buyer
   login state — including a real Log Out option once you're signed in,
   instead of only being reachable from deep inside My Account's sidebar. */
function toggleAcctMenu(e){
  if (e){ e.preventDefault(); e.stopPropagation(); }
  const dd = document.getElementById("acct-dropdown");
  if (!dd) return;
  dd.classList.toggle("open");
}
function acctMenuLogout(){
  if (confirm("Log out of AvoraSouq?")){
    psBuyerLogout();
    location.href = "index.html";
  }
}
document.addEventListener("click", () => {
  const dd = document.getElementById("acct-dropdown");
  if (dd) dd.classList.remove("open");
});
document.addEventListener("DOMContentLoaded", () => {
  const dd = document.getElementById("acct-dropdown");
  if (!dd) return;
  dd.addEventListener("click", e => e.stopPropagation());
  const signIn = document.getElementById("acct-link-signin");
  const myAcct = document.getElementById("acct-link-myaccount");
  const logout = document.getElementById("acct-link-logout");
  const label = document.getElementById("acct-menu-label");
  if (psIsBuyerLoggedIn()){
    if (signIn) signIn.style.display = "none";
    if (myAcct) myAcct.style.display = "block";
    if (logout) logout.style.display = "block";
    if (label) label.textContent = "My Account";
  } else {
    if (signIn) signIn.style.display = "block";
    if (myAcct) myAcct.style.display = "none";
    if (logout) logout.style.display = "none";
    if (label) label.textContent = label.textContent; // unchanged ("Account" / "My Account")
  }
});
// Make sure the badge reflects the cart's real (persisted) count on every
// fresh page load too — not just after an in-session add/remove.
document.addEventListener("DOMContentLoaded", psUpdateCartBadge);

const PS_SEED_ORDERS = [
  {id:"AS-10234", items:[{name:"Bosch Alternator — 12V 120A", id:"p14", qty:1},{name:"Bosch Brake Pad Set — Front", id:"p5", qty:2}], total:760, status:"Delivered"},
  {id:"AS-10256", items:[{name:"NGK Spark Plug Set", id:"p3", qty:1}], total:100, status:"Out for Delivery"},
  {id:"AS-10261", items:[{name:"AC Compressor Denso", id:"p17", qty:1},{name:"AC Condenser", id:"p19", qty:1}], total:720, status:"Processing"}
];
/* Order status can be changed by the admin portal for BOTH seed demo orders
   and real placed orders — overrides are stored separately so a status change
   sticks even though PS_SEED_ORDERS itself is a constant. Each override also
   keeps a full history/audit trail (who changed it to what, and when), stored
   in the same admin-owned localStorage — this is the real history the admin
   approve→forward→seller pipeline is supposed to keep. */
const PS_ORDER_STATUS_OVERRIDES_KEY = "ps_order_status_overrides";
function psGetOrders(){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_ORDER_STATUS_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(PS_ORDERS_KEY)) || []; } catch(e){ stored = []; }
  const all = stored.concat(PS_SEED_ORDERS);
  return all.map(o => overrides[o.id] ? Object.assign({}, o, {status: overrides[o.id].status, history: overrides[o.id].history}) : o);
}
function psGetOrderHistory(id){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_ORDER_STATUS_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  return (overrides[id] && overrides[id].history) || [];
}
function psSetOrderStatus(id, status){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_ORDER_STATUS_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  const prevHistory = (overrides[id] && overrides[id].history) || [];
  const history = prevHistory.concat([{status: status, at: new Date().toLocaleString()}]);
  overrides[id] = {status: status, history: history};
  localStorage.setItem(PS_ORDER_STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
}
/* details (optional) = {buyer:{name,phone,address,emirate,area}, oldPartPhoto, mulkiya}
   Orders now start life as "Pending Admin Review" — AvoraSouq checks the buyer's
   Mulkiya against the order before it's ever forwarded to a seller for dispatch,
   matching the real verified-fitment workflow (not a fake status). */
function psPlaceOrder(details){
  if (!psIsBuyerLoggedIn()){ psRequireBuyerLogin(); return null; }
  const lines = psCartLines();
  if (!lines.length) return null;
  const subtotal = psCartSubtotal();
  const fee = 20;
  const total = subtotal + fee;
  const order = {
    id: "AS-" + Math.floor(10000 + Math.random() * 89999),
    items: lines.map(l => ({name: l.product.name, id: l.product.id, qty: l.qty})),
    total: total,
    deliveryFee: fee,
    status: "Pending Admin Review",
    buyer: (details && details.buyer) || {},
    oldPartPhoto: (details && details.oldPartPhoto) || null,
    mulkiya: (details && details.mulkiya) || null,
    placedAt: new Date().toLocaleString()
  };
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(PS_ORDERS_KEY)) || []; } catch(e){ stored = []; }
  stored.unshift(order);
  localStorage.setItem(PS_ORDERS_KEY, JSON.stringify(stored));
  psSaveCart([]);
  return order;
}

/* Highlight whichever link in the top nav row (Home / Shop Parts / Today's Deals /
   Book a Garage / How It Works / Become a Partner / Contact) matches the page
   currently open, so the row always shows where you are with the brand-blue
   highlight color (nav a.active is styled per-page in each <style> block). */
document.addEventListener("DOMContentLoaded", function(){
  const here = location.pathname.split("/").pop() || "index.html";
  // Scoped to the top nav row only — the mobile bottom app-bar (.ps-bottom-nav)
  // sets its own active tab per page directly in the HTML and isn't touched here.
  document.querySelectorAll("nav:not(.ps-bottom-nav) a[href]").forEach(function(a){
    const href = a.getAttribute("href");
    if (href.startsWith("#")) return; // in-page anchor (e.g. "Contact" -> #contact), not a separate page
    const hrefFile = href.split("#")[0].split("?")[0] || "index.html";
    if (hrefFile === here) a.classList.add("active");
  });
});
