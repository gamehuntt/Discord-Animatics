// Discord Animatics v1.0.0
// Made by @gamehuntt
// https://github.com/gamehuntt/Discord-Animatics
(() => {
  if (window.__DYN__) window.__DYN__.destroy();
  const VER = "1.0.0", ID = "dyn", KEY = "DiscordAnimatics_settings", MSG = 'li[id^="chat-messages-"]', P = "#" + ID;
  const D = {
    anim: "slide", mode: "msg", duration: 450, stagger: 350, wordDelay: 120, letterDelay: 35, auto: true,
    autoScroll: false, scrollSync: true, pointY: 50, span: 10, scrollDur: 800,
    rCalls: true, rEdited: true, rReactions: true, rTags: true, rTime: true, rDate: true,
    animOpen: true, scrollOpen: false, renderOpen: false, panel: true, collapsed: false, x: null, y: null,
  };
  let S = { ...D };
  try { S = { ...D, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const flag = (el, n, on) => el.toggleAttribute("data-dyn-" + n, !!on);
  const $$ = (s) => document.querySelectorAll(s);
  const offs = [], on = (t, e, f, o) => { t.addEventListener(e, f, o); offs.push(() => t.removeEventListener(e, f, o)); };
  const R = {
    rCalls: ["Call logs", `${MSG}[data-dyn-call]`],
    rEdited: ["Edited mark", '[class*="edited_"]'],
    rReactions: ["Reactions", 'div[id^="message-reactions-"],[class*="reactions_"]'],
    rTags: ["Tags", '[class*="botTag"],[class*="clanTag"],[class*="chipletContainer"],[class*="roleDot"],[class*="roleIcon"]'],
    rTime: ["Timestamps", `${MSG} time,${MSG} [class*="timestamp_"]`],
    rDate: ["Date dividers", '[class*="scrollerInner"] [class*="divider_"],[class*="scrollerInner"] [role="separator"]'],
  };
  const ft = (...v) => v.map((x) => x && `from{opacity:0;${x}}to{opacity:1;${x.replace(/:[^;]+/g, ":none")}}`);
  const K = {
    fade: ["Fade", "from{opacity:0}to{opacity:1}"],
    slide: ["Slide Left", ...ft("transform:translateX(-40px)", "transform:translateX(-14px)")],
    slideRight: ["Slide Right", ...ft("transform:translateX(40px)", "transform:translateX(14px)")],
    slideUp: ["Slide Up", ...ft("transform:translateY(40px)", "transform:translateY(12px)")],
    slideDown: ["Slide Down", ...ft("transform:translateY(-40px)", "transform:translateY(-12px)")],
    pop: ["Pop", "0%{opacity:0;transform:scale(.6)}70%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}"],
    bounce: ["Bounce",
      "0%{opacity:0;transform:translateY(-40px)}45%{opacity:1;transform:translateY(10px)}65%{transform:translateY(-5px)}85%{transform:translateY(2px)}100%{opacity:1;transform:none}",
      "0%{opacity:0;transform:translateY(-14px)}45%{opacity:1;transform:translateY(4px)}70%{transform:translateY(-2px)}100%{opacity:1;transform:none}"],
    blur: ["Blur", ...ft("filter:blur(12px)", "filter:blur(6px)")],
    dreamy: ["Dreamy", ...ft("filter:blur(10px);transform:translateY(20px)", "filter:blur(5px);transform:translateY(8px)")],
    zoom: ["Zoom In", ...ft("transform:translateY(25px) scale(.9)", "transform:translateY(8px) scale(.8)")],
    zoomOut: ["Zoom Out", ...ft("transform:scale(1.5)", "transform:scale(1.9)")],
    flip: ["Flip X", ...ft("transform:perspective(600px) rotateX(-90deg)")],
    flipY: ["Flip Y", ...ft("transform:perspective(600px) rotateY(90deg)")],
    rotate: ["Rotate",
      "0%{opacity:0;transform:rotate(-120deg) scale(.4)}60%{opacity:1;transform:rotate(8deg) scale(1.03)}100%{opacity:1;transform:none}",
      "0%{opacity:0;transform:rotate(-360deg) scale(.2)}100%{opacity:1;transform:none}"],
    swing: ["Swing",
      "0%{opacity:0;transform:rotate(-15deg)}60%{opacity:1;transform:rotate(6deg)}100%{opacity:1;transform:none}",
      "0%{opacity:0;transform:rotate(-25deg)}60%{opacity:1;transform:rotate(8deg)}100%{opacity:1;transform:none}"],
    skew: ["Skew", ...ft("transform:translateX(-50px) skewX(30deg)", "transform:translateX(-16px) skewX(30deg)")],
    elastic: ["Elastic", "0%{opacity:0;transform:scaleX(.3)}55%{opacity:1;transform:scaleX(1.15)}75%{transform:scaleX(.95)}100%{opacity:1;transform:none}"],
    glitch: ["Glitch", [
      "0%{opacity:0;transform:translateX(-8px);text-shadow:4px 0 #ff00ff,-4px 0 #00ffff}",
      "10%{opacity:1;transform:translateX(12px) skewX(-18deg);clip-path:inset(10% 0 60% 0);text-shadow:-5px 0 #ff00ff,5px 0 #00ffff}",
      "20%{transform:translateX(-12px) skewX(18deg);clip-path:inset(55% 0 12% 0);text-shadow:5px 0 #ff00ff,-5px 0 #00ffff}",
      "30%{transform:translateX(6px);clip-path:inset(0);text-shadow:-3px 0 #ff00ff,3px 0 #00ffff;filter:hue-rotate(90deg)}",
      "40%{transform:translateX(-8px) skewX(-10deg);clip-path:inset(30% 0 35% 0);filter:none}",
      "55%{transform:translateX(5px);clip-path:inset(0);text-shadow:3px 0 #ff00ff,-3px 0 #00ffff}",
      "70%{transform:translateX(-3px);clip-path:inset(70% 0 5% 0)}",
      "85%{transform:translateX(2px);clip-path:inset(0);text-shadow:1px 0 #ff00ff,-1px 0 #00ffff}",
      "100%{opacity:1;transform:none;clip-path:inset(0);text-shadow:none;filter:none}"].join("")],
    typewriter: ["Typewriter", "from{opacity:1;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}"],
    glow: ["Glow",
      "0%{opacity:0;filter:brightness(3) drop-shadow(0 0 0 #7983f5);text-shadow:0 0 0 #fff}" +
      "35%{opacity:1;filter:brightness(1.8) drop-shadow(0 0 14px #7983f5);text-shadow:0 0 12px #fff,0 0 26px #5865f2}" +
      "100%{opacity:1;filter:none;text-shadow:none}"],
  };
  if (!K[S.anim]) S.anim = "slide";
  if (!["msg", "word", "letter"].includes(S.mode)) S.mode = "msg";
  S.pointY = clamp(+S.pointY || 60, 5, 95);
  S.span = clamp(+S.span || 10, 2, 40);
  S.scrollDur = clamp(+S.scrollDur || 0, 0, 2500);
  S.scrollSync = S.scrollSync !== false;
  S.duration = clamp(+S.duration || 450, 150, 1500);
  const MULTI = new Set(["pop", "bounce", "swing", "elastic"]), MAX_TEXT_MS = 3500;
  const easing = () => S.anim === "glitch" ? "steps(1,end)" : MULTI.has(S.anim) ? "ease-out" : "cubic-bezier(.2,.8,.2,1)";
  const unitDur = () => Math.max(150, Math.round(S.duration * 0.8));
  const scrollMs = () => (S.scrollSync ? S.duration : S.scrollDur);
  const CALL = /started a (voice |video )?call|missed a (voice |video )?call|call (that )?lasted|joined the call|ended the call|call ended|is calling you|started a stream/i;
  const isCall = (el) => {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    return !!t && t.length < 250 && (CALL.test(t) || (t.length < 120 && /\bcall\b/i.test(t) && /lasted|missed|ended|started|joined/i.test(t)));
  };
  const scanEl = (el) => el.toggleAttribute("data-dyn-call", isCall(el));
  const staticStyle = Object.assign(document.createElement("style"), { textContent: `
    ${Object.entries(K).map(([n, [, m, w]]) => `@keyframes dyn-${n}{${m}}@keyframes dynw-${n}{${w || m}}`).join("")}
    @keyframes dyn-item{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
    @keyframes dyn-pulse{0%{box-shadow:0 0 0 0 #5865f2aa}100%{box-shadow:0 0 0 14px #5865f200}}
    ${MSG}[data-dyn-hide]{opacity:0!important}
    ${MSG}.dyn-hover{background:#5865f21f!important;outline:2px dashed #5865f2;outline-offset:-2px}
    ${MSG}[data-dyn-start]{box-shadow:inset 3px 0 0 #5865f2}
    .dyn-w{display:inline-block;opacity:0;will-change:transform,opacity}
    .dyn-nw{white-space:nowrap}
    body.dyn-pick,body.dyn-pick ${MSG}{cursor:crosshair!important}
    #dyn-replay-item:hover{background:#5865f2!important;color:#fff!important}
    #dyn-guide{position:fixed;height:0;border-top:2px dashed #5865f2;box-shadow:0 0 14px #5865f2;z-index:99998;pointer-events:none;display:none}
    ${P}{position:fixed;z-index:99999;width:300px;color:#dbdee1;font:13px/1.4 "gg sans","Segoe UI",sans-serif;background:linear-gradient(160deg,#1e1f22f2,#2b2d31ee);backdrop-filter:blur(14px);border:1px solid #ffffff1a;border-radius:14px;box-shadow:0 10px 30px #000a;user-select:none;opacity:0;visibility:hidden;transform:translateY(14px) scale(.94);transition:opacity .25s,transform .35s cubic-bezier(.2,.9,.3,1.25),box-shadow .25s,visibility 0s .35s}
    ${P}.show{opacity:1;visibility:visible;transform:none;transition-delay:0s}
    ${P}.drag{transform:scale(1.03);box-shadow:0 18px 44px #000c;transition:box-shadow .2s,transform .2s}
    ${P} .head{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;cursor:grab;color:#fff;font-weight:700;font-size:14px;touch-action:none}
    ${P}.drag .head{cursor:grabbing}
    ${P} .ver{font-style:normal;font-weight:500;font-size:10px;color:#949ba4;margin-left:6px;padding:1px 6px;border-radius:8px;background:#ffffff14}
    ${P} .head button{margin-left:4px;width:24px;height:24px;background:#ffffff12;border-radius:7px;color:#dbdee1;border:0;cursor:pointer;font-size:14px;transition:background .2s,transform .2s}
    ${P} .head button:hover{background:#5865f2;color:#fff;transform:scale(1.1)}
    ${P} .head button:active{transform:scale(.9)}
    ${P} .bw,${P} .sec{display:grid;grid-template-rows:0fr}
    ${P}.ready .bw,${P}.ready .sec{transition:grid-template-rows .35s cubic-bezier(.4,0,.2,1)}
    ${P} .bw.open,${P} .sec.open{grid-template-rows:1fr}
    ${P} .body,${P} .in{overflow:hidden;min-height:0}
    ${P} .body{padding:0 12px;border-top:1px solid #ffffff14;overflow-y:auto;max-height:calc(100vh - 100px);scrollbar-width:thin}
    ${P} .body>:first-child{margin-top:10px}
    ${P} .body>:last-child{margin-bottom:12px}
    ${P} .in{padding:0 2px}
    ${P} h4{display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:6px 8px;margin:6px -8px 4px;border-radius:8px;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#949ba4;transition:background .2s,color .2s}
    ${P} h4:hover{background:#ffffff10;color:#fff}
    ${P} h4 b{position:relative;width:12px;height:12px;flex:none;transition:transform .35s cubic-bezier(.4,0,.2,1)}
    ${P} h4 b::before,${P} h4 b::after{content:"";position:absolute;background:#dbdee1;border-radius:1px;transition:transform .35s}
    ${P} h4 b::before{left:0;right:0;top:5px;height:2px}
    ${P} h4 b::after{top:0;bottom:0;left:5px;width:2px}
    ${P} h4.open b{transform:rotate(180deg)}
    ${P} h4.open b::after{transform:scaleY(0)}
    ${P} .sec.open .in>*{animation:dyn-item .35s backwards}
    ${Array.from({ length: 10 }, (_, i) => `${P} .in>*:nth-child(${i + 1}){animation-delay:${(i + 1) * 0.04}s}`).join("")}
    ${P} label{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:2px -6px;padding:5px 6px;border-radius:8px;cursor:pointer;transition:background .2s}
    ${P} label:hover{background:#ffffff0d}
    ${P} [data-m]{display:none}
    ${P}[data-mode="word"] [data-m="word"],${P}[data-mode="letter"] [data-m="letter"],${P}[data-sync="0"] [data-m="manual"]{display:flex}
    ${P} select{background:#1e1f22;color:#dbdee1;border:1px solid #ffffff1f;border-radius:6px;padding:3px 4px;transition:border-color .2s}
    ${P} select:hover,${P} select:focus{border-color:#5865f2;outline:0}
    ${P} .rg{display:flex;align-items:center;gap:6px}
    ${P} .rg em{font-style:normal;font-size:11px;color:#949ba4;width:44px;text-align:right}
    ${P} input[type=range]{width:90px;accent-color:#5865f2;cursor:pointer}
    ${P} input[type=checkbox]{appearance:none;-webkit-appearance:none;flex:none;margin:0;width:34px;height:18px;border-radius:9px;background:#4e5058;position:relative;cursor:pointer;transition:background .25s}
    ${P} input[type=checkbox]::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .3s cubic-bezier(.3,1.5,.5,1)}
    ${P} input[type=checkbox]:checked{background:#5865f2}
    ${P} input[type=checkbox]:checked::after{transform:translateX(16px)}
    ${P} .go{position:relative;overflow:hidden;width:100%;margin-top:10px;padding:8px;border:0;border-radius:8px;background:linear-gradient(135deg,#5865f2,#7983f5);color:#fff;cursor:pointer;font-weight:600;transition:transform .15s,filter .2s}
    ${P} .go:hover{filter:brightness(1.12);transform:translateY(-1px)}
    ${P} .go:active{transform:scale(.97)}
    ${P} .go.pulse{animation:dyn-pulse .6s}
    ${P} .gr{display:flex;gap:6px;margin-top:10px}
    ${P} .gr .go{margin-top:0;flex:1}
    ${P} .go.stop{background:linear-gradient(135deg,#da373c,#f0585d)}
    ${P} .pt{font-size:11px;color:#949ba4;margin:6px 0 2px;word-break:break-word}
    ${P} .row{display:flex;gap:6px;margin-top:6px}
    ${P} .mini{flex:1;padding:6px 4px;border:0;border-radius:8px;background:#ffffff14;color:#dbdee1;cursor:pointer;font-size:12px;transition:background .2s,transform .15s}
    ${P} .mini:hover{background:#5865f2;color:#fff}
    ${P} .mini:active{transform:scale(.95)}
    ${P} .mini.on{background:#5865f2;color:#fff}
    ${P} small{color:#949ba4;display:block;margin-top:8px;text-align:center}
    ${P} small.wm{margin-top:2px;font-size:10px;opacity:.75}` });
  const dynStyle = document.createElement("style");
  document.head.append(staticStyle, dynStyle);
  const setVars = () => Object.entries({ "--dyn-dur": S.duration + "ms", "--dyn-wdur": unitDur() + "ms", "--dyn-ease": easing() })
    .forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  const applyDyn = () => {
    dynStyle.textContent = `
      ${MSG}[data-dyn-in]{transform-origin:${S.anim === "rotate" ? "left center" : "center"};animation:dyn-${S.anim} var(--dyn-dur) var(--dyn-ease) backwards}
      ${MSG}[data-dyn-in][data-dyn-wm]{animation:dyn-fade 250ms ease backwards}
      .dyn-w.on{opacity:1;animation:dynw-${S.anim} var(--dyn-wdur) var(--dyn-ease) both}
      ${Object.entries(R).filter(([k]) => !S[k]).map(([, v]) => v[1] + "{display:none!important}").join("")}`;
    $$(MSG).forEach(scanEl);
  };
  const byDom = (a, b) => (a === b ? 0 : a.compareDocumentPosition(b) & 4 ? -1 : 1);
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
  const shownIds = new Set(), animAt = new Map();
  const inflight = new Map(), running = new Set(), active = new Set(), pending = [];
  const rememberId = (el) => {
    if (!el.id) return;
    shownIds.add(el.id);
    if (shownIds.size > 1000) shownIds.delete(shownIds.values().next().value);
  };
  const reveal = (el) => {
    if (!el.isConnected) return;
    el.dataset.dyn = "2"; flag(el, "hide", false);
    inflight.delete(el); running.delete(el); rememberId(el);
  };
  const root = (el) =>
    el.querySelector(`#message-content-${el.id.split("-").pop()}`) ||
    [...el.querySelectorAll('[id^="message-content-"]')].filter((n) => !n.closest('[class*="repliedMessage"],[class*="replyContext"]')).pop() || el;
  const runText = (el) => {
    const letter = S.mode === "letter", units = [], undo = [], texts = [];
    const mk = (cls, txt = "") => Object.assign(document.createElement("span"), { className: cls, textContent: txt });
    const tw = document.createTreeWalker(root(el), NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) if (tw.currentNode.nodeValue.trim()) texts.push(tw.currentNode);
    texts.forEach((n) => {
      const made = n.nodeValue.split(/(\s+)/).filter(Boolean).map((p) => {
        if (!p.trim()) return document.createTextNode(p);
        if (!letter) { const s = mk("dyn-w", p); units.push(s); return s; }
        const w = mk("dyn-nw");
        for (const ch of p) { const s = mk("dyn-w", ch); w.append(s); units.push(s); }
        return w;
      });
      n.replaceWith(...made);
      undo.push([n, made]);
    });
    const delay = Math.min(letter ? S.letterDelay : S.wordDelay, MAX_TEXT_MS / Math.max(1, units.length));
    const total = Math.max(0, units.length - 1) * delay + unitDur();
    const restore = () => {
      undo.forEach(([n, made]) => { if (made[0].parentNode) { made[0].before(n); made.forEach((m) => m.remove()); } });
      active.delete(restore);
    };
    active.add(restore);
    units.forEach((s, i) => { s.style.animationDelay = i * delay + "ms"; s.classList.add("on"); });
    setTimeout(restore, total + 300);
    return units.length ? total : 0;
  };
  const show = (el) => {
    if (!el.isConnected || (el.dataset.dyn === "2" && !el.hasAttribute("data-dyn-hide"))) return 0;
    el.dataset.dyn = "2"; rememberId(el); inflight.delete(el); running.delete(el);
    ["hide", "in", "wm"].forEach((n) => flag(el, n, false));
    el.style.removeProperty("animation-delay");
    void el.offsetWidth;
    flag(el, "wm", S.mode !== "msg"); flag(el, "in", true);
    if (el.id) { animAt.set(el.id, Date.now()); if (animAt.size > 300) animAt.delete(animAt.keys().next().value); }
    return S.mode === "msg" ? 0 : runText(el);
  };
  const safeShow = (el) => { try { show(el); } catch { flag(el, "hide", false); rememberId(el); } };
  let scrollRaf = 0, scrollEnd = null, padEl = null, padSc = null, padPx = 0;
  const scrollerOf = (el) => {
    for (let p = el && el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY;
      if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
    }
    return null;
  };
  const goal = (sc, el) => el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - (S.pointY / 100) * sc.clientHeight;
  const setPad = () => { padPx = Math.round((1 - S.pointY / 100) * padSc.clientHeight); padEl.style.setProperty("padding-bottom", padPx + "px", "important"); };
  const ensurePad = (sc, el) => {
    const inner = el.closest('[class*="scrollerInner"]');
    if (!inner) return;
    if (padEl && padEl !== inner) padEl.style.removeProperty("padding-bottom");
    padEl = inner; padSc = sc; setPad();
  };
  const refreshPad = () => { if (padEl && padSc && S.autoScroll) setPad(); };
  const clearPad = () => { padEl?.style.removeProperty("padding-bottom"); padEl = padSc = null; padPx = 0; };
  const cancelScroll = () => {
    cancelAnimationFrame(scrollRaf);
    if (scrollEnd) { const f = scrollEnd; scrollEnd = null; f(); }
  };
  const tweenTo = (sc, el, ms) => new Promise((done) => {
    cancelScroll();
    const aim = () => clamp(goal(sc, el), 0, sc.scrollHeight - sc.clientHeight), from = sc.scrollTop;
    if (Math.abs(aim() - from) < 2) return done();
    if (ms < 1) { sc.scrollTop = aim(); return done(); }
    scrollEnd = done;
    const t0 = performance.now();
    const step = (t) => {
      if (!el.isConnected) { scrollEnd = null; return done(); }
      const p = Math.min(1, (t - t0) / ms);
      sc.scrollTop = from + (aim() - from) * (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
      if (p < 1) scrollRaf = requestAnimationFrame(step);
      else { scrollEnd = null; done(); }
    };
    scrollRaf = requestAnimationFrame(step);
  });
  const prep = (el, live) => {
    const sc = S.autoScroll && scrollerOf(el);
    if (!sc) return null;
    ensurePad(sc, el);
    return live && sc.scrollHeight - sc.scrollTop - sc.clientHeight - padPx > 500 ? null : sc;
  };
  let token = 0, chain = Promise.resolve(), liveChain = Promise.resolve(), qTimer = 0;
  const play = async (items, tk, live) => {
    items.forEach((el) => { running.add(el); if (!live) { flag(el, "hide", true); inflight.set(el, Date.now()); } });
    try {
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!live && tk !== token) return;
        if (!el.isConnected) { inflight.delete(el); continue; }
        if (live && el.dataset.dyn === "2" && !el.hasAttribute("data-dyn-hide")) continue;
        const sc = prep(el, live);
        if (!sc && !live && !inView(el)) { reveal(el); continue; }
        if (sc && !live && i === 0 && items.length > 1) sc.scrollTop = Math.max(0, goal(sc, el));
        if (sc) await (live ? Promise.race([tweenTo(sc, el, scrollMs()), sleep(scrollMs() + 700)]) : tweenTo(sc, el, scrollMs()));
        if (!live && tk !== token) return;
        if (!el.isConnected) { inflight.delete(el); continue; }
        const dur = show(el);
        if (!live || i < items.length - 1) await sleep((S.mode === "msg" ? S.duration : dur) + S.stagger);
      }
    } finally { items.forEach((el) => running.delete(el)); }
  };
  const queue = (items) => { const tk = token; chain = chain.then(() => play(items, tk)).catch(() => {}); };
  const flush = () => {
    const batch = pending.splice(0).filter((el) => el.isConnected).sort(byDom);
    if (!batch.length) return;
    const seen = document.querySelector(`${MSG}[data-dyn="2"]`), big = batch.length > 3;
    if (big && seen && byDom(batch[batch.length - 1], seen) < 0) return batch.forEach((el) => reveal(el));
    if (!(big && (!seen || byDom(batch[0], seen) < 0))) {
      liveChain = liveChain.then(() => play(batch, 0, true)).catch(() => {});
      return;
    }
    let items = batch;
    if (S.autoScroll) { batch.slice(0, -S.span).forEach((el) => reveal(el)); items = batch.slice(-S.span); }
    queue(items);
  };
  const enqueue = (els) => {
    let added = 0;
    for (const el of els) {
      if (el.dataset.dyn) continue;
      el.dataset.dyn = "1"; flag(el, "hide", true); inflight.set(el, Date.now()); pending.push(el); added++;
    }
    if (added) { clearTimeout(qTimer); qTimer = setTimeout(flush, 30); }
  };
  const clearAll = () => {
    token++; clearTimeout(qTimer); pending.length = 0;
    running.clear(); inflight.clear(); cancelScroll();
    active.forEach((f) => f());
    $$(`${MSG}[data-dyn-hide]`).forEach((el) => flag(el, "hide", false));
    chain = liveChain = Promise.resolve();
  };
  let startId = null;
  const replay = () => {
    clearAll();
    const all = [...$$(MSG)];
    if (!all.length) return;
    all.forEach((el) => { el.dataset.dyn = el.dataset.dyn || "2"; });
    const si = startId ? all.indexOf(document.getElementById(startId)) : -1;
    queue(si >= 0 ? all.slice(si) : S.autoScroll ? all.slice(-S.span) : all.filter(inView));
  };
  const replayOne = (li) => {
    if (!li || !li.isConnected) return;
    clearAll(); flag(li, "hide", true); show(li);
  };
  const scanNew = () => {
    const fresh = [];
    $$(`${MSG}:not([data-dyn])`).forEach((el) => {
      if (el.id && shownIds.has(el.id)) {
        const age = Date.now() - (animAt.get(el.id) || 0);
        if (S.auto && S.mode === "msg" && age >= 0 && age < S.duration - 60) {
          el.dataset.dyn = "2"; flag(el, "hide", false); flag(el, "wm", false);
          el.style.setProperty("animation-delay", -age + "ms"); flag(el, "in", true);
          setTimeout(() => el.style.removeProperty("animation-delay"), S.duration);
        } else reveal(el);
        return;
      }
      scanEl(el); fresh.push(el);
    });
    if (S.auto) enqueue(fresh); else fresh.forEach((el) => reveal(el));
  };
  let lastEl = null, lastId = "";
  const newestMsg = () => {
    const l = (document.querySelector('[data-list-id="chat-messages"]') || document).querySelectorAll(MSG);
    return l[l.length - 1] || null;
  };
  const ensureLatest = () => {
    const cur = newestMsg();
    if (!cur) return;
    const pe = lastEl, pid = lastId;
    lastEl = cur; lastId = cur.id;
    if (!pe || cur === pe || cur.id === pid) return;
    if (!pe.isConnected && !(pid && document.getElementById(pid))) return;
    if (!S.auto || cur.hasAttribute("data-dyn-hide") || cur.hasAttribute("data-dyn-in") || running.has(cur) || pending.includes(cur)) return;
    const t = animAt.get(cur.id);
    if (t && Date.now() - t < S.duration + 400) return;
    cur.dataset.dyn = "1"; flag(cur, "hide", true);
    safeShow(cur);
  };
  { const n = newestMsg(); if (n) { lastEl = n; lastId = n.id; } }
  const panel = document.createElement("div");
  panel.id = ID;
  const check = (k, label) => `<label>${label}<input type="checkbox" data-k="${k}"></label>`;
  const rng = (k, label, min, max, step, m = "") =>
    `<label${m ? ` data-m="${m}"` : ""}>${label}<span class="rg"><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}"><em data-v="${k}"></em></span></label>`;
  const sec = (k, title, inner) =>
    `<h4 data-sec="${k}"><span>${title}</span><b></b></h4><div class="sec" data-for="${k}"><div class="in">${inner}</div></div>`;
  panel.innerHTML = `
    <div class="head"><span>Discord Animatics<i class="ver">v${VER}</i></span>
      <span><button data-act="min" title="Minimize">–</button><button data-act="close" title="Hide panel (Ctrl+D)">✕</button></span></div>
    <div class="bw"><div class="body">
      ${sec("animOpen", "Animations", `
        <label>Animation style<select data-k="anim">${Object.entries(K).map(([n, v]) => `<option value="${n}">${v[0]}</option>`).join("")}</select></label>
        <label>Animate by<select data-k="mode"><option value="msg">Message by message</option><option value="word">Word by word</option><option value="letter">Letter by letter</option></select></label>
        ${rng("duration", "Speed", 150, 1500, 50)}
        ${rng("stagger", "Message delay", 50, 1500, 50)}
        ${rng("wordDelay", "Word delay", 30, 400, 10, "word")}
        ${rng("letterDelay", "Letter delay", 10, 150, 5, "letter")}
        ${check("auto", "Animate new messages")}`)}
      ${sec("scrollOpen", "Auto Scroll", `
        ${check("autoScroll", "Scroll with animation")}
        ${check("scrollSync", "Sync scroll with animation")}
        ${rng("pointY", "Point height", 5, 95, 1)}
        ${rng("span", "Messages to animate", 2, 40, 1)}
        ${rng("scrollDur", "Scroll speed", 0, 2500, 100, "manual")}
        <div class="pt" data-pt></div>
        <div class="row"><button class="mini" data-act="pick">📍 Set point</button><button class="mini" data-act="clear" title="Reset point height">↺ Reset</button><button class="mini" data-act="goto" title="Scroll to latest message">Latest ↓</button></div>`)}
      ${sec("renderOpen", "Render", Object.entries(R).map(([k, v]) => check(k, v[0])).join(""))}
      <div class="pt" data-st></div>
      <div class="row"><button class="mini" data-act="start" title="Click a message in the chat: Play begins from it">🎯 Start from</button><button class="mini" data-act="startclear" title="Back to the default messages">✕ Clear</button></div>
      <div class="gr"><button class="go" data-act="replay">▶ Play</button><button class="go stop" data-act="stop" title="Stop the running animation now">■ Stop</button></div>
      <small>Press Ctrl+D to show or hide this panel.</small>
      <small class="wm">Made by @gamehuntt</small>
    </div></div>`;
  document.body.appendChild(panel);
  const $ = (s) => panel.querySelector(s);
  const UNIT = { span: " msg", pointY: "%" };
  const readout = (k) => { const em = $(`[data-v="${k}"]`); if (em) em.textContent = S[k] + (UNIT[k] || "ms"); };
  const apply = () => {
    panel.dataset.mode = S.mode;
    panel.dataset.sync = S.scrollSync ? "1" : "0";
    panel.classList.toggle("show", S.panel);
    $(".bw").classList.toggle("open", !S.collapsed);
    panel.querySelectorAll("[data-sec]").forEach((h) => {
      const o = !!S[h.dataset.sec];
      h.classList.toggle("open", o);
      $(`[data-for="${h.dataset.sec}"]`).classList.toggle("open", o);
    });
  };
  panel.querySelectorAll("[data-k]").forEach((el) => {
    el.type === "checkbox" ? (el.checked = S[el.dataset.k]) : (el.value = S[el.dataset.k]);
    readout(el.dataset.k);
  });
  const guide = Object.assign(document.createElement("div"), { id: "dyn-guide" });
  document.body.appendChild(guide);
  let pick = null, hov = null, startLabel = "", pv = 0, gt = 0;
  const chatRect = () => { const f = $$(MSG)[0], sc = f && scrollerOf(f); return sc ? sc.getBoundingClientRect() : null; };
  const placeGuide = (y) => {
    const r = chatRect();
    if (!r) { guide.style.display = "none"; return; }
    const yy = y == null ? r.top + (r.height * S.pointY) / 100 : clamp(y, r.top, r.bottom);
    Object.assign(guide.style, { display: "block", left: r.left + "px", width: r.width + "px", top: yy + "px" });
  };
  const flash = () => { placeGuide(); clearTimeout(gt); gt = setTimeout(() => { if (pick !== "pt") guide.style.display = "none"; }, 1400); };
  const updPoint = () => {
    $("[data-pt]").textContent = `📍 Animations play at ${S.pointY}% of the chat height`;
    const b = $('[data-act="pick"]');
    b.textContent = pick === "pt" ? "🎯 Click the spot… (Esc)" : "📍 Set point";
    b.classList.toggle("on", pick === "pt");
  };
  const updStart = () => {
    const b = $('[data-act="start"]');
    b.textContent = pick === "msg" ? "🎯 Click a message… (Esc)" : "🎯 Start from";
    b.classList.toggle("on", pick === "msg");
    $("[data-st]").textContent = !startId ? "▶ Play starts from the default messages"
      : document.getElementById(startId) ? `▶ Play starts from: “${startLabel}”` : "▶ Start message isn’t loaded, using default";
  };
  const syncPoint = () => { $('[data-k="pointY"]').value = S.pointY; readout("pointY"); updPoint(); refreshPad(); };
  const setPick = (m) => {
    pick = pick === m ? null : m;
    document.body.classList.toggle("dyn-pick", !!pick);
    if (pick === "pt") placeGuide(); else guide.style.display = "none";
    if (pick !== "msg" && hov) { hov.classList.remove("dyn-hover"); hov = null; }
    updPoint(); updStart();
  };
  const unmark = () => $$("[data-dyn-start]").forEach((n) => n.removeAttribute("data-dyn-start"));
  const setStart = (li) => {
    unmark(); startId = li.id; li.setAttribute("data-dyn-start", "");
    const t = (root(li).textContent || "").replace(/\s+/g, " ").trim();
    startLabel = t ? (t.length > 28 ? t.slice(0, 28) + "…" : t) : "message";
  };
  const clearStart = () => { unmark(); startId = null; startLabel = ""; updStart(); };
  on(window, "mousemove", (e) => {
    if (!pick || panel.contains(e.target)) return;
    if (pick === "pt") return placeGuide(e.clientY);
    const li = e.target.closest ? e.target.closest(MSG) : null;
    if (li !== hov) { hov?.classList.remove("dyn-hover"); hov = li; hov?.classList.add("dyn-hover"); }
  }, true);
  on(window, "click", (e) => {
    if (!pick || panel.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    let hit = false;
    if (pick === "msg") { const li = e.target.closest ? e.target.closest(MSG) : null; if (li) setStart(li); }
    else {
      const r = chatRect();
      if (r && e.clientY >= r.top && e.clientY <= r.bottom) { S.pointY = clamp(Math.round(((e.clientY - r.top) / r.height) * 100), 5, 95); save(); hit = true; }
    }
    setPick(null);
    if (hit) { syncPoint(); flash(); }
  }, true);
  let ctxId = "", ctxAt = 0;
  const closeMenu = () => {
    const k = { key: "Escape", code: "Escape", keyCode: 27, which: 27, bubbles: true, cancelable: true };
    [document.activeElement || document.body, document].forEach((t) => t.dispatchEvent(new KeyboardEvent("keydown", k)));
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  };
  const injectMenu = () => $$('[role="menu"]').forEach((menu) => {
    if (menu.querySelector("#dyn-replay-item") || (!menu.hasAttribute("data-dyn-menu") && Date.now() - ctxAt > 1500)) return;
    const ref = menu.querySelector("#message-reply") || menu.querySelector('[role="menuitem"]');
    if (!ref) return;
    menu.setAttribute("data-dyn-menu", "");
    const lab = ref.querySelector('[class*="label"]'), item = ref.cloneNode(false);
    item.id = "dyn-replay-item";
    item.className = item.className.split(" ").filter((c) => !/focused/.test(c)).join(" ");
    item.append(Object.assign(document.createElement("div"), { className: lab ? lab.className : "", textContent: "Replay animation" }));
    ["pointerdown", "mousedown", "mouseup"].forEach((t) => item.addEventListener(t, (e) => e.stopPropagation()));
    item.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      replayOne(document.getElementById(ctxId));
      closeMenu();
    });
    ref.after(item);
  });
  on(window, "contextmenu", (e) => {
    const li = e.target.closest && !panel.contains(e.target) ? e.target.closest(MSG) : null;
    ctxId = li ? li.id : ""; ctxAt = Date.now();
    if (li) [60, 200].forEach((ms) => setTimeout(injectMenu, ms));
  }, true);
  ["wheel", "touchmove"].forEach((t) => on(window, t, (e) => { if (!panel.contains(e.target)) cancelScroll(); }, { capture: true, passive: true }));
  const gotoPoint = () => {
    const all = $$(MSG), el = all[all.length - 1], sc = el && scrollerOf(el);
    if (!sc) return;
    ensurePad(sc, el);
    tweenTo(sc, el, scrollMs());
  };
  const stopAnim = () => {
    clearTimeout(pv); clearAll();
    $$(MSG).forEach((el) => { ["in", "wm", "hide"].forEach((n) => flag(el, n, false)); el.dataset.dyn = "2"; rememberId(el); });
  };
  panel.addEventListener("input", (e) => {
    const el = e.target, k = el.dataset.k;
    if (!k) return;
    S[k] = el.type === "checkbox" ? el.checked : el.type === "range" ? +el.value : el.value;
    save(); readout(k); setVars();
    if (k === "anim" || k in R) applyDyn();
    if (k === "mode" || k === "scrollSync") apply();
    if (k === "autoScroll" && !S.autoScroll) clearPad();
    if (k === "pointY") { refreshPad(); updPoint(); flash(); }
    if (k !== "auto" && !(k in R)) { clearTimeout(pv); pv = setTimeout(replay, 500); }
  });
  panel.addEventListener("click", (e) => {
    const h = e.target.closest("[data-sec]"), b = e.target.closest("[data-act]"), a = b && b.dataset.act;
    if (h) S[h.dataset.sec] = !S[h.dataset.sec];
    else if (a === "min") S.collapsed = !S.collapsed;
    else if (a === "close") { S.panel = false; setPick(null); }
    else if (a === "clear") { S.pointY = D.pointY; syncPoint(); flash(); }
    else return ({
      replay: () => { b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse"); replay(); },
      stop: stopAnim, start: () => setPick("msg"), startclear: clearStart, pick: () => setPick("pt"), goto: gotoPoint,
    }[a] || (() => {}))();
    save(); apply();
  });
  const place = (x, y) => {
    x = clamp(x, 0, innerWidth - 60); y = clamp(y, 0, innerHeight - 40);
    Object.assign(panel.style, { left: x + "px", top: y + "px", right: "auto", bottom: "auto" });
    return [x, y];
  };
  if (S.x == null) Object.assign(panel.style, { right: "16px", bottom: "16px" }); else place(S.x, S.y);
  const head = $(".head");
  let off = null;
  head.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    const r = panel.getBoundingClientRect();
    off = [e.clientX - r.left, e.clientY - r.top];
    panel.classList.add("drag");
    try { head.setPointerCapture(e.pointerId); } catch {}
  });
  head.addEventListener("pointermove", (e) => off && place(e.clientX - off[0], e.clientY - off[1]));
  head.addEventListener("pointerup", () => {
    if (!off) return;
    off = null; panel.classList.remove("drag");
    const r = panel.getBoundingClientRect();
    [S.x, S.y] = place(r.left, r.top); save();
  });
  on(window, "resize", () => { refreshPad(); if (S.panel && S.x != null) place(panel.offsetLeft, panel.offsetTop); });
  on(window, "keydown", (e) => {
    if (e.key === "Escape" && pick) return setPick(null);
    if (e.key && e.key.toLowerCase() === "d" && e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      e.preventDefault(); e.stopPropagation();
      S.panel = !S.panel; save(); apply();
    }
  }, true);
  setVars(); applyDyn(); apply(); updPoint(); updStart();
  panel.classList.remove("show");
  void panel.offsetWidth;
  requestAnimationFrame(() => { apply(); setTimeout(() => panel.classList.add("ready"), 400); });
  const observer = new MutationObserver((muts) => {
    if (ctxId) injectMenu();
    const hit = muts.some((m) => [...m.addedNodes].some((n) =>
      n.nodeType === 1 && n !== panel && !n.classList.contains("dyn-w") && !n.classList.contains("dyn-nw")));
    if (hit) { scanNew(); ensureLatest(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const scanTimer = setInterval(() => { scanNew(); ensureLatest(); }, 150);
  const wdTimer = setInterval(() => {
    const now = Date.now();
    $$(`${MSG}[data-dyn-hide],${MSG}[data-dyn="1"]`).forEach((el) => {
      if (running.has(el) || pending.includes(el)) return;
      const t = inflight.get(el);
      if (t && now - t < (el.hasAttribute("data-dyn-hide") ? 2500 : 3000)) return;
      inflight.delete(el);
      safeShow(el);
    });
  }, 800);
  if (S.auto) enqueue([...$$(MSG)]);
  window.__DYN__ = {
    version: VER,
    destroy() {
      [pv, gt, qTimer].forEach(clearTimeout);
      [scanTimer, wdTimer].forEach(clearInterval);
      observer.disconnect(); clearAll(); clearPad(); setPick(null); unmark();
      offs.forEach((f) => f());
      $$("#dyn-replay-item").forEach((n) => n.remove());
      guide.remove(); staticStyle.remove(); dynStyle.remove(); panel.remove();
      ["--dyn-dur", "--dyn-wdur", "--dyn-ease"].forEach((v) => document.documentElement.style.removeProperty(v));
      $$(MSG).forEach((el) => {
        ["in", "hide", "wm", "call"].forEach((n) => flag(el, n, false));
        el.style.removeProperty("animation-delay");
        el.removeAttribute("data-dyn");
      });
      delete window.__DYN__;
    },
  };
  console.log(`%c[Discord Animatics] v${VER} loaded. Made by @gamehuntt`, "color:#5865f2;font-weight:bold");
})();
