// ESTIMATOR. Part 1 = the maths (pure functions, easy to test). Part 2 = the form on estimate.html.
// Prices come from js/rates.js.

var EstimateCore = (() => {
  const inr = (n) => "\u20B9" + Math.round(n).toLocaleString("en-IN");
  const num = (v) => { const n = parseFloat(String(v == null ? "" : v).replace(/,/g, "")); return isFinite(n) && n > 0 ? n : 0; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Amount in words, Indian style (crore, lakh, thousand)
  const A = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const B = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (n) => (n < 20 ? A[n] : B[Math.floor(n / 10)] + (n % 10 ? " " + A[n % 10] : ""));
  const three = (n) => (n >= 100 ? A[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " : "") : "") + (n % 100 ? two(n % 100) : "");
  function words(n) {
    n = Math.round(n);
    if (!n) return "Rupees Zero Only";
    const parts = [];
    const cr = Math.floor(n / 1e7), lk = Math.floor(n / 1e5) % 100, th = Math.floor(n / 1e3) % 100, rest = n % 1000;
    if (cr) parts.push(three(cr) + " Crore");
    if (lk) parts.push(two(lk) + " Lakh");
    if (th) parts.push(two(th) + " Thousand");
    if (rest) parts.push(three(rest));
    return "Rupees " + parts.join(" ") + " Only";
  }

  // items: [{svc, seats}], inputs: {area, floors, cost, visits}, appt: {mode, fee}, basis: "area-fees" or "project-cost"
  function compute(items, inputs, appt, basis) {
    const lines = [], missing = new Set();
    const area = num(inputs.area) * (num(inputs.floors) || 1);   // total built-up area = area of one floor x number of floors
    const cost = num(inputs.cost), visits = num(inputs.visits) || 1;
    // Step 1: area-based fees. Their subtotal is the "project cost" for the % services (Building).
    const areaFees = area ? items.filter((i) => i.svc.type === "sqft").reduce((t, i) => t + Math.round(area * i.svc.rate), 0) : 0;
    const useAreaFees = basis === "area-fees" && areaFees > 0;
    const base = useAreaFees ? areaFees : cost;
    if (appt) lines.push({ name: APPOINTMENT.name + " (" + appt.mode + ")", detail: APPOINTMENT.detail, qtyText: "1", rateText: inr(appt.fee), unit: APPOINTMENT.unit, amount: appt.fee, note: "" });
    items.forEach(({ svc, seats }) => {
      let qtyText, rateText, amount;
      const notes = [];
      if (svc.type === "sqft") { if (!area) { missing.add("built-up area (sq.ft)"); return; } qtyText = area.toLocaleString("en-IN") + " sq.ft"; rateText = inr(svc.rate); amount = area * svc.rate; }
      else if (svc.type === "percent") {
        if (!base) { missing.add(basis === "area-fees" ? "an area-based service (or the estimated project cost)" : "estimated project cost"); return; }
        qtyText = inr(base); rateText = svc.rate + "%"; amount = (base * svc.rate) / 100;
        if (useAreaFees) notes.push("Calculated on the subtotal of area-based fees.");
      }
      else if (svc.type === "visit") { qtyText = String(visits); rateText = inr(svc.rate); amount = visits * svc.rate; }
      else { const q = num(seats) || 1; qtyText = String(q); rateText = inr(svc.rate); amount = q * svc.rate; }
      if (svc.rateText.indexOf("\u2013") > -1) notes.push("Rate card: " + svc.rateText + ".");
      if (svc.remark) notes.push(svc.remark);
      lines.push({ name: svc.name, detail: svc.detail, qtyText, rateText, unit: svc.unit, amount: Math.round(amount), note: notes.join(" ") });
    });
    const subtotal = lines.reduce((t, l) => t + Math.round(l.amount), 0);
    const gst = Math.round(subtotal * GST_RATE);
    return { lines, missing: [...missing], subtotal, gst, total: subtotal + gst };
  }
  return { inr, num, esc, words, compute };
})();

(() => {
  if (typeof document === "undefined") return;
  const form = document.querySelector("#est-form");
  if (!form) return;
  const { inr, num, esc, words, compute } = EstimateCore;
  const SECTORS = { building: "Building", water: "Water and Waste Water Engineering", education: "Education" };
  const box = form.querySelector("#services"), live = form.querySelector("#live"), errors = form.querySelector("#errors");
  const groups = { sqft: form.querySelector("#grp-area"), percent: form.querySelector("#grp-cost"), visit: form.querySelector("#grp-visits") };
  const basisNote = document.querySelector("#basis-note"), costHint = document.querySelector("#cost-hint");
  const result = document.querySelector("#result"), sheet = document.querySelector("#sheet");
  const sector = () => form.elements.sector.value;
  let last = null;

  function renderServices() {
    box.innerHTML = RATES[sector()].map((s, i) =>
      `<div class="svc"><label><input type="checkbox" name="svc" value="${i}"><span><strong>${esc(s.name)}</strong><small>${esc(s.detail)}</small><em>${esc(s.rateText)}</em>${s.remark ? `<small class="remark">${esc(s.remark)}</small>` : ""}</span></label>` +
      (s.type === "course" ? `<label class="qty">Seats <input type="number" min="1" value="1" data-qty="${i}" disabled></label>` : "") + `</div>`).join("");
    update();
  }
  function selected() {
    return [...form.querySelectorAll('input[name="svc"]:checked')].map((c) => {
      const q = form.querySelector(`input[data-qty="${c.value}"]`);
      return { svc: RATES[sector()][c.value], seats: q ? q.value : 1 };
    });
  }
  function current() {
    const f = form.elements;
    return compute(selected(), { area: f.area.value, floors: f.floors.value, cost: f.cost.value, visits: f.visits.value }, { mode: f.amode.value, fee: APPOINTMENT_FEES[f.amode.value] }, PERCENT_BASIS[sector()]);
  }
  function update() {
    form.querySelectorAll("input[data-qty]").forEach((q) => { q.disabled = !form.querySelector(`input[name="svc"][value="${q.dataset.qty}"]`).checked; });
    const types = new Set(selected().map((x) => x.svc.type));
    const fromArea = PERCENT_BASIS[sector()] === "area-fees";
    groups.sqft.hidden = !types.has("sqft");
    groups.visit.hidden = !types.has("visit");
    // Building: the project cost is worked out from the area-based fees, so only ask for it if no area-based service is ticked
    groups.percent.hidden = !types.has("percent") || (fromArea && types.has("sqft"));
    basisNote.hidden = !fromArea;
    costHint.textContent = fromArea ? "No area-based service is selected, so please enter the estimated project cost. Or tick an area-based service and it will be calculated for you." : "Used for fees charged as a percentage of project cost.";
    live.textContent = inr(current().total);
  }

  const dmy = (d) => String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear();
  const prettyDate = (v) => { if (!v) return ""; const [y, m, d] = v.split("-"); return d + "." + m + "." + y; };

  function summaryText(r, no) {
    const f = form.elements;
    const appt = [prettyDate(f.adate.value), f.atime.value, f.amode.value].filter(Boolean).join(", ");
    return "Appointment request / estimate enquiry (" + no + ")\n\nName: " + f.fullname.value.trim() + "\nPhone: " + f.phone.value.trim() +
      (f.email.value.trim() ? "\nEmail: " + f.email.value.trim() : "") + (f.city.value.trim() ? "\nCity: " + f.city.value.trim() : "") +
      "\nPreferred appointment: " + (appt || "not specified") + "\nService area: " + SECTORS[sector()] + "\n\nServices:\n" +
      r.lines.map((l) => "- " + l.name + ": " + l.qtyText + " x " + l.rateText + " = " + inr(l.amount)).join("\n") +
      "\n\nSubtotal: " + inr(r.subtotal) + "\nGST 18%: " + inr(r.gst) + "\nEstimated total (incl. GST): " + inr(r.total);
  }

  function show(r) {
    const f = form.elements, now = new Date();
    const no = "EST-" + String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "-" + String(Math.floor(100 + Math.random() * 900));
    const appt = [prettyDate(f.adate.value), f.atime.value, f.amode.value].filter(Boolean).join(", ");
    const row = (k, v) => (v ? `<tr><th>${k}</th><td>${esc(v)}</td></tr>` : "");
    sheet.innerHTML =
      `<div class="sheet-head"><img src="images/aaecpl-logo.jpg" alt="AAECPL" width="719" height="118"><p><strong>AAECPL</strong><br>GST No. 19ABBCA6101F1Z4<br>Old Fire Station, Bhikhanpur<br>Bhagalpur \u2013 812001, Bihar<br>Contact Number-7739705994<br>anjaneyaengineeringconsultants.com</p></div>` +
      `<h2>Estimated Consultancy Fees</h2>` +
      `<div class="sheet-meta"><table class="kv"><tr><th colspan="2">BILL TO:</th></tr>${row("Name", f.fullname.value.trim())}${row("GST", f.gst.value.trim())}${row("Address", f.address.value.trim())}${row("City, State", f.city.value.trim())}${row("Contact Number", f.phone.value.trim())}${row("Email", f.email.value.trim())}</table>` +
      `<table class="kv"><tr><th>ESTIMATE NO.</th><td>${no}</td></tr><tr><th>DATE</th><td>${dmy(now)}</td></tr><tr><th>SERVICE AREA</th><td>${esc(SECTORS[sector()])}</td></tr>${row("PREFERRED APPOINTMENT", appt)}</table></div>` +
      `<div class="tablewrap"><table class="lines"><thead><tr><th>#</th><th>Description</th><th>Quantity</th><th>Rate</th><th>Unit</th><th>Amount (excl. GST)</th></tr></thead><tbody>` +
      r.lines.map((l, i) => `<tr><td>${i + 1}</td><td><strong>${esc(l.name)}</strong><br><span class="small">${esc(l.detail)}</span>${l.note ? `<br><span class="small">${esc(l.note)}</span>` : ""}</td><td class="r">${esc(l.qtyText)}</td><td class="r">${esc(l.rateText)}</td><td>${esc(l.unit)}</td><td class="r">${inr(l.amount)}</td></tr>`).join("") +
      `</tbody><tfoot><tr><td colspan="5" class="r">Subtotal</td><td class="r">${inr(r.subtotal)}</td></tr><tr><td colspan="5" class="r">GST @ 18%</td><td class="r">${inr(r.gst)}</td></tr><tr class="grand"><td colspan="5" class="r">TOTAL (lump sum, incl. GST)</td><td class="r">${inr(r.total)}</td></tr></tfoot></table></div>` +
      `<p class="words"><strong>${words(r.total)}</strong></p>` +
      `<div class="terms"><h3>Terms &amp; Conditions:</h3><p>This is a computer-generated, indicative estimate based on the AAECPL rate card and the details you entered. It is not a final quotation. Final fees will be confirmed by AAECPL after reviewing the project. Where the rate card gives a range, the lower rate is used.</p></div>`;
    last = { r, no };
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("input", update);
  form.addEventListener("change", (e) => { if (e.target.name === "sector") renderServices(); else update(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, problems = [], r = current();
    if (!f.fullname.value.trim()) problems.push("your name");
    if (f.phone.value.replace(/\D/g, "").length < 10) problems.push("a 10-digit phone number");
    if (!selected().length) problems.push("at least one service");
    r.missing.forEach((m) => problems.push(m));
    if (problems.length) { errors.textContent = "Please add: " + problems.join(", ") + "."; return; }
    errors.textContent = "";
    show(r);
  });

  // Buttons under the estimate
  document.querySelector("#btn-print").addEventListener("click", () => {
    const old = document.title; document.title = "AAECPL Estimate " + last.no; window.print(); document.title = old;
  });
  document.querySelector("#btn-mail").addEventListener("click", () => {
    window.location.href = "mailto:contact@anjaneyaengineeringconsultants.com?subject=" + encodeURIComponent("Appointment request " + last.no + " - " + form.elements.fullname.value.trim()) + "&body=" + encodeURIComponent(summaryText(last.r, last.no));
  });
  document.querySelector("#btn-wa").addEventListener("click", () => {
    window.open("https://wa.me/917739705994?text=" + encodeURIComponent(summaryText(last.r, last.no)), "_blank", "noopener");
  });
  document.querySelector("#btn-edit").addEventListener("click", () => { form.scrollIntoView({ behavior: "smooth" }); });

  const fees = Object.keys(APPOINTMENT_FEES);
  form.elements.amode.innerHTML = fees.map((k) => `<option value="${esc(k)}">${esc(k)} (${inr(APPOINTMENT_FEES[k])})</option>`).join("");
  document.querySelector("#appt-hint").textContent = "A one-time appointment fee applies to each estimate: " + fees.map((k) => k + " " + inr(APPOINTMENT_FEES[k])).join(", ") + ".";
  basisNote.textContent = "Fees charged as a percentage of project cost (DPR, PMC, Cost Estimation, Tender) are calculated on the subtotal of the area-based fees you select. GST is added at the end.";
  form.elements.adate.min = new Date().toISOString().slice(0, 10);
  renderServices();
})();
