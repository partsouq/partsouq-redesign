/* PartSouq shared "Request a Part" modal.
   Include after admin-data.js. Call openRequestPartModal() from any button. */

(function(){
  const style = document.createElement("style");
  style.textContent = `
    #rp-modal{display:none;position:fixed;inset:0;background:rgba(15,20,30,.55);z-index:999;align-items:center;justify-content:center;padding:20px;}
    #rp-modal.open{display:flex;}
    #rp-modal .rp-box{background:#fff;border-radius:14px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;padding:26px;}
    #rp-modal h3{font-size:18px;margin:0 0 4px;color:var(--text,#161B22);}
    #rp-modal p.rp-sub{font-size:13px;color:var(--text-secondary,#57606F);margin:0 0 18px;}
    #rp-modal label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--text-muted,#8A93A3);margin-bottom:5px;}
    #rp-modal .rp-field{margin-bottom:14px;}
    #rp-modal input, #rp-modal textarea, #rp-modal select{width:100%;padding:10px;border:1px solid var(--border,#E2E8F0);border-radius:8px;font-size:13.5px;font-family:inherit;box-sizing:border-box;background:#fff;color:var(--text,#161B22);}
    #rp-modal .rp-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    #rp-modal .rp-actions{display:flex;gap:10px;margin-top:18px;}
    #rp-modal .rp-btn{flex:1;padding:11px;border-radius:8px;font-weight:700;font-size:14px;border:1px solid var(--border,#E2E8F0);background:#fff;cursor:pointer;text-align:center;}
    #rp-modal .rp-btn.primary{background:var(--brand-blue,#1E56D8);color:#fff;border:none;}
    #rp-modal .rp-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted,#8A93A3);}
    #rp-modal .rp-box{position:relative;}
    #rp-modal .rp-success{display:none;text-align:center;padding:20px 0;}
    #rp-modal .rp-success .ok{width:56px;height:56px;border-radius:50%;background:var(--success-green-light,#E7F8F1);color:var(--success-green,#1FA37A);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;}
    #rp-modal .rp-upload{border:1.5px dashed var(--border,#E2E8F0);border-radius:9px;padding:12px 8px;text-align:center;cursor:pointer;font-size:11.5px;color:var(--text-secondary,#57606F);text-transform:none;letter-spacing:normal;font-weight:400;}
    #rp-modal .rp-upload .rp-up-ic{font-size:18px;margin-bottom:4px;}
    #rp-modal .rp-upload b{display:block;font-size:12.5px;color:var(--text,#161B22);margin-bottom:2px;font-weight:700;text-transform:none;}
    #rp-modal .rp-upload.has-file{border-style:solid;border-color:var(--success-green,#1FA37A);background:var(--success-green-light,#E7F8F1);}
    #rp-modal .rp-upload img{max-height:40px;border-radius:5px;margin-bottom:4px;}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement("div");
  wrap.id = "rp-modal";
  wrap.innerHTML = `
    <div class="rp-box">
      <button class="rp-close" onclick="closeRequestPartModal()">✕</button>
      <div id="rp-form-wrap">
        <h3>Request a Part</h3>
        <p class="rp-sub">Can't find the part you need? Tell us about your car and the part, and our team will source it and send you a price on WhatsApp.</p>
        <div class="rp-field"><label>Full Name *</label><input id="rp-name" placeholder="Your name"></div>
        <div class="rp-field"><label>WhatsApp Number *</label><input id="rp-wa" placeholder="+971 50 000 0000"></div>
        <div class="rp-row">
          <div class="rp-field"><label>Car Brand *</label><input id="rp-brand" list="rp-brand-list" placeholder="Select or type your own"><datalist id="rp-brand-list"></datalist></div>
          <div class="rp-field"><label>Car Model / Car Name *</label><input id="rp-model" list="rp-model-list" placeholder="Select brand first, or type your own"><datalist id="rp-model-list"></datalist></div>
        </div>
        <div class="rp-row">
          <div class="rp-field"><label>Year</label><input id="rp-year" type="number" min="1990" max="2026" placeholder="e.g. 2020"></div>
          <div class="rp-field"><label>Chassis No. / VIN No.</label><input id="rp-chassis" placeholder="e.g. JTMHE3FJ8MD..."></div>
        </div>
        <div class="rp-field">
          <label>Part Name / Description *</label>
          <select id="rp-part-select" style="margin-bottom:8px;">
            <option value="">Select part name (or choose Other to type your own)</option>
          </select>
          <input id="rp-part-other" placeholder="Type the part name" style="display:none;margin-bottom:8px;">
          <textarea id="rp-desc" rows="2" placeholder="e.g. Front-left headlight assembly, LED type"></textarea>
        </div>
        <div class="rp-row">
          <label class="rp-upload" id="rp-photo-label" for="rp-photo">
            <div class="rp-up-ic">📷</div><b>Upload part photo</b>Optional — helps us find it faster
            <input id="rp-photo" type="file" accept="image/*" style="display:none;">
          </label>
          <label class="rp-upload" id="rp-mulkiya-label" for="rp-mulkiya">
            <div class="rp-up-ic">📄</div><b>Upload Mulkiya *</b>Vehicle registration card
            <input id="rp-mulkiya" type="file" accept="image/*,.pdf" style="display:none;">
          </label>
        </div>
        <div class="rp-actions">
          <button class="rp-btn" onclick="closeRequestPartModal()">Cancel</button>
          <button class="rp-btn primary" onclick="submitRequestPart()">Submit Request</button>
        </div>
        <p style="font-size:11px;color:var(--text-muted,#8A93A3);text-align:center;margin:10px 0 0;">We'll confirm your request and share pricing on WhatsApp — no payment needed to submit.</p>
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

  let rpPhotoData = null, rpMulkiyaData = null;

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

    if (typeof PS_PRODUCTS !== "undefined") {
      const sel = document.getElementById("rp-part-select");
      [...new Set(PS_PRODUCTS.map(p => p.name))].forEach(n => {
        const o = document.createElement("option"); o.value = n; o.textContent = n; sel.appendChild(o);
      });
      const otherOpt = document.createElement("option");
      otherOpt.value = "__other__"; otherOpt.textContent = "Other (type my own)";
      sel.appendChild(otherOpt);
      sel.addEventListener("change", () => {
        document.getElementById("rp-part-other").style.display = sel.value === "__other__" ? "block" : "none";
      });
    }

    function wireUpload(inputId, labelId, setter){
      const input = document.getElementById(inputId);
      const label = document.getElementById(labelId);
      input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          setter(e.target.result);
          label.classList.add("has-file");
          const isImg = file.type.startsWith("image/");
          label.innerHTML = (isImg ? '<img src="' + e.target.result + '">' : '<div class="rp-up-ic">✅</div>') +
            '<b>' + file.name + '</b>Selected — tap to change';
          label.appendChild(input);
        };
        reader.readAsDataURL(file);
      });
    }
    wireUpload("rp-photo", "rp-photo-label", v => rpPhotoData = v);
    wireUpload("rp-mulkiya", "rp-mulkiya-label", v => rpMulkiyaData = v);
  });

  window.__rpGetUploads = () => ({photo: rpPhotoData, mulkiya: rpMulkiyaData});
  window.__rpResetUploads = () => { rpPhotoData = null; rpMulkiyaData = null; };
})();

function openRequestPartModal(prefillPart){
  document.getElementById("rp-modal").classList.add("open");
  document.getElementById("rp-form-wrap").style.display = "block";
  document.getElementById("rp-success").style.display = "none";
  if (prefillPart) {
    const sel = document.getElementById("rp-part-select");
    const match = [...sel.options].find(o => o.value === prefillPart);
    if (match) { sel.value = prefillPart; }
    else { sel.value = "__other__"; document.getElementById("rp-part-other").style.display = "block"; document.getElementById("rp-part-other").value = prefillPart; }
  }
}
function closeRequestPartModal(){
  document.getElementById("rp-modal").classList.remove("open");
}
function submitRequestPart(){
  const name = document.getElementById("rp-name").value.trim();
  const wa = document.getElementById("rp-wa").value.trim();
  const sel = document.getElementById("rp-part-select");
  const part = sel.value === "__other__" ? document.getElementById("rp-part-other").value.trim() : sel.value;
  const uploads = window.__rpGetUploads();
  if (!name || !wa || !part){
    alert("Please fill in your name, WhatsApp number, and the part you need.");
    return;
  }
  if (!uploads.mulkiya){
    alert("Please upload your Mulkiya (vehicle registration card) — it helps us confirm the exact fitment for your car.");
    return;
  }
  const req = psSubmitPartRequest({
    name: name, phone: wa,
    brand: document.getElementById("rp-brand").value.trim(),
    model: document.getElementById("rp-model").value.trim(),
    year: document.getElementById("rp-year").value.trim(),
    chassis: document.getElementById("rp-chassis").value.trim(),
    part: part,
    desc: document.getElementById("rp-desc").value.trim(),
    photo: uploads.photo,
    mulkiya: uploads.mulkiya
  });
  document.getElementById("rp-form-wrap").style.display = "none";
  document.getElementById("rp-success").style.display = "block";
  document.getElementById("rp-ref").textContent = req.id;
  window.__rpResetUploads();
}
