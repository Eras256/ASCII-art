const LABELS = { all: "All", payments: "Payments", finance: "Finance", tech: "Tech", halloween: "Halloween" };
const LINE_HEIGHT = 1.2; // keep in sync with `pre` in style.css
const CARD_MAX_FONT = 14;
const MODAL_MAX_FONT = 18;

const state = { repo: "", categories: [], pieces: [], byId: new Map(), category: "all", query: "" };
const $ = (id) => document.getElementById(id);
let charRatio = 0.6; // width of one monospace character relative to font size

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith("data-")) el.setAttribute(k, v);
    else el[k] = v;
  }
  el.append(...children);
  return el;
}

function measureCharRatio() {
  const probe = h("span", { className: "probe", textContent: "M".repeat(100) });
  document.body.append(probe);
  charRatio = probe.getBoundingClientRect().width / 100 / 100 || 0.6;
  probe.remove();
}

function artPre(piece) {
  const lines = piece.art.split("\n");
  const pre = h("pre", { textContent: piece.art });
  pre.setAttribute("role", "img");
  pre.setAttribute("aria-label", `ASCII art: ${piece.title}`);
  pre.dataset.cols = Math.max(...lines.map((l) => l.length), 1);
  pre.dataset.rows = lines.length;
  return pre;
}

// Pick the largest font size that fits the whole piece inside its box.
function fitArt(pre, maxFont, maxHeight) {
  const box = pre.parentElement;
  const style = getComputedStyle(box);
  const w = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const h = (maxHeight ?? box.clientHeight) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  const size = Math.min(maxFont, w / (pre.dataset.cols * charRatio), h / (pre.dataset.rows * LINE_HEIGHT));
  pre.style.fontSize = `${Math.max(size, 3)}px`;
}

const resizer = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    const pre = target.querySelector("pre");
    if (target.classList.contains("modal-art")) fitArt(pre, MODAL_MAX_FONT, window.innerHeight * 0.6);
    else fitArt(pre, CARD_MAX_FONT);
  }
});

function card(piece) {
  const box = h("div", { className: "art-box" }, artPre(piece));
  resizer.observe(box);
  return h("li", {},
    h("a", { className: "card", href: `#art/${piece.id}`, "data-category": piece.category },
      box,
      h("div", { className: "card-meta" },
        h("div", {},
          h("h3", { className: "card-title", textContent: piece.title }),
          h("p", { className: "card-artist", textContent: piece.artist ? `@${piece.artist}` : "anonymous" }),
        ),
        h("span", { className: "tag", textContent: piece.category, "data-category": piece.category }),
      ),
    ),
  );
}

function visiblePieces() {
  const q = state.query.trim().toLowerCase();
  return state.pieces.filter((p) =>
    (state.category === "all" || p.category === state.category) &&
    (!q || `${p.title} ${p.artist} ${p.description} ${p.category}`.toLowerCase().includes(q)),
  );
}

function renderChips() {
  const counts = { all: state.pieces.length };
  for (const p of state.pieces) counts[p.category] = (counts[p.category] || 0) + 1;
  $("chips").replaceChildren(...["all", ...state.categories].map((cat) => {
    const chip = h("button", { className: "chip", type: "button" },
      LABELS[cat] || cat,
      h("span", { className: "count", textContent: counts[cat] || 0 }),
    );
    chip.dataset.cat = cat;
    chip.addEventListener("click", () => setCategory(cat));
    return chip;
  }));
}

function render() {
  const list = visiblePieces();
  resizer.disconnect();
  $("grid").replaceChildren(...list.map(card));

  const empty = $("empty");
  empty.hidden = list.length > 0;
  empty.textContent = state.query
    ? `No art matches "${state.query}".\nMaybe you should draw it?`
    : "Nothing here yet.\nBe the first to submit a piece!";

  for (const chip of $("chips").children) {
    chip.setAttribute("aria-pressed", chip.dataset.cat === state.category);
  }
  document.body.dataset.mood = state.category === "halloween" ? "spooky" : "";
}

function setCategory(cat) {
  state.category = cat;
  history.replaceState(null, "", cat === "all" ? location.pathname + location.search : `#${cat}`);
  render();
}

function openPiece(piece) {
  const modal = $("modal");
  $("modal-tag").textContent = piece.category;
  $("modal-tag").dataset.category = piece.category;
  $("modal-title").textContent = piece.title;
  $("modal-artist").textContent = piece.artist ? `@${piece.artist}` : "anonymous";
  $("modal-artist").href = piece.artist ? `https://github.com/${piece.artist}` : "#";
  $("modal-desc").textContent = piece.description;
  $("modal-source").href = `https://github.com/${state.repo}/blob/main/${piece.path}`;
  $("copy").textContent = "Copy art";
  $("copy").onclick = () => copyArt(piece);

  const pre = artPre(piece);
  pre.id = "modal-pre";
  $("modal-pre").replaceWith(pre);

  if (!modal.open) modal.showModal();
  fitArt(pre, MODAL_MAX_FONT, window.innerHeight * 0.6);
  resizer.observe(pre.parentElement);
}

async function copyArt(piece) {
  const btn = $("copy");
  try {
    await navigator.clipboard.writeText(piece.art);
    btn.textContent = "Copied!";
  } catch {
    btn.textContent = "Copy failed";
  }
  setTimeout(() => (btn.textContent = "Copy art"), 1600);
}

function onHash() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith("art/")) {
    const piece = state.byId.get(hash.slice(4));
    if (piece) return openPiece(piece);
  }
  if ($("modal").open) $("modal").close();
  if (LABELS[hash]) state.category = hash;
  render();
}

function wireUp() {
  const modal = $("modal");
  $("modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
  modal.addEventListener("close", () => {
    const back = state.category === "all" ? location.pathname + location.search : `#${state.category}`;
    history.replaceState(null, "", back);
  });

  $("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  $("surprise").addEventListener("click", () => {
    const pool = visiblePieces().length ? visiblePieces() : state.pieces;
    if (!pool.length) return;
    location.hash = `art/${pool[Math.floor(Math.random() * pool.length)].id}`;
  });

  window.addEventListener("hashchange", onHash);
}

async function main() {
  wireUp();
  try {
    const res = await fetch("art.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    state.repo = data.repo;
    state.categories = data.categories;
    state.pieces = data.pieces;
    state.byId = new Map(data.pieces.map((p) => [p.id, p]));
  } catch (err) {
    $("empty").hidden = false;
    $("empty").textContent = "Couldn't load the gallery.\nRun `python3 scripts/build_site.py` and serve the site/ folder.";
    return;
  }

  const repoUrl = `https://github.com/${state.repo}`;
  $("repo-link").href = repoUrl;
  $("submit-link").href = `${repoUrl}#how-to-submit-your-art`;
  const artists = new Set(state.pieces.map((p) => p.artist)).size;
  $("stats").textContent = `${state.pieces.length} pieces by ${artists} artist${artists === 1 ? "" : "s"} so far.`;

  await document.fonts.ready;
  measureCharRatio();
  renderChips();
  onHash();
}

main();
