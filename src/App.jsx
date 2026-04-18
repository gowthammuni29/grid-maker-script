import { useState, useRef, useEffect, useCallback } from "react";

const A4_W_IN = 8.27;
const A4_H_IN = 11.69;
const EXPORT_DPI = 150;
const A4_W_PX = Math.round(A4_W_IN * EXPORT_DPI);
const A4_H_PX = Math.round(A4_H_IN * EXPORT_DPI);
const DEFAULT_COLS = 8;
const DEFAULT_ROWS = 9;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080b12;
    --surface: rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14);
    --gold: #c9a84c;
    --gold2: #e8cc7a;
    --text: #f0ebe2;
    --muted: #7a7060;
    --dim: #3a3428;
    --red: #d94f3a;
    --green: #2e7d52;
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  .app {
    height: 100%;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 20% 0%, rgba(201,168,76,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(100,80,200,0.05) 0%, transparent 50%);
    font-family: 'DM Mono', monospace;
    color: var(--text);
    display: flex;
    flex-direction: column;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 24px;
    height: 58px;
    border-bottom: 1px solid var(--border);
    background: rgba(8,11,18,0.95);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
    position: relative;
    z-index: 20;
  }
  .header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: 0.35;
  }
  .logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    box-shadow: 0 0 18px rgba(201,168,76,0.28);
    flex-shrink: 0;
  }
  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--gold2), var(--text));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .header-sub {
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 1px;
  }
  .header-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .header-badge {
    padding: 4px 10px;
    border: 1px solid rgba(201,168,76,0.22);
    border-radius: 20px;
    font-size: 9px;
    color: var(--gold);
    letter-spacing: 2px;
    background: rgba(201,168,76,0.05);
    white-space: nowrap;
  }

  /* Install banner */
  .install-banner {
    background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06));
    border-bottom: 1px solid rgba(201,168,76,0.2);
    padding: 10px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 11px;
    color: var(--text);
    flex-shrink: 0;
    z-index: 10;
  }
  .install-banner .ib-icon { font-size: 18px; }
  .install-banner .ib-text { flex: 1; line-height: 1.5; }
  .install-banner .ib-text strong { color: var(--gold); font-weight: 500; }
  .install-banner .ib-text span { color: var(--muted); font-size: 10px; }
  .btn-install {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #080b12;
    border: none;
    border-radius: 8px;
    padding: 7px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .btn-dismiss {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 16px;
    padding: 2px 6px;
    flex-shrink: 0;
  }

  /* iOS install hint */
  .ios-hint {
    background: rgba(201,168,76,0.06);
    border-bottom: 1px solid rgba(201,168,76,0.15);
    padding: 10px 24px;
    font-size: 10px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .ios-hint strong { color: var(--gold); }

  /* ── Layout ── */
  .body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 272px;
    flex-shrink: 0;
    background: rgba(10,12,18,0.98);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .sidebar-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 22px 18px 0;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .sidebar-scroll::-webkit-scrollbar { width: 13px; }
  .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }

  .section-label {
    font-size: 9px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border2), transparent);
  }

  .field-label {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 5px;
  }

  .input-row { display: flex; gap: 8px; }

  .num-wrap { flex: 1; }
  .num-wrap input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    padding: 8px 10px;
    font-size: 14px;
    font-family: 'DM Mono', monospace;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .num-wrap input:focus {
    border-color: var(--gold);
    background: var(--surface2);
  }

  .info-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 13px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
  }
  .info-row .k { color: var(--muted); }
  .info-row .v { color: var(--text); }
  .info-row .v.accent { color: var(--gold); font-weight: 500; }

  .color-row { display: flex; gap: 8px; align-items: flex-end; margin-bottom: 12px; }
  .color-wrap { flex: 1; }
  .color-wrap input[type="color"] {
    width: 100%; height: 36px;
    border: 1px solid var(--border); border-radius: 8px;
    background: var(--surface); cursor: pointer; padding: 3px;
  }

  .slider-wrap { margin-bottom: 2px; }
  .slider-wrap input[type="range"] {
    width: 100%; accent-color: var(--gold); cursor: pointer;
  }

  .drop-zone {
    border: 1.5px dashed var(--border2);
    border-radius: 12px;
    padding: 18px 14px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--surface);
  }
  .drop-zone:hover, .drop-zone.drag-active {
    border-color: var(--gold);
    background: rgba(201,168,76,0.05);
  }
  .drop-icon { font-size: 26px; margin-bottom: 6px; opacity: 0.55; }
  .drop-text { font-size: 10px; color: var(--muted); letter-spacing: 1px; line-height: 1.7; }
  .drop-text strong { color: var(--gold); font-weight: 400; }

  .btn {
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-ghost {
    background: var(--surface);
    color: var(--muted);
    border: 1px solid var(--border);
    margin-top: 8px;
  }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); border-color: var(--border2); }

  .divider { height: 1px; background: var(--border); margin: 0 -18px; }

  /* Sidebar footer */
  .sidebar-footer {
    padding: 16px 18px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 9px;
    flex-shrink: 0;
  }
  .btn-export {
    background: linear-gradient(135deg, #c9a84c, #e8cc7a);
    color: #080b12;
    font-weight: 600;
    font-size: 11px;
    box-shadow: 0 4px 18px rgba(201,168,76,0.22);
    padding: 12px 14px;
  }
  .btn-export:hover {
    box-shadow: 0 6px 26px rgba(201,168,76,0.38);
    transform: translateY(-1px);
  }
  .btn-export.success {
    background: linear-gradient(135deg, #2e7d52, #42b872);
    box-shadow: 0 4px 18px rgba(66,184,114,0.28);
  }
  .print-hint {
    font-size: 9px;
    color: var(--muted);
    text-align: center;
    line-height: 1.9;
    letter-spacing: 1px;
  }
  .print-hint strong { color: var(--gold); font-weight: 400; }

  /* ── Main ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    overflow: auto;
    position: relative;
    gap: 16px;
  }
  .main::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  .preview-label {
    font-size: 9px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--muted);
    position: relative; z-index: 1;
  }

  .canvas-wrap {
    position: relative; z-index: 1;
    border-radius: 3px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06),
      0 20px 55px rgba(0,0,0,0.7),
      0 4px 14px rgba(0,0,0,0.5);
    transition: box-shadow 0.3s;
    max-width: 100%;
  }
  .canvas-wrap:hover {
    box-shadow:
      0 0 0 1px rgba(201,168,76,0.14),
      0 22px 60px rgba(0,0,0,0.75),
      0 4px 18px rgba(0,0,0,0.5);
  }
  .canvas-wrap canvas { display: block; max-width: 100%; height: auto; }

  .preview-footer {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 2px;
    text-align: center;
    position: relative; z-index: 1;
    line-height: 1.9;
  }
  .preview-footer span { color: var(--gold); }

  .warn {
    font-size: 10px;
    color: var(--red);
    background: rgba(217,79,58,0.08);
    border: 1px solid rgba(217,79,58,0.18);
    border-radius: 6px;
    padding: 8px 10px;
    margin-top: 8px;
    letter-spacing: 1px;
    line-height: 1.6;
  }

  /* iPad responsive */
  @media (max-width: 768px) {
    .sidebar { width: 230px; }
    .header-sub { display: none; }
    .main { padding: 20px 16px; }
  }
  @media (max-width: 600px) {
    .body { flex-direction: column; }
    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    .sidebar-scroll { padding: 14px 14px 0; }
    .main { padding: 16px; gap: 12px; }
  }
`;

export default function GridMaker() {
  const [image, setImage] = useState(null);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [lineColor, setLineColor] = useState("#c9a84c");
  const [lineWidth, setLineWidth] = useState(1.5);
  const [lineOpacity, setLineOpacity] = useState(0.85);
  const [dragging, setDragging] = useState(false);
  const [exported, setExported] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Dynamic preview scale based on container
  const [previewScale, setPreviewScale] = useState(0.38);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth - 64;
        const h = containerRef.current.clientHeight - 100;
        const scaleW = w / A4_W_PX;
        const scaleH = h / A4_H_PX;
        setPreviewScale(Math.min(scaleW, scaleH, 0.42));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const previewA4W = Math.round(A4_W_PX * previewScale);
  const previewA4H = Math.round(A4_H_PX * previewScale);

  // PWA install logic
  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setIsIOS(ios);
    setIsInstalled(standalone);

    if (ios && !standalone) setShowIOSHint(true);

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
    });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const getRGB = useCallback(() => {
    const hex = lineColor;
    return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  }, [lineColor]);

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, previewA4W, previewA4H);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, previewA4W, previewA4H);

    const cellPx = Math.round(EXPORT_DPI * previewScale);
    const gridWpx = cols * cellPx;
    const gridHpx = rows * cellPx;
    const offsetX = Math.round((previewA4W - gridWpx) / 2);
    const offsetY = Math.round((previewA4H - gridHpx) / 2);

    if (imgRef.current) {
      ctx.drawImage(imgRef.current, offsetX, offsetY, gridWpx, gridHpx);
    } else {
      ctx.fillStyle = "#f8f4ef";
      ctx.fillRect(offsetX, offsetY, gridWpx, gridHpx);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = "#f0ebe3";
            ctx.fillRect(offsetX + c * cellPx, offsetY + r * cellPx, cellPx, cellPx);
          }
        }
      }
      ctx.fillStyle = "#c8b898";
      ctx.font = `${Math.max(8, cellPx * 0.2)}px Georgia, serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Drop or tap to load image", offsetX + gridWpx / 2, offsetY + gridHpx / 2 - cellPx * 0.15);
      ctx.font = `italic ${Math.max(7, cellPx * 0.14)}px Georgia, serif`;
      ctx.fillStyle = "#d8c8a8";
      ctx.fillText(`${cols} × ${rows} grid · 1 inch per cell`, offsetX + gridWpx / 2, offsetY + gridHpx / 2 + cellPx * 0.2);
    }

    const [r2, g2, b2] = getRGB();
    ctx.strokeStyle = `rgba(${r2},${g2},${b2},${lineOpacity})`;
    ctx.lineWidth = lineWidth * previewScale;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + c * cellPx, offsetY);
      ctx.lineTo(offsetX + c * cellPx, offsetY + gridHpx);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + r * cellPx);
      ctx.lineTo(offsetX + gridWpx, offsetY + r * cellPx);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(180,160,120,0.1)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 5]);
    ctx.strokeRect(offsetX, offsetY, gridWpx, gridHpx);
    ctx.setLineDash([]);
  }, [image, cols, rows, lineColor, lineWidth, lineOpacity, previewA4W, previewA4H, previewScale, getRGB]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const loadImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { imgRef.current = img; setImage(e.target.result); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    loadImage(e.dataTransfer.files[0]);
  };

  const exportPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = A4_W_PX; canvas.height = A4_H_PX;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, A4_W_PX, A4_H_PX);

    const cellPx = EXPORT_DPI;
    const gridWpx = cols * cellPx;
    const gridHpx = rows * cellPx;
    const offsetX = Math.round((A4_W_PX - gridWpx) / 2);
    const offsetY = Math.round((A4_H_PX - gridHpx) / 2);

    if (imgRef.current) ctx.drawImage(imgRef.current, offsetX, offsetY, gridWpx, gridHpx);

    const [r2, g2, b2] = getRGB();
    ctx.strokeStyle = `rgba(${r2},${g2},${b2},${lineOpacity})`;
    ctx.lineWidth = lineWidth;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath(); ctx.moveTo(offsetX + c * cellPx, offsetY);
      ctx.lineTo(offsetX + c * cellPx, offsetY + gridHpx); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath(); ctx.moveTo(offsetX, offsetY + r * cellPx);
      ctx.lineTo(offsetX + gridWpx, offsetY + r * cellPx); ctx.stroke();
    }

    const link = document.createElement("a");
    link.download = `grid-${cols}x${rows}-A4-print.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const marginSide = ((A4_W_IN - cols) / 2).toFixed(2);
  const marginTopVal = ((A4_H_IN - rows) / 2).toFixed(2);
  const gridTooBig = cols > Math.floor(A4_W_IN) || rows > Math.floor(A4_H_IN);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="logo-mark">⊞</div>
          <div>
            <div className="header-title">Grid Maker</div>
            <div className="header-sub">A4 · 1 inch per cell · Print Ready</div>
          </div>
          <div className="header-right">
            {!isInstalled && <div className="header-badge">Install as App</div>}
            {isInstalled && <div className="header-badge" style={{color:"#42b872",borderColor:"rgba(66,184,114,0.3)"}}>✓ Installed</div>}
          </div>
        </header>

        {/* Install banner - Chrome/Android */}
        {showInstallBanner && !isInstalled && (
          <div className="install-banner">
            <div className="ib-icon">📲</div>
            <div className="ib-text">
              <strong>Install Grid Maker as an app</strong><br />
              <span>Works offline · No browser bar · Opens instantly</span>
            </div>
            <button className="btn-install" onClick={handleInstall}>Install</button>
            <button className="btn-dismiss" onClick={() => setShowInstallBanner(false)}>✕</button>
          </div>
        )}

        {/* iOS Safari hint */}
        {isIOS && showIOSHint && !isInstalled && (
          <div className="ios-hint">
            <span>📤</span>
            <span>To install: tap <strong>Share</strong> → <strong>"Add to Home Screen"</strong> to use offline like an app</span>
            <button className="btn-dismiss" onClick={() => setShowIOSHint(false)}>✕</button>
          </div>
        )}

        <div className="body">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-scroll">

              {/* Grid Size */}
              <div>
                <div className="section-label">Grid Size</div>
                <div className="input-row">
                  <div className="num-wrap">
                    <div className="field-label">Columns</div>
                    <input type="number" value={cols} min={1} max={20}
                      onChange={e => setCols(Number(e.target.value))} />
                  </div>
                  <div className="num-wrap">
                    <div className="field-label">Rows</div>
                    <input type="number" value={rows} min={1} max={26}
                      onChange={e => setRows(Number(e.target.value))} />
                  </div>
                </div>
                {gridTooBig && <div className="warn">⚠ Grid exceeds A4. Max 8 cols / 11 rows for 1-inch cells.</div>}
                <div className="info-card">
                  <div className="info-row"><span className="k">Grid area</span><span className="v">{cols}" × {rows}"</span></div>
                  <div className="info-row"><span className="k">A4 sheet</span><span className="v">{A4_W_IN}" × {A4_H_IN}"</span></div>
                  <div className="info-row"><span className="k">Side margins</span><span className="v accent">{marginSide}" each</span></div>
                  <div className="info-row"><span className="k">Top / Bottom</span><span className="v accent">{marginTopVal}" each</span></div>
                  <div className="info-row"><span className="k">Export size</span><span className="v">{A4_W_PX} × {A4_H_PX}px</span></div>
                </div>
              </div>

              <div className="divider" />

              {/* Grid Lines */}
              <div>
                <div className="section-label">Grid Lines</div>
                <div className="color-row">
                  <div className="color-wrap">
                    <div className="field-label">Color</div>
                    <input type="color" value={lineColor} onChange={e => setLineColor(e.target.value)} />
                  </div>
                  <div className="num-wrap">
                    <div className="field-label">Width px</div>
                    <input type="number" value={lineWidth} min={0.5} max={6} step={0.5}
                      onChange={e => setLineWidth(Number(e.target.value))} />
                  </div>
                </div>
                <div className="slider-wrap">
                  <div className="field-label">Opacity — {Math.round(lineOpacity * 100)}%</div>
                  <input type="range" value={lineOpacity} min={0.1} max={1} step={0.05}
                    onChange={e => setLineOpacity(Number(e.target.value))} />
                </div>
              </div>

              <div className="divider" />

              {/* Image */}
              <div>
                <div className="section-label">Reference Image</div>
                <div
                  className={`drop-zone${dragging ? " drag-active" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="drop-icon">{image ? "🖼" : "⬆"}</div>
                  <div className="drop-text">
                    {image
                      ? <><strong>Image loaded</strong><br />Tap to replace</>
                      : <><strong>Drop or tap to browse</strong><br />JPG, PNG, WEBP</>
                    }
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*"
                  onChange={e => loadImage(e.target.files[0])} style={{ display: "none" }} />
                {image && (
                  <button className="btn btn-ghost"
                    onClick={() => { imgRef.current = null; setImage(null); }}>
                    ✕ Remove Image
                  </button>
                )}
              </div>

              <div style={{ height: 8 }} />
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
              <button className={`btn btn-export${exported ? " success" : ""}`} onClick={exportPNG}>
                {exported ? "✓ Exported!" : "↓ Export A4 PNG"}
              </button>
              <div className="print-hint">
                150 DPI · White margins · Centered<br />
                Print at <strong>100% actual size</strong>
              </div>
            </div>
          </aside>

          {/* Preview */}
          <main className="main" ref={containerRef}>
            <div className="preview-label">Print Preview — A4 Sheet</div>
            <div className="canvas-wrap">
              <canvas ref={previewRef} width={previewA4W} height={previewA4H} />
            </div>
            <div className="preview-footer">
              <span>{cols} × {rows}</span> grid &nbsp;·&nbsp;
              each cell = <span>1 inch</span> &nbsp;·&nbsp;
              margins <span>{marginSide}"</span> · <span>{marginTopVal}"</span>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
