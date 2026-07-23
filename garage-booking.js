/* Auto Corner shared "Book a Verified Garage" modal.
   Include after admin-data.js + products-data.js. Call openGarageBookingModal(garageId).
   Shows the garage's real profile data (rating, jobs completed, ETA, price range,
   coverage, specialties — all from PS_GARAGES / admin-data.js, nothing invented
   per-open) followed by a real booking form, and posts to psSubmitGarageBooking()
   so it shows up for real in Admin > Garage Bookings and the seller/garage portal. */

(function(){
  const style = document.createElement("style");
  style.textContent = `
    #gb-modal{display:none;position:fixed;inset:0;background:rgba(15,20,30,.6);z-index:999;align-items:center;justify-content:center;padding:20px;}
    #gb-modal.open{display:flex;}
    #gb-modal .gb-box{background:#fff;border-radius:16px;max-width:460px;width:100%;max-height:92vh;overflow-y:auto;position:relative;}
    #gb-modal .gb-cover{height:150px;background:linear-gradient(135deg,#1b2436,#0e1420);position:relative;display:flex;align-items:flex-end;padding:18px 22px;color:#fff;border-radius:16px 16px 0 0;}
    #gb-modal .gb-cover .gb-cover-icon{position:absolute;top:16px;left:18px;font-size:26px;opacity:.35;}
    #gb-modal .gb-cover h3{margin:0 0 2px;font-size:19px;}
    #gb-modal .gb-cover .gb-loc{font-size:12.5px;opacity:.85;}
    #gb-modal .gb-close{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.35);border:none;font-size:16px;cursor:pointer;color:#fff;width:30px;height:30px;border-radius:50%;}
    #gb-modal .gb-body{padding:20px 24px 26px;}
    #gb-modal .gb-statrow{display:flex;align-items:center;gap:6px;font-size:13.5px;padding:9px 0;border-bottom:1px solid var(--border,#E2E8F0);color:var(--text,#161B22);}
    #gb-modal .gb-statrow:first-of-type{padding-top:0;}
    #gb-modal .gb-statrow b{font-weight:700;}
    #gb-modal .gb-services-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted,#8A93A3);margin:14px 0 8px;}
    #gb-modal .gb-chip{display:inline-block;background:var(--success-green-light,#E7F8F1);color:var(--success-green,#1FA37A);font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:20px;margin:0 6px 6px 0;}
    #gb-modal .gb-formhead{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;margin:20px 0 4px;}
    #gb-modal p.gb-sub{font-size:12.5px;color:var(--text-secondary,#57606F);margin:0 0 16px;}
    #gb-modal label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted,#8A93A3);margin-bottom:5px;}
    #gb-modal .gb-field{margin-bottom:14px;}
    #gb-modal .gb-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    #gb-modal input, #gb-modal textarea, #gb-modal select{width:100%;padding:10px;border:1px solid var(--border,#E2E8F0);border-radius:8px;font-size:13.5px;font-family:inherit;box-sizing:border-box;}
    #gb-modal .gb-notice{display:flex;gap:8px;background:var(--brand-blue-light,#EAF0FE);color:var(--brand-blue-dark,#14399B);border-radius:9px;padding:11px 13px;font-size:12px;margin-bottom:12px;}
    #gb-modal .gb-notice.warn{background:var(--accent-orange-light,#FFF1E6);color:#8a4a10;}
    #gb-modal .gb-actions{display:flex;gap:10px;margin-top:6px;}
    #gb-modal .gb-btn{flex:1;padding:12px;border-radius:8px;font-weight:700;font-size:14px;border:1px solid var(--border,#E2E8F0);background:#fff;cursor:pointer;text-align:center;}
    #gb-modal .gb-btn.primary{background:var(--brand-blue,#1E56D8);color:#fff;border:none;}
    #gb-modal .gb-success{display:none;text-align:center;padding:26px 24px 30px;}
    #gb-modal .gb-success .ok{width:56px;height:56px;border-radius:50%;background:var(--success-green-light,#E7F8F1);color:var(--success-green,#1FA37A);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;}
    #gb-modal .gb-success h3{margin:0 0 8px;font-size:19px;}
    #gb-modal .gb-refbox{background:var(--bg-alt,#F5F7FA);border-radius:9px;padding:14px;margin:16px 0;font-size:13px;text-align:left;}
    #gb-modal .gb-refbox b{display:block;font-family:monospace;font-size:15px;margin-top:2px;}
    #gb-toast{position:fixed;bottom:20px;right:20px;background:#10192E;color:#fff;padding:12px 18px;border-radius:10px;font-size:13px;display:none;align-items:center;gap:8px;z-index:1100;box-shadow:0 8px 24px rgba(0,0,0,.25);}
    #gb-toast.show{display:flex;}
    @media (max-width:480px){ #gb-modal .gb-row2{grid-template-columns:1fr;} }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "gb-modal";
  wrap.innerHTML = `
    <div class="gb-box">
      <div class="gb-cover">
        <span class="gb-cover-icon">🔧</span>
        <button class="gb-close" onclick="closeGarageBookingModal()">✕</button>
        <div>
          <h3 id="gb-garage-name">Garage</h3>
          <div class="gb-loc" id="gb-garage-loc">📍 Location</div>
        </div>
      </div>
      <div class="gb-body">
        <div id="gb-form-wrap">
          <div class="gb-statrow">⭐ <b id="gb-rating"></b> — <span id="gb-jobs"></span> jobs completed</div>
          <div class="gb-statrow">⏱ Estimated arrival: <b id="gb-eta"></b></div>
          <div class="gb-statrow">🏷 Price range: <b id="gb-pricerange"></b></div>
          <div class="gb-statrow">📍 Coverage: <b id="gb-coverage"></b></div>
          <div class="gb-services-label">Services Offered</div>
          <div id="gb-services"></div>

          <div class="gb-formhead">📅 Book This Garage</div>
          <p class="gb-sub">Tell us what your car needs — the garage will confirm your slot on WhatsApp.</p>
          <div class="gb-field"><label>Your Name *</label><input id="gb-name" placeholder="Full name"></div>
          <div class="gb-field"><label>WhatsApp *</label><input id="gb-wa" placeholder="+971 50 000 0000"></div>
          <div class="gb-field gb-row2">
            <div><label>Preferred Date *</label><input id="gb-date" type="date"></div>
            <div><label>Preferred Time *</label><select id="gb-time"><option value="">Select</option><option>Morning (9am–12pm)</option><option>Afternoon (12pm–4pm)</option><option>Evening (4pm–7pm)</option></select></div>
          </div>
          <div class="gb-field"><label>Car Details *</label><input id="gb-car" placeholder="e.g. Toyota Land Cruiser LC200 2018 GCC"></div>
          <div class="gb-field"><label>Service Required *</label><select id="gb-service"><option value="">Select service</option></select></div>
          <div class="gb-field"><label>Issue Description</label><textarea id="gb-notes" rows="2" placeholder="Describe the issue or work needed..."></textarea></div>
          <div class="gb-field"><label>Pickup Required?</label><select id="gb-pickup"><option value="no">No — I will bring the car</option><option value="yes">Yes — pick up my car (+fee)</option></select></div>

          <div class="gb-notice">ℹ️ Pay cash directly to the garage after service completion &amp; your inspection approval. All Auto Corner partners — Cash on Delivery only.</div>
          <div class="gb-notice warn" id="gb-pickup-warn" style="display:none;">⚠ Pickup &amp; drop adds an extra cost based on distance — the garage will confirm the exact fee on WhatsApp.</div>

          <div class="gb-actions">
            <button class="gb-btn" onclick="closeGarageBookingModal()">Cancel</button>
            <button class="gb-btn primary" onclick="submitGarageBooking()">📅 Confirm Booking</button>
          </div>
        </div>
        <div class="gb-success" id="gb-success">
          <div class="ok">✓</div>
          <h3>Booking Confirmed!</h3>
          <p class="gb-sub" id="gb-success-msg"></p>
          <div class="gb-refbox">
            <span style="color:var(--text-muted,#8A93A3);">Booking Reference</span>
            <b id="gb-ref"></b>
          </div>
          <div class="gb-notice warn">⚠ All Auto Corner partners — Cash on Delivery only. Auto Corner will never ask for your bank details.</div>
          <button class="gb-btn primary" style="width:100%;" onclick="closeGarageBookingModal()">Done</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  const toast = document.createElement("div");
  toast.id = "gb-toast";
  document.body.appendChild(toast);

  window.__gbCurrentGarage = null;
})();

function gbStars(rating){
  const full = Math.round(rating);
  return "★".repeat(Math.min(5, full)) + "☆".repeat(Math.max(0, 5 - full));
}

function openGarageBookingModal(garageId){
  const garage = (typeof psGetGarages === "function")
    ? psGetGarages().find(g => g.id === garageId)
    : ((typeof PS_GARAGES !== "undefined") ? PS_GARAGES.find(g => g.id === garageId) : null);
  window.__gbCurrentGarage = garage || {id: garageId, name: garageId, specialties: []};
  const g = window.__gbCurrentGarage;

  document.getElementById("gb-garage-name").textContent = g.name;
  document.getElementById("gb-garage-loc").textContent = "📍 " + [g.area, g.emirate].filter(Boolean).join(", ");
  document.getElementById("gb-rating").textContent = (g.rating || "—") + " " + (g.rating ? gbStars(g.rating) : "");
  document.getElementById("gb-jobs").textContent = (g.jobs || 0);
  document.getElementById("gb-eta").textContent = (g.etaMin && g.etaMax) ? (g.etaMin + "–" + g.etaMax + " min") : "Confirmed on WhatsApp";
  document.getElementById("gb-pricerange").textContent = (g.priceMin && g.priceMax) ? ("AED " + g.priceMin + "–" + g.priceMax) : "Varies by job";
  document.getElementById("gb-coverage").textContent = g.emirate || "UAE";

  const chipsWrap = document.getElementById("gb-services");
  chipsWrap.innerHTML = "";
  (g.specialties || []).forEach(s => {
    const chip = document.createElement("span");
    chip.className = "gb-chip";
    chip.textContent = s;
    chipsWrap.appendChild(chip);
  });

  const sel = document.getElementById("gb-service");
  sel.innerHTML = '<option value="">Select service</option>';
  (g.specialties || []).forEach(s => {
    const o = document.createElement("option"); o.value = s; o.textContent = s; sel.appendChild(o);
  });
  const otherOpt = document.createElement("option");
  otherOpt.value = "Other"; otherOpt.textContent = "Other / Not sure";
  sel.appendChild(otherOpt);

  document.getElementById("gb-pickup").value = "no";
  document.getElementById("gb-pickup-warn").style.display = "none";
  document.getElementById("gb-pickup").onchange = function(){
    document.getElementById("gb-pickup-warn").style.display = (this.value === "yes") ? "flex" : "none";
  };

  document.getElementById("gb-modal").classList.add("open");
  document.getElementById("gb-form-wrap").style.display = "block";
  document.getElementById("gb-success").style.display = "none";
}
function closeGarageBookingModal(){
  document.getElementById("gb-modal").classList.remove("open");
}
function submitGarageBooking(){
  const name = document.getElementById("gb-name").value.trim();
  const wa = document.getElementById("gb-wa").value.trim();
  const date = document.getElementById("gb-date").value;
  const time = document.getElementById("gb-time").value;
  const car = document.getElementById("gb-car").value.trim();
  const service = document.getElementById("gb-service").value;
  if (!name || !wa || !date || !time || !car || !service){
    alert("Please fill in your name, WhatsApp number, preferred date/time, car details and the service you need.");
    return;
  }
  const garage = window.__gbCurrentGarage || {};
  const booking = psSubmitGarageBooking({
    name: name, phone: wa, service: service, date: date, time: time,
    carDetails: car,
    issueDescription: document.getElementById("gb-notes").value.trim(),
    pickupRequired: document.getElementById("gb-pickup").value,
    garageId: garage.id, garageName: garage.name
  });
  document.getElementById("gb-form-wrap").style.display = "none";
  document.getElementById("gb-success").style.display = "block";
  document.getElementById("gb-success-msg").textContent =
    "Your booking at " + garage.name + " has been submitted. The garage will confirm via WhatsApp within 10–20 minutes.";
  document.getElementById("gb-ref").textContent = booking.id;

  const toast = document.getElementById("gb-toast");
  toast.textContent = "✓ Garage booking confirmed: " + booking.id;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}
