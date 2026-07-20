/* PartSouq shared cart + order engine.
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

const PS_SEED_ORDERS = [
  {id:"PS-10234", items:[{name:"Bosch Alternator + Brake Pad Set", qty:3}], total:760, status:"Delivered"},
  {id:"PS-10256", items:[{name:"NGK Spark Plug Set", qty:1}], total:100, status:"Out for Delivery"},
  {id:"PS-10261", items:[{name:"AC Compressor + Filter Kit", qty:2}], total:720, status:"Processing"}
];
function psGetOrders(){
  try {
    const stored = JSON.parse(localStorage.getItem(PS_ORDERS_KEY));
    if (stored && stored.length) return stored.concat(PS_SEED_ORDERS);
    return PS_SEED_ORDERS.slice();
  } catch(e){ return PS_SEED_ORDERS.slice(); }
}
function psPlaceOrder(){
  const lines = psCartLines();
  if (!lines.length) return null;
  const subtotal = psCartSubtotal();
  const total = subtotal + 20;
  const order = {
    id: "PS-" + Math.floor(10000 + Math.random() * 89999),
    items: lines.map(l => ({name: l.product.name, qty: l.qty})),
    total: total,
    status: "Processing"
  };
  let stored = [];
  try { stored = JSON.parse(localStorage.getItem(PS_ORDERS_KEY)) || []; } catch(e){ stored = []; }
  stored.unshift(order);
  localStorage.setItem(PS_ORDERS_KEY, JSON.stringify(stored));
  psSaveCart([]);
  return order;
}

document.addEventListener("DOMContentLoaded", psUpdateCartBadge);
