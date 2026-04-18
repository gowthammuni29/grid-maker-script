import { useState, useRef, useEffect, useCallback } from "react";

const A4_W_IN = 8.27;
const A4_H_IN = 11.69;
const DEFAULT_COLS = 8;
const DEFAULT_ROWS = 9;
const DEFAULT_CELL_IN = 1.0;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #07090f;
    --bg2:      #0b0e18;
    --sf:       rgba(255,255,255,0.035);
    --sf2:      rgba(255,255,255,0.07);
    --bd:       rgba(255,255,255,0.07);
    --bd2:      rgba(255,255,255,0.13);
    --gold:     #c8a84b;
    --gold2:    #e9cf7e;
    --golddim:  rgba(200,168,75,0.14);
    --text:     #ede8df;
    --muted:    #6e6456;
    --dim:      #2a2620;
    --red:      #d94f3a;
    --green:    #3a9e68;
    --blue:     #4a8fcb;
    --anim:     0.2s cubic-bezier(.4,0,.2,1);
    --sw:       288px;
    --hh:       54px;
    --th:       38px;
  }

  html, body, #root { height: 100%; overflow: hidden; }
  body { background: var(--bg); font-family: 'JetBrains Mono', monospace; color: var(--text); -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }

  .app {
    height: 100%; display: flex; flex-direction: column;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 90% 55% at 15% -5%, rgba(200,168,75,0.055) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 88% 108%, rgba(74,143,203,0.04) 0%, transparent 50%);
    animation: appIn 0.45s ease both;
  }
  @keyframes appIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }

  /* Header */
  .hdr {
    height: var(--hh); flex-shrink: 0;
    display: flex; align-items: center; gap: 13px; padding: 0 20px;
    background: rgba(7,9,15,0.97); border-bottom: 1px solid var(--bd);
    backdrop-filter: blur(14px); position: relative; z-index: 30;
  }
  .hdr::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 35%, var(--gold2) 65%, transparent 100%);
    opacity: 0.28;
  }
  .logo {
    width: 31px; height: 31px; border-radius: 7px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    display: flex; align-items: center; justify-content: center; font-size: 13px;
    box-shadow: 0 0 14px rgba(200,168,75,0.32);
    animation: logoPulse 3.5s ease infinite;
  }
  @keyframes logoPulse { 0%,100%{box-shadow:0 0 14px rgba(200,168,75,0.3);} 50%{box-shadow:0 0 26px rgba(200,168,75,0.55);} }
  .h-title {
    font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:700;
    background: linear-gradient(105deg, var(--gold2), var(--text));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:0.5px;
  }
  .h-sub { font-size:8px; color:var(--muted); letter-spacing:3px; text-transform:uppercase; margin-top:2px; }
  .h-right { margin-left:auto; display:flex; align-items:center; gap:7px; }
  .badge {
    padding:3px 9px; border-radius:20px; font-size:8px; letter-spacing:2px; white-space:nowrap;
    border:1px solid rgba(200,168,75,0.22); color:var(--gold); background:rgba(200,168,75,0.05);
  }
  .badge.ok { color:#42d68a; border-color:rgba(66,214,138,0.25); background:rgba(66,214,138,0.04); }

  /* Banners */
  .banner {
    display:flex; align-items:center; gap:10px; padding:8px 20px; flex-shrink:0;
    font-size:9.5px; color:var(--text); animation: slideD 0.3s ease both;
  }
  @keyframes slideD { from{opacity:0;transform:translateY(-7px);} to{opacity:1;transform:translateY(0);} }
  .banner.gold-b { background:linear-gradient(90deg,rgba(200,168,75,0.1),rgba(200,168,75,0.04)); border-bottom:1px solid rgba(200,168,75,0.16); }
  .banner.blue-b { background:linear-gradient(90deg,rgba(74,143,203,0.1),rgba(74,143,203,0.04)); border-bottom:1px solid rgba(74,143,203,0.18); }
  .banner .btext { flex:1; line-height:1.5; }
  .banner strong { color:var(--gold); font-weight:500; }
  .banner .blue-b strong { color:#7ac4f5; }
  .btn-sm {
    border:none; border-radius:6px; padding:5px 11px;
    font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:1px;
    cursor:pointer; flex-shrink:0; transition:all var(--anim);
  }
  .btn-sm.gold { background:linear-gradient(135deg,var(--gold),var(--gold2)); color:#07090f; font-weight:600; }
  .btn-sm.gold:hover { transform:translateY(-1px); box-shadow:0 3px 10px rgba(200,168,75,0.4); }
  .btn-sm.blue { background:var(--blue); color:#fff; }
  .btn-sm.blue:hover { opacity:0.85; }
  .btn-x { background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; padding:2px 5px; flex-shrink:0; transition:color var(--anim); }
  .btn-x:hover { color:var(--text); }

  /* Body */
  .body { display:flex; flex:1; overflow:hidden; }

  /* Sidebar */
  .sb {
    width:var(--sw); flex-shrink:0;
    background:var(--bg2); border-right:1px solid var(--bd);
    display:flex; flex-direction:column; overflow:hidden;
  }

  /* Tabs */
  .tabs { display:flex; flex-shrink:0; border-bottom:1px solid var(--bd); background:rgba(7,9,15,0.5); }
  .tab {
    flex:1; height:var(--th);
    display:flex; align-items:center; justify-content:center; gap:4px;
    font-size:7.5px; letter-spacing:2px; text-transform:uppercase;
    color:var(--muted); cursor:pointer; border:none; background:none;
    position:relative; transition:color var(--anim);
    font-family:'JetBrains Mono',monospace;
  }
  .tab:hover { color:var(--text); }
  .tab.on { color:var(--gold); }
  .tab.on::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px;
    background:linear-gradient(90deg,var(--gold),var(--gold2)); border-radius:2px 2px 0 0;
    animation:tline 0.25s ease both;
  }
  @keyframes tline { from{transform:scaleX(0);} to{transform:scaleX(1);} }
  .tdot {
    width:5px; height:5px; border-radius:50%; background:var(--red); flex-shrink:0;
    animation:dpulse 1.5s ease infinite;
  }
  @keyframes dpulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }

  /* Panel */
  .panel { flex:1; overflow-y:auto; overflow-x:hidden; padding:17px 15px 0; display:flex; flex-direction:column; gap:17px; }
  .panel.off { display:none; }

  .slabel {
    font-size:8px; letter-spacing:4px; text-transform:uppercase; color:var(--gold);
    margin-bottom:10px; display:flex; align-items:center; gap:7px;
  }
  .slabel::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--bd2),transparent); }

  .fl { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }

  .irow { display:flex; gap:7px; }
  .nw { flex:1; }
  .nw input, .nw select {
    width:100%; background:var(--sf); border:1px solid var(--bd); border-radius:7px;
    color:var(--text); padding:7px 9px; font-size:13px;
    font-family:'JetBrains Mono',monospace; outline:none; appearance:none;
    transition:border-color var(--anim), background var(--anim), box-shadow var(--anim);
  }
  .nw input:hover,.nw select:hover { border-color:var(--bd2); }
  .nw input:focus,.nw select:focus { border-color:var(--gold); background:var(--sf2); box-shadow:0 0 0 3px rgba(200,168,75,0.07); }

  .icard {
    background:var(--sf); border:1px solid var(--bd); border-radius:9px;
    padding:10px 11px; margin-top:7px; display:flex; flex-direction:column; gap:5px;
  }
  .ir { display:flex; justify-content:space-between; font-size:9px; }
  .ir .k { color:var(--muted); } .ir .v { color:var(--text); } .ir .va { color:var(--gold); font-weight:500; }

  .crow { display:flex; gap:7px; align-items:flex-end; margin-bottom:9px; }
  .cw { flex:1.2; }
  .cw input[type="color"] {
    width:100%; height:33px; border:1px solid var(--bd); border-radius:7px;
    background:var(--sf); cursor:pointer; padding:3px; transition:border-color var(--anim);
  }
  .cw input[type="color"]:hover { border-color:var(--bd2); }

  .slw { margin-bottom:2px; }
  .slw input[type="range"] { width:100%; accent-color:var(--gold); cursor:pointer; }

  .dzone {
    border:1.5px dashed var(--bd2); border-radius:11px;
    padding:18px 13px; text-align:center; cursor:pointer;
    transition:all var(--anim); background:var(--sf); position:relative; overflow:hidden;
  }
  .dzone::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 0%,rgba(200,168,75,0.07) 0%,transparent 70%);
    opacity:0; transition:opacity var(--anim);
  }
  .dzone:hover::before,.dzone.drag::before { opacity:1; }
  .dzone:hover,.dzone.drag { border-color:var(--gold); }
  .dicon { font-size:22px; margin-bottom:6px; opacity:0.5; transition:transform var(--anim); }
  .dzone:hover .dicon { transform:translateY(-2px); opacity:0.75; }
  .dtext { font-size:9px; color:var(--muted); letter-spacing:1px; line-height:1.7; }
  .dtext strong { color:var(--gold); font-weight:400; }

  .ithumb { margin-top:9px; border-radius:7px; overflow:hidden; border:1px solid var(--bd); animation:fadeIn 0.3s ease both; }
  @keyframes fadeIn { from{opacity:0;transform:scale(0.97);} to{opacity:1;transform:scale(1);} }
  .ithumb img { width:100%; height:75px; object-fit:cover; display:block; }
  .ithumb-info { padding:5px 8px; background:var(--sf); font-size:8.5px; color:var(--muted); display:flex; justify-content:space-between; }
  .ithumb-info em { color:var(--gold); font-style:normal; }

  .ftog { display:flex; border-radius:7px; overflow:hidden; border:1px solid var(--bd); }
  .fbtn {
    flex:1; padding:6px 4px; font-family:'JetBrains Mono',monospace; font-size:7.5px;
    letter-spacing:1px; text-transform:uppercase; border:none; cursor:pointer;
    background:var(--sf); color:var(--muted); transition:all var(--anim);
  }
  .fbtn.on { background:var(--golddim); color:var(--gold); }
  .fbtn:not(.on):hover { background:var(--sf2); color:var(--text); }

  .chips { display:flex; gap:5px; flex-wrap:wrap; }
  .chip {
    padding:4px 9px; border-radius:5px; font-size:8px; letter-spacing:1.5px; text-transform:uppercase;
    border:1px solid var(--bd); background:var(--sf); color:var(--muted); cursor:pointer;
    font-family:'JetBrains Mono',monospace; transition:all var(--anim);
  }
  .chip:hover { border-color:var(--bd2); color:var(--text); }
  .chip.on { border-color:var(--gold); color:var(--gold); background:var(--golddim); }
  .chip.blue-on { border-color:var(--blue); color:#7ac4f5; background:rgba(74,143,203,0.09); }

  .btn {
    width:100%; border:none; border-radius:8px; padding:8px 13px;
    font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; transition:all var(--anim); display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .btn.ghost { background:var(--sf); color:var(--muted); border:1px solid var(--bd); margin-top:7px; }
  .btn.ghost:hover { background:var(--sf2); color:var(--text); border-color:var(--bd2); }

  .div { height:1px; background:var(--bd); margin:0 -15px; }

  /* Footer */
  .sbfoot { padding:13px 15px 17px; border-top:1px solid var(--bd); display:flex; flex-direction:column; gap:7px; flex-shrink:0; }
  .expbtn {
    background:linear-gradient(135deg,#c8a84b 0%,#e9cf7e 100%); color:#07090f;
    font-weight:600; font-size:9.5px; box-shadow:0 4px 14px rgba(200,168,75,0.18); padding:11px 13px;
    position:relative; overflow:hidden;
  }
  .expbtn::before {
    content:''; position:absolute; top:0; left:-100%; width:55%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
    transition:left 0.55s ease;
  }
  .expbtn:hover::before { left:160%; }
  .expbtn:hover { box-shadow:0 6px 22px rgba(200,168,75,0.36); transform:translateY(-1px); }
  .expbtn.ok { background:linear-gradient(135deg,#2e8a5c,#42d68a); box-shadow:0 4px 14px rgba(66,214,138,0.22); }
  .expbtn:disabled { opacity:0.7; cursor:wait; }
  .phint { font-size:8px; color:var(--muted); text-align:center; line-height:1.9; letter-spacing:1px; }
  .phint strong { color:var(--gold); font-weight:400; }

  /* Main */
  .main {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:26px 22px; overflow:auto; position:relative; gap:13px;
  }
  .main::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(255,255,255,0.009) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.009) 1px,transparent 1px);
    background-size:30px 30px;
  }
  .pvlabel { font-size:8px; letter-spacing:5px; text-transform:uppercase; color:var(--muted); position:relative; z-index:1; }

  .couter { position:relative; z-index:1; }
  .rulh, .rulv {
    position:absolute; font-size:7px; color:rgba(200,168,75,0.6);
    pointer-events:none; letter-spacing:1px;
    background:rgba(200,168,75,0.07); border-radius:3px; display:flex; align-items:center; justify-content:center;
  }
  .rulh { top:-17px; left:0; right:0; height:14px; }
  .rulv { left:-19px; top:0; bottom:0; width:17px; writing-mode:vertical-rl; transform:rotate(180deg); }

  .cwrap {
    border-radius:3px; overflow:hidden;
    box-shadow:0 0 0 1px rgba(255,255,255,0.05),0 22px 58px rgba(0,0,0,0.72),0 4px 14px rgba(0,0,0,0.45);
    transition:box-shadow 0.3s; max-width:100%;
    animation:cvIn 0.4s ease both;
  }
  @keyframes cvIn { from{opacity:0;transform:scale(0.97) translateY(7px);} to{opacity:1;transform:scale(1) translateY(0);} }
  .cwrap:hover { box-shadow:0 0 0 1px rgba(200,168,75,0.11),0 26px 66px rgba(0,0,0,0.78),0 4px 18px rgba(0,0,0,0.45); }
  .cwrap canvas { display:block; max-width:100%; height:auto; }

  .pvfoot { font-size:9px; color:var(--muted); letter-spacing:2px; text-align:center; position:relative; z-index:1; line-height:2; }
  .pvfoot span { color:var(--gold); }
  .warn { font-size:8.5px; color:var(--red); background:rgba(217,79,58,0.06); border:1px solid rgba(217,79,58,0.14); border-radius:5px; padding:6px 9px; margin-top:5px; letter-spacing:1px; line-height:1.6; animation:fadeIn 0.2s ease both; }

  @media(max-width:820px){:root{--sw:238px;} .h-sub{display:none;}}
  @media(max-width:620px){.body{flex-direction:column;} :root{--sw:100%;} .sb{height:auto;border-right:none;border-bottom:1px solid var(--bd);} .main{padding:14px;}}
`;

function hexToRGB(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}

function getFitRect(iw, ih, bw, bh, mode) {
  if (mode === "fill") return { x:0, y:0, w:bw, h:bh };
  const ir = iw/ih, br = bw/bh;
  let w, h;
  if (mode === "fit")   { if(ir>br){w=bw;h=bw/ir;}else{h=bh;w=bh*ir;} }
  if (mode === "cover") { if(ir>br){h=bh;w=bh*ir;}else{w=bw;h=bw/ir;} }
  return { x:(bw-w)/2, y:(bh-h)/2, w, h };
}

export default function GridMaker() {
  const [cols,    setCols]    = useState(DEFAULT_COLS);
  const [rows,    setRows]    = useState(DEFAULT_ROWS);
  const [cellIn,  setCellIn]  = useState(DEFAULT_CELL_IN);
  const [lColor,  setLColor]  = useState("#c8a84b");
  const [lWidth,  setLWidth]  = useState(1.5);
  const [lOpacity,setLOpacity]= useState(0.85);
  const [image,   setImage]   = useState(null);
  const [imgMeta, setImgMeta] = useState(null);
  const [fitMode, setFitMode] = useState("fit");
  const [dragging,setDragging]= useState(false);
  const [eFmt,    setEFmt]    = useState("png");
  const [eDPI,    setEDPI]    = useState(150);
  const [exported,setExported]= useState(false);
  const [exporting,setExporting]= useState(false);
  const [installPrompt,setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS,   setIsIOS]   = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [installed,setInstalled]= useState(false);
  const [showUpdate,setShowUpdate]= useState(false);
  const [tab,     setTab]     = useState("grid");
  const [dots,    setDots]    = useState({});
  const prev = useRef({ cols, rows, cellIn, lColor, lWidth, lOpacity, fitMode });

  const previewRef  = useRef(null);
  const fileRef     = useRef(null);
  const imgRef      = useRef(null);
  const mainRef     = useRef(null);
  const [pScale,    setPScale] = useState(0.36);

  // Derived
  const gridWin   = cols * cellIn;
  const gridHin   = rows * cellIn;
  const expCellPx = eDPI * cellIn;
  const expGridW  = Math.round(cols * expCellPx);
  const expGridH  = Math.round(rows * expCellPx);
  const expA4W    = Math.round(A4_W_IN * eDPI);
  const expA4H    = Math.round(A4_H_IN * eDPI);
  const mSide     = ((A4_W_IN - gridWin)/2).toFixed(2);
  const mTop      = ((A4_H_IN - gridHin)/2).toFixed(2);
  const tooBig    = gridWin > A4_W_IN || gridHin > A4_H_IN;

  // Preview dims
  const pvA4W = Math.round(expA4W * pScale);
  const pvA4H = Math.round(expA4H * pScale);

  // Resize observer for preview scale
  useEffect(() => {
    const update = () => {
      if (!mainRef.current) return;
      const w = mainRef.current.clientWidth  - 55;
      const h = mainRef.current.clientHeight - 85;
      setPScale(Math.min(w/expA4W, h/expA4H, 0.44));
    };
    update();
    const ro = new ResizeObserver(update);
    if (mainRef.current) ro.observe(mainRef.current);
    return () => ro.disconnect();
  }, [expA4W, expA4H]);

  // Change dot detection
  useEffect(() => {
    const c = { cols, rows, cellIn, lColor, lWidth, lOpacity, fitMode };
    const p = prev.current;
    const d = {};
    if (c.cols!==p.cols||c.rows!==p.rows||c.cellIn!==p.cellIn) d.grid=true;
    if (c.lColor!==p.lColor||c.lWidth!==p.lWidth||c.lOpacity!==p.lOpacity) d.lines=true;
    if (c.fitMode!==p.fitMode) d.image=true;
    setDots(d); prev.current = c;
  }, [cols, rows, cellIn, lColor, lWidth, lOpacity, fitMode]);

  const goTab = (t) => { setTab(t); setDots(d => ({...d,[t]:false})); };

  // PWA
  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const sa  = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setIsIOS(ios); setInstalled(sa);
    if (ios && !sa) setShowIOS(true);
    window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); setInstallPrompt(e); setShowInstall(true); });
    window.addEventListener("appinstalled", () => { setInstalled(true); setShowInstall(false); });
  }, []);
  const doInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const {outcome} = await installPrompt.userChoice;
    if (outcome==="accepted") setShowInstall(false);
    setInstallPrompt(null);
  };

  // Draw function (works for both preview and export)
  const draw = useCallback((canvas, cw, ch, scale) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cw, ch);

    const cellPx  = eDPI * cellIn * scale;
    const gridWpx = cols  * cellPx;
    const gridHpx = rows  * cellPx;
    const offX    = Math.round((cw - gridWpx) / 2);
    const offY    = Math.round((ch - gridHpx) / 2);

    // Image
    if (imgRef.current) {
      const img = imgRef.current;
      const r   = getFitRect(img.naturalWidth, img.naturalHeight, gridWpx, gridHpx, fitMode);
      ctx.save();
      ctx.beginPath(); ctx.rect(offX, offY, gridWpx, gridHpx); ctx.clip();
      ctx.drawImage(img, offX + r.x, offY + r.y, r.w, r.h);
      ctx.restore();
    } else if (scale < 1) {
      ctx.fillStyle = "#f7f3ee"; ctx.fillRect(offX, offY, gridWpx, gridHpx);
      for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
        if ((r+c)%2===0){ctx.fillStyle="#ede7de";ctx.fillRect(offX+c*cellPx,offY+r*cellPx,cellPx,cellPx);}
      }
      ctx.fillStyle="#bca882"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.font=`${Math.max(8,cellPx*0.19)}px Georgia,serif`;
      ctx.fillText("Drop or tap to load image", offX+gridWpx/2, offY+gridHpx/2-cellPx*0.14);
      ctx.font=`italic ${Math.max(7,cellPx*0.13)}px Georgia,serif`;
      ctx.fillStyle="#cfc0a0";
      ctx.fillText(`${cols}×${rows} grid · ${cellIn}" per cell`, offX+gridWpx/2, offY+gridHpx/2+cellPx*0.21);
    }

    // Grid lines
    const [r2,g2,b2] = hexToRGB(lColor);
    ctx.strokeStyle = `rgba(${r2},${g2},${b2},${lOpacity})`;
    ctx.lineWidth   = lWidth * (scale < 1 ? Math.max(0.5, scale * 1.3) : 1);
    for (let c=0;c<=cols;c++){ctx.beginPath();ctx.moveTo(offX+c*cellPx,offY);ctx.lineTo(offX+c*cellPx,offY+gridHpx);ctx.stroke();}
    for (let r=0;r<=rows;r++){ctx.beginPath();ctx.moveTo(offX,offY+r*cellPx);ctx.lineTo(offX+gridWpx,offY+r*cellPx);ctx.stroke();}

    if (scale<1){
      ctx.strokeStyle="rgba(170,145,100,0.08)";ctx.lineWidth=0.5;
      ctx.setLineDash([3,5]);ctx.strokeRect(offX,offY,gridWpx,gridHpx);ctx.setLineDash([]);
    }
  }, [cols, rows, cellIn, lColor, lWidth, lOpacity, fitMode, eDPI, image]);

  useEffect(() => { draw(previewRef.current, pvA4W, pvA4H, pScale); }, [draw, pvA4W, pvA4H, pScale]);

  const loadImg = (file) => {
    if (!file||!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImage(e.target.result);
        setImgMeta({w:img.naturalWidth,h:img.naturalHeight,name:file.name,size:(file.size/1024).toFixed(0)});
        goTab("image");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const onDrop = e => { e.preventDefault(); setDragging(false); loadImg(e.dataTransfer.files[0]); };

  const doExport = async () => {
    setExporting(true);
    await new Promise(r=>setTimeout(r,60));
    const canvas = document.createElement("canvas");
    canvas.width  = expA4W; canvas.height = expA4H;
    draw(canvas, expA4W, expA4H, 1.0);
    const mime = {png:"image/png", jpg:"image/jpeg", webp:"image/webp"}[eFmt];
    const ext  = eFmt;
    const q    = eFmt==="png"?1:0.92;
    const link = document.createElement("a");
    link.download = `grid-${cols}x${rows}-${cellIn}in-A4.${ext}`;
    link.href = canvas.toDataURL(mime, q);
    link.click();
    setExporting(false); setExported(true);
    setTimeout(()=>setExported(false), 2600);
  };

  const TABS = [{id:"grid",l:"Grid"},{id:"lines",l:"Lines"},{id:"image",l:"Image"},{id:"export",l:"Export"}];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* ── Header ── */}
        <header className="hdr">
          <div className="logo">⊞</div>
          <div>
            <div className="h-title">Grid Maker</div>
            <div className="h-sub">A4 · Dynamic cell size · Multi-format export</div>
          </div>
          <div className="h-right">
            {installed ? <div className="badge ok">✓ Installed</div> : <div className="badge">Install as App</div>}
          </div>
        </header>

        {/* ── Update banner ── */}
        {showUpdate && (
          <div className="banner blue-b">
            <span style={{fontSize:14}}>🔄</span>
            <div className="btext"><strong style={{color:"#7ac4f5"}}>Update available</strong> — new features ready to load</div>
            <button className="btn-sm blue" onClick={()=>{setShowUpdate(false);window.location.reload();}}>Update</button>
            <button className="btn-x" onClick={()=>setShowUpdate(false)}>✕</button>
          </div>
        )}

        {/* ── Install banners ── */}
        {showInstall && !installed && (
          <div className="banner gold-b">
            <span style={{fontSize:14}}>📲</span>
            <div className="btext"><strong>Install Grid Maker</strong><br /><span style={{color:"var(--muted)",fontSize:"8.5px"}}>Works offline · No browser bar · Opens instantly</span></div>
            <button className="btn-sm gold" onClick={doInstall}>Install</button>
            <button className="btn-x" onClick={()=>setShowInstall(false)}>✕</button>
          </div>
        )}
        {isIOS && showIOS && !installed && (
          <div className="banner gold-b">
            <span style={{fontSize:14}}>📤</span>
            <div className="btext">Tap <strong>Share</strong> → <strong>"Add to Home Screen"</strong></div>
            <button className="btn-x" onClick={()=>setShowIOS(false)}>✕</button>
          </div>
        )}

        <div className="body">
          {/* ── Sidebar ── */}
          <aside className="sb">

            {/* Tabs */}
            <div className="tabs">
              {TABS.map(t=>(
                <button key={t.id} className={`tab${tab===t.id?" on":""}`} onClick={()=>goTab(t.id)}>
                  {t.l}{dots[t.id]&&tab!==t.id&&<span className="tdot"/>}
                </button>
              ))}
            </div>

            {/* ── Grid Tab ── */}
            <div className={`panel${tab==="grid"?"":" off"}`}>
              <div>
                <div className="slabel">Columns & Rows</div>
                <div className="irow">
                  <div className="nw"><div className="fl">Columns</div>
                    <input type="number" value={cols} min={1} max={30} onChange={e=>setCols(Math.max(1,+e.target.value))}/>
                  </div>
                  <div className="nw"><div className="fl">Rows</div>
                    <input type="number" value={rows} min={1} max={30} onChange={e=>setRows(Math.max(1,+e.target.value))}/>
                  </div>
                </div>
              </div>
              <div>
                <div className="slabel">Cell Size (inches)</div>
                <div className="nw">
                  <div className="fl">Inches per cell</div>
                  <input type="number" value={cellIn} min={0.25} max={6} step={0.25}
                    onChange={e=>setCellIn(Math.max(0.25,+e.target.value))}/>
                </div>
                <div style={{marginTop:6,fontSize:8.5,color:"var(--muted)",lineHeight:1.8}}>
                  Quick set:&nbsp;
                  {[0.5,0.75,1,1.25,1.5,2].map(v=>(
                    <span key={v} style={{color:"var(--gold)",cursor:"pointer",marginRight:6}} onClick={()=>setCellIn(v)}>{v}"</span>
                  ))}
                </div>
              </div>
              {tooBig&&<div className="warn">⚠ Grid ({gridWin.toFixed(2)}"×{gridHin.toFixed(2)}") exceeds A4 ({A4_W_IN}"×{A4_H_IN}"). Reduce cells or cell size.</div>}
              <div className="icard">
                <div className="ir"><span className="k">Grid area</span><span className="v">{gridWin.toFixed(2)}" × {gridHin.toFixed(2)}"</span></div>
                <div className="ir"><span className="k">Cell size</span><span className="va">{cellIn}" × {cellIn}"</span></div>
                <div className="ir"><span className="k">Total cells</span><span className="v">{cols*rows}</span></div>
                <div className="ir"><span className="k">A4 page</span><span className="v">{A4_W_IN}" × {A4_H_IN}"</span></div>
                <div className="ir"><span className="k">Side margin</span><span className="va">{mSide}" each</span></div>
                <div className="ir"><span className="k">Top/bottom</span><span className="va">{mTop}" each</span></div>
              </div>
              <div style={{height:8}}/>
            </div>

            {/* ── Lines Tab ── */}
            <div className={`panel${tab==="lines"?"":" off"}`}>
              <div>
                <div className="slabel">Line Style</div>
                <div className="crow">
                  <div className="cw"><div className="fl">Color</div>
                    <input type="color" value={lColor} onChange={e=>setLColor(e.target.value)}/>
                  </div>
                  <div className="nw"><div className="fl">Width px</div>
                    <input type="number" value={lWidth} min={0.5} max={8} step={0.5} onChange={e=>setLWidth(+e.target.value)}/>
                  </div>
                </div>
                <div className="slw">
                  <div className="fl">Opacity — {Math.round(lOpacity*100)}%</div>
                  <input type="range" value={lOpacity} min={0.05} max={1} step={0.05} onChange={e=>setLOpacity(+e.target.value)}/>
                </div>
              </div>
              <div>
                <div className="slabel">Presets</div>
                <div className="chips">
                  {[
                    {l:"Red",  c:"#d94f3a",w:1.5,o:0.85},{l:"Gold",c:"#c8a84b",w:1.5,o:0.85},
                    {l:"Black",c:"#1a1a1a",w:1,  o:1  },{l:"Blue",c:"#4a8fcb",w:1.5,o:0.8 },
                    {l:"White",c:"#ffffff",w:1,  o:0.7},{l:"Gray", c:"#888",  w:1,  o:0.6 },
                    {l:"Green",c:"#3a9e68",w:1.5,o:0.85},{l:"Pink",c:"#e06090",w:1.5,o:0.8},
                  ].map(p=>(
                    <button key={p.l} className={`chip${lColor===p.c?" on":""}`}
                      onClick={()=>{setLColor(p.c);setLWidth(p.w);setLOpacity(p.o);}}>
                      <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:p.c,marginRight:4,verticalAlign:"middle",border:"1px solid rgba(255,255,255,0.2)"}}/>
                      {p.l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{height:8}}/>
            </div>

            {/* ── Image Tab ── */}
            <div className={`panel${tab==="image"?"":" off"}`}>
              <div>
                <div className="slabel">Load Image</div>
                <div className={`dzone${dragging?" drag":""}`}
                  onDragOver={e=>{e.preventDefault();setDragging(true);}}
                  onDragLeave={()=>setDragging(false)}
                  onDrop={onDrop}
                  onClick={()=>fileRef.current.click()}>
                  <div className="dicon">{image?"🖼":"⬆"}</div>
                  <div className="dtext">
                    {image?<><strong>Image loaded</strong><br/>Tap to replace</>
                          :<><strong>Drop or tap to browse</strong><br/>JPG · PNG · WEBP · GIF</>}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*"
                  onChange={e=>loadImg(e.target.files[0])} style={{display:"none"}}/>
                {imgMeta&&(
                  <div className="ithumb">
                    <img src={image} alt="ref"/>
                    <div className="ithumb-info">
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"68%"}}>{imgMeta.name}</span>
                      <span>{imgMeta.w}×{imgMeta.h} · <em>{imgMeta.size}kb</em></span>
                    </div>
                  </div>
                )}
                {image&&<button className="btn ghost" onClick={()=>{imgRef.current=null;setImage(null);setImgMeta(null);}}>✕ Remove Image</button>}
              </div>
              <div>
                <div className="slabel">Image Fit Mode</div>
                <div className="ftog">
                  {[{id:"fill",l:"Stretch"},{id:"fit",l:"Fit"},{id:"cover",l:"Cover"}].map(m=>(
                    <button key={m.id} className={`fbtn${fitMode===m.id?" on":""}`}
                      onClick={()=>setFitMode(m.id)}>{m.l}</button>
                  ))}
                </div>
                <div style={{marginTop:7,fontSize:8.5,color:"var(--muted)",lineHeight:1.75,padding:"0 1px"}}>
                  {{
                    fill:"Stretches image to fill entire grid exactly. Aspect ratio changes if grid ratio differs from image.",
                    fit: "Preserves original aspect ratio fully. White space may appear inside grid borders.",
                    cover:"Fills full grid while keeping aspect ratio — edges may be cropped."
                  }[fitMode]}
                </div>
              </div>
              <div style={{height:8}}/>
            </div>

            {/* ── Export Tab ── */}
            <div className={`panel${tab==="export"?"":" off"}`}>
              <div>
                <div className="slabel">File Format</div>
                <div className="chips">
                  {[{id:"png",d:"Lossless · Best for print"},{id:"jpg",d:"Smaller · Web sharing"},{id:"webp",d:"Modern · Smallest size"}].map(f=>(
                    <button key={f.id} className={`chip${eFmt===f.id?" on":""}`}
                      onClick={()=>setEFmt(f.id)} title={f.d}>{f.id.toUpperCase()}</button>
                  ))}
                </div>
                <div style={{marginTop:6,fontSize:8.5,color:"var(--muted)"}}>
                  {{png:"Lossless · Best for printing · Larger file",jpg:"Great for sharing · 92% quality · Smaller",webp:"Modern format · Very small · Excellent quality"}[eFmt]}
                </div>
              </div>
              <div>
                <div className="slabel">Export DPI</div>
                <div className="chips">
                  {[72,96,150,200,300].map(d=>(
                    <button key={d} className={`chip${eDPI===d?" blue-on":""}`} onClick={()=>setEDPI(d)}>{d}</button>
                  ))}
                </div>
                <div style={{marginTop:6,fontSize:8.5,color:"var(--muted)",lineHeight:1.7}}>
                  {eDPI===72&&"Screen only · Not for print"}{eDPI===96&&"Good for web / digital"}{eDPI===150&&"Print ready · Recommended"}{eDPI===200&&"High-quality print"}{eDPI===300&&"Professional · Largest file"}
                </div>
              </div>
              <div className="icard">
                <div className="ir"><span className="k">Output size</span><span className="va">{expA4W} × {expA4H}px</span></div>
                <div className="ir"><span className="k">Grid pixels</span><span className="v">{expGridW} × {expGridH}px</span></div>
                <div className="ir"><span className="k">Cell pixels</span><span className="v">{Math.round(expCellPx)} × {Math.round(expCellPx)}px</span></div>
                <div className="ir"><span className="k">Format</span><span className="va">{eFmt.toUpperCase()} · {eDPI} DPI</span></div>
              </div>
              <div style={{height:8}}/>
            </div>

            {/* Footer */}
            <div className="sbfoot">
              <button className={`btn expbtn${exported?" ok":""}`} onClick={doExport} disabled={exporting}>
                {exporting?"⏳ Preparing…":exported?"✓ Saved!":(`↓ Export ${eFmt.toUpperCase()}`)}
              </button>
              <div className="phint">
                {eDPI} DPI · {eFmt.toUpperCase()} · White margins<br/>
                Print at <strong>100% actual size</strong>
              </div>
            </div>
          </aside>

          {/* ── Preview ── */}
          <main className="main" ref={mainRef}>
            <div className="pvlabel">Print Preview — A4 Sheet</div>
            <div className="couter">
              <div className="rulh">{cols} cols × {cellIn}" = {gridWin.toFixed(2)}"</div>
              <div className="rulv">{rows} rows × {cellIn}" = {gridHin.toFixed(2)}"</div>
              <div className="cwrap">
                <canvas ref={previewRef} width={pvA4W} height={pvA4H}/>
              </div>
            </div>
            <div className="pvfoot">
              <span>{cols} × {rows}</span> cells &nbsp;·&nbsp;
              <span>{cellIn}"</span>/cell &nbsp;·&nbsp;
              margins <span>{mSide}"</span>·<span>{mTop}"</span> &nbsp;·&nbsp;
              <span>{eFmt.toUpperCase()}</span> @ <span>{eDPI}</span> DPI
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
