"use strict";

// Benchmark evaluation results; backbone sizes are reported separately from full policy sizes.
// Backbone sizes in LIBERO are not total model parameter counts.
const benchmarks = {
  libero: {
    title: "Four Task Suites",
    description: "Four task suites, with 10 tasks per suite and 50 evaluation rollouts per task.",
    highlight: "98.5%", detail: "average success · 0.5B backbone",
    caption: "LIBERO · Success rate (%) · Selected baselines",
    headers: ["Model", "Backbone", "Robot pretrain", "Spatial", "Object", "Goal", "Long", "Average"],
    rows: [
      ["OpenVLA", "7B", "Yes", "84.7", "88.4", "79.2", "53.7", "76.5"],
      ["MemoryVLA", "7B", "Yes", "98.4", "98.4", "96.4", "93.4", "96.7"],
      ["AVA-VLA", "7B", "Yes", "99.2", "99.6", "97.9", "96.2", "98.2"],
      ["ALAM", "3B", "Yes", "99.2", "99.6", "99.0", "94.4", "98.1"],
      ["Evo-1", "0.8B", "No", "92.7", "97.7", "96.3", "92.3", "94.8"],
      ["Evo-Depth", "0.9B", "No", "95.6", "99.2", "95.6", "91.3", "95.4"],
      ["VLA-Adapter", "0.5B", "No", "97.8", "99.2", "97.2", "95.0", "97.3"],
      ["P2A-VLA", "0.5B", "No", "99.2", "99.6", "98.4", "96.8", "98.5"]
    ],
    chartTitle: "Average success (%) · Selected compact backbones", max: 100,
    bars: [["Evo-1",94.8],["Evo-Depth",95.4],["VLA-Adapter",97.3],["P2A-VLA",98.5]]
  },
  calvin: {
    title: "ABC → D Generalization",
    description: "ABC → D evaluation on 1,000 sequences, each containing five consecutive subtasks.",
    highlight: "4.47 / 5", detail: "average completed sequence length",
    caption: "CALVIN ABC → D · Success at ≥ N instructions (%)",
    headers: ["Model", "≥ 1", "≥ 2", "≥ 3", "≥ 4", "≥ 5", "Avg. length"],
    rows: [
      ["OpenVLA", "91.3", "77.8", "62.0", "52.1", "43.5", "3.27"],
      ["UniVLA", "95.5", "85.8", "75.4", "66.9", "56.5", "3.80"],
      ["OpenVLA-OFT", "96.3", "89.1", "82.4", "75.8", "66.5", "4.10"],
      ["VPP", "95.7", "91.2", "86.3", "81.0", "75.0", "4.29"],
      ["BehaviorVLA", "96.0", "92.0", "87.3", "82.9", "77.3", "4.36"],
      ["FALCON", "98.4", "94.5", "88.6", "82.5", "75.5", "4.40"],
      ["VLA-Adapter", "99.1", "94.6", "88.8", "82.8", "76.5", "4.42"],
      ["P2A-VLA", "99.2", "96.6", "90.4", "84.2", "76.6", "4.47"]
    ],
    chartTitle: "Average completed sequence length · Out of 5", max: 5,
    bars: [["OpenVLA-OFT",4.10],["FALCON",4.40],["VLA-Adapter",4.42],["P2A-VLA",4.47]]
  },
  metaworld: {
    title: "MetaWorld MT50",
    description: "50 manipulation tasks across four difficulty levels, with 10 evaluation rollouts per task.",
    highlight: "89.8%", detail: "average success over 50 tasks",
    caption: "MetaWorld MT50 · Success rate (%) · Selected baselines",
    headers: ["Model", "Easy", "Medium", "Hard", "Very hard", "Average"],
    rows: [
      ["SmolVLA", "87.1", "51.8", "70.0", "64.0", "68.2"],
      ["RoboTron-Mani", "85.5", "67.7", "76.7", "81.0", "77.7"],
      ["Evo-1", "89.2", "76.8", "77.2", "79.2", "80.6"],
      ["Evo-Depth", "83.1", "84.7", "87.3", "82.4", "84.4"],
      ["ALAM", "89.3", "83.6", "85.0", "82.0", "85.0"],
      ["LA4VLA", "88.9", "94.5", "66.7", "100.0", "87.5"],
      ["P2A-VLA", "88.9", "96.4", "82.0", "92.0", "89.8"]
    ],
    chartTitle: "Average success (%) · Across all 50 tasks", max: 100,
    bars: [["Evo-Depth",84.4],["ALAM",85.0],["LA4VLA",87.5],["P2A-VLA",89.8]]
  },
  real: {
    title: "ID and OOD Evaluation",
    description: "Three tasks with 100 demonstrations per task and 20 evaluation rollouts per task under each ID and OOD condition.",
    highlight: "+10.0 pp", detail: "average OOD improvement over VLA-Adapter",
    caption: "Real-world evaluation · Average success (%)",
    headers: ["Model", "In-distribution", "Out-of-distribution"],
    rows: [["VLA-Adapter", "80.0", "61.7"], ["P2A-VLA", "88.3", "71.7"]],
    chartTitle: "Average success (%) · ID and OOD", max: 100,
    bars: [["Adapter · ID",80.0],["P2A-VLA · ID",88.3],["Adapter · OOD",61.7],["P2A-VLA · OOD",71.7]]
  }
};

const panels = document.querySelector("#results-panels");
for (const [key, data] of Object.entries(benchmarks)) {
  const panel = document.createElement("div");
  panel.id = `panel-${key}`;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `tab-${key}`);
  panel.tabIndex = 0;
  panel.hidden = key !== "libero";
  const bars = data.bars.map(([name, value]) => `<div class="bar-row ${name.startsWith("P2A") ? "ours" : ""}"><span>${name}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${value / data.max * 100}%"></div></div><span class="bar-number">${value.toFixed(data.max === 5 ? 2 : 1)}</span></div>`).join("");
  panel.innerHTML = `<div class="result-overview"><div class="result-copy"><h3>${data.title}</h3><p>${data.description}</p><div class="result-highlight"><strong>${data.highlight}</strong><span>${data.detail}</span></div></div><div class="result-chart"><p class="chart-title">${data.chartTitle}</p>${bars}<div class="chart-axis" aria-hidden="true"><span>0</span><span>${data.max / 2}</span><span>${data.max}</span></div></div></div><div class="table-scroll" tabindex="0" role="region" aria-label="${key} results table, scroll horizontally if needed"><table><caption>${data.caption}</caption><thead><tr>${data.headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${data.rows.map(row => `<tr class="${row[0] === "P2A-VLA" ? "ours" : ""}"><th scope="row">${row[0]}</th>${row.slice(1).map(value => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  panels.append(panel);
}

const tabs = [...document.querySelectorAll("[data-result]")];
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", event => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});

const demos = [
  { id:"libero-spatial", shortTitle:"Bowl from Drawer to Plate", group:"libero", label:"LIBERO / SPATIAL", title:"Pick up the bowl from the drawer and place it on the plate.", note:"Spatial reasoning · Selected evaluation rollout" },
  { id:"libero-object", shortTitle:"Milk into Basket", group:"libero", label:"LIBERO / OBJECT", title:"Pick up the milk and place it in the basket.", note:"Object interaction · Selected evaluation rollout" },
  { id:"libero-goal", shortTitle:"Wine Bottle onto Cabinet", group:"libero", label:"LIBERO / GOAL", title:"Put the wine bottle on top of the cabinet.", note:"Goal following · Selected evaluation rollout" },
  { id:"libero-long", shortTitle:"Both Moka Pots onto Stove", group:"libero", label:"LIBERO / LONG", title:"Put both moka pots on the stove.", note:"Long-horizon manipulation · Selected evaluation rollout" },
  { id:"calvin-1", shortTitle:"Lift Pink Block", group:"calvin", label:"CALVIN / LIFT", title:"Lift the pink block from the sliding compartment.", note:"Subtask 1 of 5 · Sequence 0002" },
  { id:"calvin-2", shortTitle:"Place in Slider", group:"calvin", label:"CALVIN / PLACE", title:"Place the block in the sliding compartment.", note:"Subtask 2 of 5 · Sequence 0002" },
  { id:"calvin-3", shortTitle:"Open Drawer", group:"calvin", label:"CALVIN / OPEN", title:"Open the drawer.", note:"Subtask 3 of 5 · Sequence 0002" },
  { id:"calvin-4", shortTitle:"Rotate Red Block", group:"calvin", label:"CALVIN / ROTATE", title:"Rotate the red block to the right.", note:"Subtask 4 of 5 · Sequence 0002" },
  { id:"calvin-5", shortTitle:"Lift Red Block", group:"calvin", label:"CALVIN / LIFT", title:"Lift the red block from the table.", note:"Subtask 5 of 5 · Sequence 0002" },
  { id:"metaworld-door", shortTitle:"Open Door", group:"metaworld", label:"METAWORLD / EASY", title:"Open a door with a revolving joint.", note:"Door opening · Selected evaluation rollout" },
  { id:"metaworld-basketball", shortTitle:"Basketball", group:"metaworld", label:"METAWORLD / MEDIUM", title:"Dunk the basketball into the basket.", note:"Basketball · Selected evaluation rollout" },
  { id:"metaworld-assembly", shortTitle:"Nut Assembly", group:"metaworld", label:"METAWORLD / HARD", title:"Pick up a nut and place it onto a peg.", note:"Assembly · Selected evaluation rollout" },
  { id:"metaworld-stick", shortTitle:"Pull with Stick", group:"metaworld", label:"METAWORLD / VERY HARD", title:"Grasp a stick and pull a box with it.", note:"Tool use · Selected evaluation rollout" }
];
const gallery = document.querySelector("#simulation-gallery");
for (const demo of demos) {
  const article = document.createElement("article");
  article.className = "demo-card";
  article.dataset.benchmark = demo.group;
  article.setAttribute("role", "group");

  const collection = demos.filter(item => item.group === demo.group);
  article.setAttribute("aria-label", `${collection.indexOf(demo) + 1} of ${collection.length}: ${demo.title}`);
  const taskLabel = demo.group === "calvin" ? `STEP ${collection.indexOf(demo) + 1}` : demo.label.split(" / ")[1];
  article.innerHTML = `<div class="video-frame"><video controls muted loop playsinline preload="none" poster="assets/images/${demo.id}.jpg" aria-label="${demo.title}"><source data-src="assets/videos/${demo.id}.mp4" type="video/mp4"></video><button class="video-expand" type="button" data-video="${demo.id}" aria-haspopup="dialog" aria-label="Enlarge video: ${demo.title}"><svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4"/></svg></button></div><div class="demo-info"><span class="demo-category">${taskLabel}</span><h4>${demo.shortTitle}</h4></div>`;
  gallery.querySelector(`#row-${demo.group}`).append(article);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const allVideos = [...document.querySelectorAll("video")];
function loadVideo(video) {
  const source = video.querySelector("source");
  if (source?.dataset.src && !source.hasAttribute("src")) {
    source.src = source.dataset.src;
    video.load();
  }
}
if ("IntersectionObserver" in window) {
  const mediaObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting) loadVideo(video);
      else video.pause();
    });
  }, { threshold: 0.15 });
  allVideos.forEach(video => mediaObserver.observe(video));
} else {
  allVideos.forEach(loadVideo);
}
allVideos.forEach(video => {
  video.addEventListener("play", () => allVideos.forEach(other => {
    if (other !== video) other.pause();
  }));
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) allVideos.forEach(video => video.pause());
});

// All videos are visible on desktop; compact screens use a manually scrolled row.
document.querySelectorAll(".benchmark-gallery").forEach(section => {
  const track = section.querySelector(".demo-row");
  const cards = [...track.querySelectorAll(".demo-card")];
  const previous = section.querySelector(".carousel-prev");
  const next = section.querySelector(".carousel-next");
  const counter = section.querySelector(".carousel-counter");
  let frame;
  function update() {
    const overflowing = track.scrollWidth > track.clientWidth + 2;
    section.querySelector(".carousel-controls").hidden = !overflowing;
    track.tabIndex = overflowing ? 0 : -1;
    const bounds = track.getBoundingClientRect();
    const shown = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index }))
      .filter(({ rect }) => Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left) > rect.width * 0.5)
      .map(({ index }) => index + 1);
    if (shown.length) {
      const pad = number => String(number).padStart(2, "0");
      const range = shown.length > 1 ? `${pad(shown[0])}–${pad(shown.at(-1))}` : pad(shown[0]);
      const label = `${range} / ${pad(cards.length)}`;
      if (counter.textContent !== label) counter.textContent = label;
    }
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }
  function move(direction) {
    const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    const visibleCount = Math.max(1, Math.round(track.clientWidth / step));
    track.scrollBy({ left: direction * step * visibleCount, behavior: reduceMotion.matches ? "instant" : "smooth" });
  }
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, { passive: true });
  track.addEventListener("keydown", event => {
    // Preserve the native player's arrow-key seeking and volume controls.
    if (event.target !== track) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      track.scrollTo({ left: event.key === "Home" ? 0 : track.scrollWidth, behavior: reduceMotion.matches ? "instant" : "smooth" });
    }
  });
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(track);
  else window.addEventListener("resize", update);
  update();
});
const videoDialog = document.getElementById("video-dialog");
const expandedVideo = document.getElementById("expanded-video");
document.querySelectorAll("[data-video]").forEach(button => {
  button.addEventListener("click", () => {
    const demo = demos.find(item => item.id === button.dataset.video);
    allVideos.forEach(video => video.pause());
    document.getElementById("video-dialog-title").textContent = demo.title;
    document.getElementById("video-dialog-benchmark").textContent = demo.label;
    expandedVideo.poster = `assets/images/${demo.id}.jpg`;
    expandedVideo.src = `assets/videos/${demo.id}.mp4`;
    videoDialog.showModal();
    expandedVideo.play().catch(() => {});
  });
});
videoDialog.querySelector(".dialog-close").addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("close", () => {
  expandedVideo.pause();
  expandedVideo.removeAttribute("src");
  expandedVideo.load();
});
videoDialog.addEventListener("click", event => {
  if (event.target !== videoDialog) return;
  const rect = videoDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) videoDialog.close();
});

const dialog = document.getElementById("figure-dialog");
document.querySelectorAll("[data-zoom]").forEach(button => {
  button.addEventListener("click", () => {
    const image = document.getElementById("figure-image");
    image.src = button.dataset.zoom;
    image.alt = button.querySelector("img").alt;
    document.getElementById("figure-caption").textContent = button.closest("figure")?.querySelector("figcaption")?.textContent || button.dataset.caption;
    dialog.showModal();
  });
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
} });

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".site-header nav a").forEach(link => {
        const activeSection = entry.target.id === "real-world" ? "demos" : entry.target.id;
        if (link.hash === `#${activeSection}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -60% 0px" });
  ["overview", "method", "demos", "real-world", "results"].forEach(id => sectionObserver.observe(document.getElementById(id)));
}
