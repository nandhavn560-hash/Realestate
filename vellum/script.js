/* ---------------- Sample data ---------------- */
const listings = [
  {id:1, addr:"14 Blackwell Ridge", loc:"Blackwell Ridge, hillside", price:5250000, beds:5, baths:5, sqft:6100, tag:"New", style:"gable", agent:"M. Osei", agentTitle:"Senior Advisor", desc:"A commanding hillside residence with a cantilevered great room, oak-lined library, and a motor court framed by mature cypress. The lower terrace steps down to a lap pool set into the ridge line."},
  {id:2, addr:"221 Founders Walk", loc:"Founders Walk, town center", price:3180000, beds:4, baths:4, sqft:4200, tag:"Reduced", style:"townhouse", agent:"R. Calder", agentTitle:"Listing Partner", desc:"An 1890s townhouse restored plank by plank, pairing original plaster cornices with a discreet modern kitchen wing. Private garden entrance from the mews behind."},
  {id:3, addr:"9 Marrow Lane", loc:"Marrow Lane, waterside", price:7400000, beds:6, baths:6, sqft:7800, tag:"Waterfront", style:"modern", agent:"M. Osei", agentTitle:"Senior Advisor", desc:"Glass and board-formed concrete meet the water's edge. Full-height sliding walls open the living floor to a cantilevered dock and heated plunge pool."},
  {id:4, addr:"58 Aldergate Close", loc:"Aldergate Close, orchard district", price:2450000, beds:3, baths:3, sqft:3100, tag:"New", style:"farmhouse", agent:"S. Bianchi", agentTitle:"Associate Advisor", desc:"A reimagined stone farmhouse on two acres of working orchard. Reclaimed beams, a wood-fired hearth, and a converted barn studio round out the grounds."},
  {id:5, addr:"3 Cathcart Terrace", loc:"Cathcart Terrace, hillside", price:4650000, beds:4, baths:4, sqft:4900, tag:null, style:"gable", agent:"R. Calder", agentTitle:"Listing Partner", desc:"Set behind a hedgerow gate, this terrace home is organized around a sunken courtyard that pulls light into every principal room."},
  {id:6, addr:"402 Harrow Fields", loc:"Harrow Fields, town center", price:1890000, beds:2, baths:2, sqft:1950, tag:"Reduced", style:"townhouse", agent:"S. Bianchi", agentTitle:"Associate Advisor", desc:"A quiet corner residence with a private roof terrace overlooking the fields. Fully rewired and replumbed in the past year, original façade retained."},
  {id:7, addr:"77 Kestrel Point", loc:"Kestrel Point, waterside", price:9200000, beds:6, baths:7, sqft:9100, tag:"Waterfront", style:"modern", agent:"M. Osei", agentTitle:"Senior Advisor", desc:"The most significant offering on the register this season — a promontory estate with a private swim cove, guest pavilion, and an entry hall carved from a single quarry order of travertine."},
  {id:8, addr:"126 Wren Abbey Rd", loc:"Wren Abbey, orchard district", price:3650000, beds:5, baths:4, sqft:5300, tag:null, style:"farmhouse", agent:"R. Calder", agentTitle:"Listing Partner", desc:"Five bedrooms arranged around a converted tithe barn great room. Underfloor heating throughout, and a walled kitchen garden supplying the main table."},
  {id:9, addr:"15 Cormorant Cove", loc:"Cormorant Cove, waterside", price:2980000, beds:3, baths:3, sqft:2850, tag:"New", style:"modern", agent:"S. Bianchi", agentTitle:"Associate Advisor", desc:"A compact, precise modern home wrapped in cedar rainscreen, built into a bluff above the cove with unbroken water views from every principal room."}
];

const fmtPrice = n => "$" + (n/1000000).toFixed(2).replace(/0$/,"").replace(/\.$/,"") + "M";
const fmtPriceFull = n => "$" + n.toLocaleString("en-US");

/* ---------------- Elevation illustration generator ----------------
   Draws a simple line-art architectural elevation, varied by style/seed,
   in place of photography — keeps the "dossier" aesthetic self-contained. */
function elevationSVG(style, seed, big){
  const w = big ? 920 : 400, h = big ? 460 : 300;
  const ink = "#223327", faint = "#B9BBA8", paper = "#F5F3EC";
  let rnd = seed;
  const rand = () => { rnd = (rnd*9301+49297)%233280; return rnd/233280; };

  const groundY = h*0.78;
  let roof = "";
  let body = `<rect x="${w*0.18}" y="${groundY-h*0.32}" width="${w*0.64}" height="${h*0.32}" fill="none" stroke="${ink}" stroke-width="2"/>`;

  if(style==="gable"){
    roof = `<polyline points="${w*0.14},${groundY-h*0.32} ${w*0.5},${groundY-h*0.5} ${w*0.86},${groundY-h*0.32}" fill="none" stroke="${ink}" stroke-width="2.4"/>`;
  } else if(style==="modern"){
    roof = `<line x1="${w*0.14}" y1="${groundY-h*0.32}" x2="${w*0.86}" y2="${groundY-h*0.34}" stroke="${ink}" stroke-width="2.4"/>`;
    body = `<rect x="${w*0.14}" y="${groundY-h*0.32}" width="${w*0.72}" height="${h*0.32}" fill="none" stroke="${ink}" stroke-width="2"/>
      <rect x="${w*0.5}" y="${groundY-h*0.5}" width="${w*0.3}" height="${h*0.18}" fill="none" stroke="${ink}" stroke-width="1.6"/>`;
  } else if(style==="townhouse"){
    roof = `<line x1="${w*0.22}" y1="${groundY-h*0.44}" x2="${w*0.78}" y2="${groundY-h*0.44}" stroke="${ink}" stroke-width="2.4"/>`;
    body = `<rect x="${w*0.22}" y="${groundY-h*0.44}" width="${w*0.56}" height="${h*0.44}" fill="none" stroke="${ink}" stroke-width="2"/>`;
  } else { // farmhouse
    roof = `<polyline points="${w*0.16},${groundY-h*0.3} ${w*0.5},${groundY-h*0.52} ${w*0.84},${groundY-h*0.3}" fill="none" stroke="${ink}" stroke-width="2.4"/>
      <line x1="${w*0.6}" y1="${groundY-h*0.44}" x2="${w*0.6}" y2="${groundY-h*0.62}" stroke="${ink}" stroke-width="2"/>
      <polyline points="${w*0.54},${groundY-h*0.62} ${w*0.6},${groundY-h*0.72} ${w*0.66},${groundY-h*0.62}" fill="none" stroke="${ink}" stroke-width="2"/>`;
  }

  // windows
  let windows = "";
  const cols = style==="modern" ? 5 : 4;
  const rows = style==="townhouse" ? 3 : 2;
  const bx = w*0.18, by = groundY-h*0.30, bw = w*0.64, bh = h*0.28;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if(rand()>0.18){
        const wx = bx + (bw/cols)*c + bw/cols*0.22;
        const wy = by + (bh/rows)*r + bh/rows*0.18;
        const ww = bw/cols*0.56, wh = bh/rows*0.62;
        windows += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="none" stroke="${ink}" stroke-width="1.1"/>`;
      }
    }
  }

  // ground line + trees
  let trees = "";
  const treeCount = big ? 4 : 2;
  for(let i=0;i<treeCount;i++){
    const tx = (i%2===0) ? w*(0.03+rand()*0.06) : w*(0.9+rand()*0.06);
    const ty = groundY;
    trees += `<circle cx="${tx}" cy="${ty-h*0.09}" r="${h*0.055}" fill="none" stroke="${faint}" stroke-width="1.4"/><line x1="${tx}" y1="${ty}" x2="${tx}" y2="${ty-h*0.04}" stroke="${faint}" stroke-width="1.4"/>`;
  }

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <rect width="${w}" height="${h}" fill="${paper}"/>
    <line x1="0" y1="${groundY}" x2="${w}" y2="${groundY}" stroke="${faint}" stroke-width="1.4"/>
    ${trees}
    ${roof}
    ${body}
    ${windows}
    <line x1="${w*0.4}" y1="${groundY}" x2="${w*0.44}" y2="${groundY-h*0.24}" stroke="${ink}" stroke-width="1.6"/>
    <line x1="${w*0.44}" y1="${groundY-h*0.24}" x2="${w*0.5}" y2="${groundY-h*0.24}" stroke="${ink}" stroke-width="1.6"/>
  </svg>`;
}

/* ---------------- Render grid ---------------- */
const grid = document.getElementById("grid");
const resultCount = document.getElementById("resultCount");

function render(){
  const q = document.getElementById("fSearch").value.trim().toLowerCase();
  const minBeds = parseInt(document.getElementById("fBeds").value,10);
  const maxPrice = parseInt(document.getElementById("fPrice").value,10);
  const sort = document.getElementById("fSort").value;

  let items = listings.filter(l=>{
    const matchesQ = !q || l.addr.toLowerCase().includes(q) || l.loc.toLowerCase().includes(q);
    const matchesBeds = l.beds >= minBeds;
    const matchesPrice = !maxPrice || l.price <= maxPrice;
    return matchesQ && matchesBeds && matchesPrice;
  });

  if(sort==="price-asc") items.sort((a,b)=>a.price-b.price);
  else if(sort==="price-desc") items.sort((a,b)=>b.price-a.price);
  else if(sort==="sqft-desc") items.sort((a,b)=>b.sqft-a.sqft);

  resultCount.textContent = items.length + (items.length===1 ? " result" : " results");

  if(items.length===0){
    grid.innerHTML = `<div class="empty">No addresses match that search. Try widening the price or bedroom filter.</div>`;
    return;
  }

  grid.innerHTML = items.map(l => `
    <article class="card" tabindex="0" role="button" aria-label="View ${l.addr}" data-id="${l.id}">
      <div class="card-media">
        ${l.tag ? `<div class="card-tag">${l.tag}</div>` : ""}
        <div class="card-idx">No. ${String(l.id).padStart(2,"0")}</div>
        ${elevationSVG(l.style, l.id*7, false)}
      </div>
      <div class="card-body">
        <div class="card-price">${fmtPrice(l.price)}</div>
        <div class="card-addr">${l.addr}</div>
        <div class="card-loc">${l.loc}</div>
        <div class="card-stats">
          <span><b>${l.beds}</b> bed</span>
          <span><b>${l.baths}</b> bath</span>
          <span><b>${l.sqft.toLocaleString()}</b> sqft</span>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".card").forEach(card=>{
    card.addEventListener("click", ()=>openDetail(parseInt(card.dataset.id,10)));
    card.addEventListener("keypress", e=>{ if(e.key==="Enter") openDetail(parseInt(card.dataset.id,10)); });
  });
}

["fSearch","fBeds","fPrice","fSort"].forEach(id=>{
  document.getElementById(id).addEventListener("input", render);
  document.getElementById(id).addEventListener("change", render);
});

/* ---------------- Detail sheet ---------------- */
const overlay = document.getElementById("overlay");
const sheet = document.getElementById("sheet");

function openDetail(id){
  const l = listings.find(x=>x.id===id);
  if(!l) return;
  const initials = l.agent.split(" ").map(p=>p[0]).join("");

  sheet.innerHTML = `
    <button class="sheet-close" id="closeSheet" aria-label="Close">✕</button>
    <div class="sheet-media">${elevationSVG(l.style, l.id*7, true)}</div>
    <div class="sheet-body">
      <div class="sheet-eyebrow">Listing No. ${String(l.id).padStart(2,"0")} ${l.tag ? " — " + l.tag : ""}</div>
      <h3>${l.addr}</h3>
      <div class="sheet-loc">${l.loc}</div>
      <div class="sheet-price">${fmtPriceFull(l.price)}</div>
      <div class="spec-row">
        <div class="spec"><b>${l.beds}</b><span>Bedrooms</span></div>
        <div class="spec"><b>${l.baths}</b><span>Bathrooms</span></div>
        <div class="spec"><b>${l.sqft.toLocaleString()}</b><span>Sq. Ft.</span></div>
        <div class="spec"><b>${Math.round(l.price/l.sqft)}</b><span>$ / Sq. Ft.</span></div>
      </div>
      <p class="desc">${l.desc}</p>
      <div class="agent-row">
        <div class="agent-avatar">${initials}</div>
        <div>
          <div class="agent-name">${l.agent}</div>
          <div class="agent-title">${l.agentTitle}, Vellum Residences</div>
        </div>
      </div>
      <form class="inquire" id="inquireForm">
        <h4>Request a private viewing</h4>
        <div class="form-grid">
          <div><label for="iName">Full name</label><input id="iName" required></div>
          <div><label for="iPhone">Phone</label><input id="iPhone" type="tel" required></div>
          <div class="full"><label for="iEmail">Email</label><input id="iEmail" type="email" required></div>
          <div class="full"><label for="iMsg">Message</label><textarea id="iMsg" placeholder="Preferred viewing times, financing status, questions about the property...">I'd like to arrange a viewing of ${l.addr}.</textarea></div>
        </div>
        <button class="submit-btn" type="submit">Submit inquiry</button>
        <div class="form-note" id="formNote">Thank you — this is a prototype form, so nothing was sent. In a live build, this would notify ${l.agent}.</div>
      </form>
    </div>
  `;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("closeSheet").addEventListener("click", closeDetail);
  document.getElementById("inquireForm").addEventListener("submit", e=>{
    e.preventDefault();
    document.getElementById("formNote").classList.add("show");
  });
}

function closeDetail(){
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
overlay.addEventListener("click", e=>{ if(e.target===overlay) closeDetail(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeDetail(); });

document.getElementById("statCount").textContent = listings.length;
render();
