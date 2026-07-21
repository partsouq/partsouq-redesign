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
   sticks even though PS_SEED_ORDERS itself is a constant. */
const PS_ORDER_STATUS_OVERRIDES_KEY = "ps_order_status_overrides";
function psGetOrders(){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_ORDER_STATUS_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(PS_ORDERS_KEY)) || []; } catch(e){ stored = []; }
  const all = stored.concat(PS_SEED_ORDERS);
  return all.map(o => overrides[o.id] ? Object.assign({}, o, {status: overrides[o.id]}) : o);
}
function psSetOrderStatus(id, status){
  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem(PS_ORDER_STATUS_OVERRIDES_KEY)) || {}; } catch(e){ overrides = {}; }
  overrides[id] = status;
  localStorage.setItem(PS_ORDER_STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
}
/* details (optional) = {buyer:{name,phone,address,emirate,area}, oldPartPhoto, mulkiya}
   Orders now start life as "Pending Admin Review" — AvoraSouq checks the buyer's
   Mulkiya against the order before it's ever forwarded to a seller for dispatch,
   matching the real verified-fitment workflow (not a fake status). */
function psPlaceOrder(details){
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
