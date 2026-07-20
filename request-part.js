/* PartSouq shared "Request a Part" modal.
   Include after admin-data.js. Call openRequestPartModal() from any button. */

(function(){
  const style = document.createElement("style");
  style.textContent = `
    #rp-modal{display:none;position:fixed;inset:0;background:rgba(15,20,30,.55);z-index:999;align-items:center;justify-content:center;padding:20px;}
    #rp-modal.open{display:flex;}
    #rp-modal .rp-box{background:#fff;border-radius:14px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto;padding:26px;}
    #rp-modal h3{font-size:18px;margin:0 0 4px;color:var(--text,#161B22);}
    #rp-modal p.rp-sub{font-size:13px;color:var(--text-secondary,#57606F);margin:0 0 18px;}
    #rp-modal label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted,#8A93A3);margin-bottom:5px;}
    #rp-modal .rp-field{margin-bottom:14px;}
    #rp-modal input, #rp-modal textarea{width:100%;padding:10px;border:1px solid var(--border,#E2E8F0);border-radius:8px;font-size:13.5px;font-family:inherit;box-sizing:border-box;}
    #rp-modal .rp-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    #rp-modal .rp-actions{display:flex;gap:10px;margin-top:18px;}
    #rp-modal .rp-btn{flex:1;padding:11px;border-radius:8px;font-weight:700;font-size:14px;border:1px solid var(--border,#E2E8F0);background:#fff;cursor:pointer;text-align:center;}
    #rp-modal .rp-btn.primary{background:var(--brand-blue,#1E56D8);color:#fff;border:none;}
    #rp-modal .rp-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted,#8A93A3);}
    #rp-modal .rp-box{position:relative;}
    #rp-modal .rp-success{display:none;text-align:center;padding:20px 0;}
    #rp-modal .rp-success .ok{width:56px;height:56px;border-radius:50%;background:var(--success-green-light,#E7F8F1);color:var(--success-green,#1FA37A);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "rp-modal";
  wrap.innerHTML = `
    <div class="rp-box">
      <button class="rp-close" onclick="closeRequestPartModal()">✕</button>
      <div id="rp-form-wrap">
        <h3>Request a Part</h3>
        <p class="rp-sub">Can't find it in search? Tell us what you need and a verified seller will get back to you.</p>
        <div class="rp-field"><label>Full Name *</label><input id="rp-name" placeholder="Your name"></div>
        <div class="rp-field"><label>WhatsApp Number *</label><input id="rp-wa" placeholder="+971 50 000 0000"></div>
        <div class="rp-row">
          <div class="rp-field"><label>Car Brand</label><input id="rp-brand" list="rp-brand-list" placeholder="e.g. Toyota"><datalist id="rp-brand-list"></datalist></div>
          <div class="rp-field"><label>Car Model</label><input id="rp-model" list="rp-model-list" placeholder="e.g. Camry"><datalist id="rp-model-list"></datalist></div>
        </div>
        <div class="rp-row">
          <div class="rp-field"><label>Year</label><input id="rp-year" type="number" min="1990" max="2026" placeholder="e.g. 2020"></div>
          <div class="rp-field"><label>Part Needed *</label><input id="rp-part" placeholder="e.g. Headlight assembly"></div>
        </div>
        <div class="rp-field"><label>Extra Details</label><textarea id="rp-desc" rows="2" placeholder="Any extra info that helps sellers find the right part"></textarea></div>
        <div class="rp-actions">
          <button class="rp-btn" onclick="closeRequestPartModal()">Cancel</button>
          <button class="rp-btn primary" onclick="submitRequestPart()">Submit Request</button>
        </div>
      </div>
      <div class="rp-success" id="rp-success">
        <div class="ok">✓</div>
        <h3 style="margin-bottom:6px;">Request Sent</h3>
        <p class="rp-sub">We'll reach out on WhatsApp once a verified seller has your part. Reference: <b id="rp-ref"></b></p>
        <div class="rp-actions"><button class="rp-btn primary" style="flex:none;margin:0 auto;" onclick="closeRequestPartModal()">Done</button></div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof CAR_DB === "undefined") return;
    const brandList = document.getElementById("rp-brand-list");
    Object.keys(CAR_DB).forEach(b => {
      const o = document.createElement("option"); o.value = b; brandList.appendChild(o);
    });
    document.getElementById("rp-brand").addEventListener("input", e => {
      const modelList = document.getElementById("rp-model-list");
      modelList.innerHTML = "";
      const models = CAR_DB[e.target.value];
      if (models) models.forEach(m => { const o = document.createElement("option"); o.value = m; modelList.appendChild(o); });
    });
  });
})();

function openRequestPartModal(prefillPart){
  document.getElementById("rp-modal").classList.add("open");
  document.getElementById("rp-form-wrap").style.display = "block";
  document.getElementById("rp-success").style.display = "none";
  if (prefillPart) document.getElementById("rp-part").value = prefillPart;
}
function closeRequestPartModal(){
  document.getElementById("rp-modal").classList.remove("open");
}
function submitRequestPart(){
  const name = document.getElementById("rp-name").value.trim();
  const wa = document.getElementById("rp-wa").value.trim();
  const part = document.getElementById("rp-part").value.trim();
  if (!name || !wa || !part){
    alert("Please fill in your name, WhatsApp number, and the part you need.");
    return;
  }
  const req = psSubmitPartRequest({
    name: name, phone: wa,
    brand: document.getElementById("rp-brand").value.trim(),
    model: document.getElementById("rp-model").value.trim(),
    year: document.getElementById("rp-year").value.trim(),
    part: part,
    desc: document.getElementById("rp-desc").value.trim()
  });
  document.getElementById("rp-form-wrap").style.display = "none";
  document.getElementById("rp-success").style.display = "block";
  document.getElementById("rp-ref").textContent = req.id;
}
