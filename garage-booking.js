/* PartSouq shared "Book a Verified Garage" modal.
   Include after admin-data.js + products-data.js. Call openGarageBookingModal(garageId). */

(function(){
  const style = document.createElement("style");
  style.textContent = `
    #gb-modal{display:none;position:fixed;inset:0;background:rgba(15,20,30,.55);z-index:999;align-items:center;justify-content:center;padding:20px;}
    #gb-modal.open{display:flex;}
    #gb-modal .gb-box{background:#fff;border-radius:14px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto;padding:26px;position:relative;}
    #gb-modal h3{font-size:18px;margin:0 0 4px;color:var(--text,#161B22);}
    #gb-modal p.gb-sub{font-size:13px;color:var(--text-secondary,#57606F);margin:0 0 18px;}
    #gb-modal label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted,#8A93A3);margin-bottom:5px;}
    #gb-modal .gb-field{margin-bottom:14px;}
    #gb-modal input, #gb-modal textarea, #gb-modal select{width:100%;padding:10px;border:1px solid var(--border,#E2E8F0);border-radius:8px;font-size:13.5px;font-family:inherit;box-sizing:border-box;}
    #gb-modal .gb-actions{display:flex;gap:10px;margin-top:18px;}
    #gb-modal .gb-btn{flex:1;padding:11px;border-radius:8px;font-weight:700;font-size:14px;border:1px solid var(--border,#E2E8F0);background:#fff;cursor:pointer;text-align:center;}
    #gb-modal .gb-btn.primary{background:var(--brand-blue,#1E56D8);color:#fff;border:none;}
    #gb-modal .gb-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted,#8A93A3);}
    #gb-modal .gb-success{display:none;text-align:center;padding:20px 0;}
    #gb-modal .gb-success .ok{width:56px;height:56px;border-radius:50%;background:var(--success-green-light,#E7F8F1);color:var(--success-green,#1FA37A);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;}
    #gb-modal .gb-garage-pill{display:inline-flex;align-items:center;gap:6px;background:var(--brand-blue-light,#EAF0FE);color:var(--brand-blue-dark,#14399B);font-size:12px;font-weight:700;padding:6px 12px;border-radius:20px;margin-bottom:16px;}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "gb-modal";
  wrap.innerHTML = `
    <div class="gb-box">
      <button class="gb-close" onclick="closeGarageBookingModal()">✕</button>
      <div id="gb-form-wrap">
        <h3>Book a Garage</h3>
        <p class="gb-sub">Tell us what your car needs — the garage will confirm your slot on WhatsApp.</p>
        <span class="gb-garage-pill" id="gb-garage-pill">🔧 Garage</span>
        <div class="gb-field"><label>Full Name *</label><input id="gb-name" placeholder="Your name"></div>
        <div class="gb-field"><label>WhatsApp Number *</label><input id="gb-wa" placeholder="+971 50 000 0000"></div>
        <div class="gb-field"><label>Service Needed *</label><select id="gb-service"><option value="">Select a service</option></select></div>
        <div class="gb-field"><label>Preferred Date</label><input id="gb-date" type="date"></div>
        <div class="gb-field"><label>Notes</label><textarea id="gb-notes" rows="2" placeholder="Anything the garage should know (car model, issue, etc.)"></textarea></div>
        <div class="gb-actions">
          <button class="gb-btn" onclick="closeGarageBookingModal()">Cancel</button>
          <button class="gb-btn primary" onclick="submitGarageBooking()">Request Booking</button>
        </div>
      </div>
      <div class="gb-success" id="gb-success">
        <div class="ok">✓</div>
        <h3 style="margin-bottom:6px;">Booking Requested</h3>
        <p class="gb-sub">The garage will confirm your appointment on WhatsApp. Reference: <b id="gb-ref"></b></p>
        <div class="gb-actions"><button class="gb-btn primary" style="flex:none;margin:0 auto;" onclick="closeGarageBookingModal()">Done</button></div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  window.__gbCurrentGarage = null;
})();

function openGarageBookingModal(garageId){
  const garage = (typeof PS_GARAGES !== "undefined") ? PS_GARAGES.find(g => g.id === garageId) : null;
  window.__gbCurrentGarage = garage || {id: garageId, name: garageId, specialties: []};
  document.getElementById("gb-garage-pill").textContent = "🔧 " + window.__gbCurrentGarage.name;
  const sel = document.getElementById("gb-service");
  sel.innerHTML = '<option value="">Select a service</option>';
  (window.__gbCurrentGarage.specialties || []).forEach(s => {
    const o = document.createElement("option"); o.value = s; o.textContent = s; sel.appendChild(o);
  });
  const otherOpt = document.createElement("option");
  otherOpt.value = "Other"; otherOpt.textContent = "Other / Not sure";
  sel.appendChild(otherOpt);

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
  const service = document.getElementById("gb-service").value;
  if (!name || !wa || !service){
    alert("Please fill in your name, WhatsApp number, and the service you need.");
    return;
  }
  const garage = window.__gbCurrentGarage || {};
  const booking = psSubmitGarageBooking({
    name: name, phone: wa, service: service,
    date: document.getElementById("gb-date").value,
    notes: document.getElementById("gb-notes").value.trim(),
    garageId: garage.id, garageName: garage.name
  });
  document.getElementById("gb-form-wrap").style.display = "none";
  document.getElementById("gb-success").style.display = "block";
  document.getElementById("gb-ref").textContent = booking.id;
}
