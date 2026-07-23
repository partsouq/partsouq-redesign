/* Auto Corner shared "Track Order" modal — lets anyone check a real order or
   garage booking's live status by reference number, without needing to open
   My Account. Include after cart.js + admin-data.js, then call
   openTrackOrderModal() from a header/footer link on any page. */

(function(){
  const style = document.createElement("style");
  style.textContent = `
    #to-modal{display:none;position:fixed;inset:0;background:rgba(15,20,30,.55);z-index:999;align-items:center;justify-content:center;padding:20px;}
    #to-modal.open{display:flex;}
    #to-modal .to-box{background:#fff;border-radius:14px;max-width:420px;width:100%;padding:24px;position:relative;}
    #to-modal h3{font-size:18px;margin:0 0 4px;color:var(--text,#161B22);}
    #to-modal p.to-sub{font-size:13px;color:var(--text-secondary,#57606F);margin:0 0 16px;}
    #to-modal .to-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted,#8A93A3);}
    #to-modal .to-row{display:flex;gap:8px;}
    #to-modal input{flex:1;padding:11px;border:1.5px solid var(--border,#E2E8F0);border-radius:8px;font-size:14px;font-family:inherit;}
    #to-modal .to-btn{background:var(--brand-blue,#1E56D8);color:#fff;border:none;padding:0 20px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;}
    #to-modal .to-result{margin-top:18px;border:1px solid var(--border,#E2E8F0);border-radius:10px;padding:16px;display:none;}
    #to-modal .to-result .to-id{font-family:monospace;font-size:13px;color:var(--text-muted,#8A93A3);margin-bottom:6px;}
    #to-modal .to-result .to-status{display:inline-block;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;margin-bottom:10px;}
    #to-modal .to-error{margin-top:14px;color:var(--danger-red,#D92D20);font-size:13px;display:none;}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "to-modal";
  wrap.innerHTML = `
    <div class="to-box">
      <button class="to-close" onclick="closeTrackOrderModal()">✕</button>
      <h3>Track Order</h3>
      <p class="to-sub">Enter your order or garage booking reference — you'll find it on your confirmation screen (e.g. AS-12345 or GBK-12345).</p>
      <div class="to-row">
        <input id="to-input" placeholder="e.g. AS-12345" onkeydown="if(event.key==='Enter')trackOrderLookup();">
        <button class="to-btn" onclick="trackOrderLookup()">Track</button>
      </div>
      <p class="to-error" id="to-error">We couldn't find anything with that reference. Double-check it and try again.</p>
      <div class="to-result" id="to-result"></div>
    </div>
  `;
  document.body.appendChild(wrap);
})();

function openTrackOrderModal(){
  document.getElementById("to-modal").classList.add("open");
  document.getElementById("to-result").style.display = "none";
  document.getElementById("to-error").style.display = "none";
  document.getElementById("to-input").value = "";
  document.getElementById("to-input").focus();
}
function closeTrackOrderModal(){
  document.getElementById("to-modal").classList.remove("open");
}

const PS_ORDER_STATUS_STYLE = {
  "Pending Admin Review": {cls: "orange", label: "⏳ Pending Admin Review"},
  "Processing": {cls: "orange", label: "⏳ Processing"},
  "Out for Delivery": {cls: "blue", label: "🚚 Out for Delivery"},
  "Delivered": {cls: "green", label: "✓ Delivered"},
  "Cancelled": {cls: "grey", label: "✕ Cancelled"},
  "New": {cls: "orange", label: "🟠 Requested"},
  "Confirmed": {cls: "blue", label: "🔵 Confirmed"},
  "Completed": {cls: "green", label: "✓ Completed"}
};
function trackOrderLookup(){
  const ref = document.getElementById("to-input").value.trim().toUpperCase();
  const errEl = document.getElementById("to-error");
  const resEl = document.getElementById("to-result");
  errEl.style.display = "none";
  resEl.style.display = "none";
  if (!ref) return;

  const order = (typeof psGetOrders === "function") ? psGetOrders().find(o => o.id.toUpperCase() === ref) : null;
  const booking = (typeof psGetGarageBookings === "function") ? psGetGarageBookings().find(b => b.id.toUpperCase() === ref) : null;

  if (!order && !booking){
    errEl.style.display = "block";
    return;
  }
  const styleMap = {orange:"background:var(--accent-orange-light,#FFF1E6);color:#8a4a10;", blue:"background:var(--brand-blue-light,#EAF0FE);color:var(--brand-blue-dark,#14399B);", green:"background:var(--success-green-light,#E7F8F1);color:var(--success-green,#1FA37A);", grey:"background:#F3F4F6;color:var(--text-muted,#8A93A3);"};

  if (order){
    const st = PS_ORDER_STATUS_STYLE[order.status] || {cls:"orange", label: order.status};
    const itemNames = order.items.map(i => i.name).join(" + ");
    resEl.innerHTML =
      '<div class="to-id">Order ' + order.id + '</div>' +
      '<span class="to-status" style="' + styleMap[st.cls] + '">' + st.label + '</span>' +
      '<div style="font-size:13.5px;font-weight:600;margin-bottom:4px;">' + itemNames + '</div>' +
      '<div style="font-size:12.5px;color:var(--text-secondary,#57606F);">Placed ' + (order.placedAt || "—") + ' · Total ' + (typeof psFmt === "function" ? psFmt(order.total) : order.total) + '</div>';
  } else {
    const st = PS_ORDER_STATUS_STYLE[booking.status] || {cls:"orange", label: booking.status};
    resEl.innerHTML =
      '<div class="to-id">Garage Booking ' + booking.id + '</div>' +
      '<span class="to-status" style="' + styleMap[st.cls] + '">' + st.label + '</span>' +
      '<div style="font-size:13.5px;font-weight:600;margin-bottom:4px;">' + (booking.garageName || "Garage") + ' — ' + booking.service + '</div>' +
      '<div style="font-size:12.5px;color:var(--text-secondary,#57606F);">' + [booking.date, booking.time].filter(Boolean).join(" ") + '</div>';
  }
  resEl.style.display = "block";
}
