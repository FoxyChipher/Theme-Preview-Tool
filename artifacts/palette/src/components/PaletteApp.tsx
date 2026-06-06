import { useState, useEffect, useRef, useCallback } from "react";
import {
  allColors, fullOrder, groupsConfig, basePalette, accentColors,
  ColorFormat, formatColor, formatM3Color, getTextColor, getM3TextHex,
  hexToRgb, rgbToHsl,
} from "../palette-data";

const DEMO_TEXT = '!"№@#$;%^:&?*()_+.,<>фывasd | ТЕСТ: читаемость';

function useToast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMsg(text);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 1300);
  }, []);

  return { msg, visible, show };
}

function copyText(text: string, show: (s: string) => void) {
  navigator.clipboard.writeText(text).then(() => show(`Скопировано: ${text}`)).catch(() => show("Ошибка"));
}

interface CarouselProps {
  index: number;
  format: ColorFormat;
  onClose: () => void;
  onNavigate: (delta: number) => void;
  showToast: (s: string) => void;
}

function Carousel({ index, format, onClose, onNavigate, showToast }: CarouselProps) {
  const total = fullOrder.length;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { onNavigate(1); e.preventDefault(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { onNavigate(-1); e.preventDefault(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate]);

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      onNavigate(e.deltaY > 0 ? 1 : -1);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onNavigate]);

  const neighbors = [
    (index - 2 + total) % total,
    (index - 1 + total) % total,
    index,
    (index + 1) % total,
    (index + 2) % total,
  ];

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(6,6,6,0.96)",
        backdropFilter: "blur(14px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 1400, gap: 16, padding: "0 24px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {neighbors.map((idx, pos) => {
          const key = fullOrder[idx];
          const hex = allColors[key];
          const isCenter = pos === 2;
          const adaptive = getTextColor(hex);
          const m3css = getM3TextHex(hex);
          const { r, g, b } = hexToRgb(hex);
          const { h, s } = rgbToHsl(r, g, b);

          const hexVal = formatColor(hex, format);
          const rgbVal = `rgb(${r}, ${g}, ${b})`;
          const hslVal = `hsl(${h}, ${s}%, ${Math.round(((parseInt(hex.slice(1,3),16)*299+parseInt(hex.slice(3,5),16)*587+parseInt(hex.slice(5,7),16)*114)/1000)/255*100)}%)`;
          const m3val = formatM3Color(hex, format);

          if (isCenter) {
            return (
              <div
                key={idx}
                style={{
                  width: 560, minHeight: 480, background: "#0a0a0a",
                  border: "1px solid #3a3a3a",
                  boxShadow: "0 25px 45px rgba(0,0,0,0.7)",
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  transform: "scale(1.02)", margin: "0 20px",
                }}
              >
                <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: hex }}>
                  <div style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: 1, color: adaptive }}>{key}</div>
                  <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6, color: adaptive, fontFamily: "monospace" }}>{hex.toUpperCase()}</div>
                  <div style={{ marginTop: 20, display: "flex", gap: 12, background: "rgba(0,0,0,0.3)", padding: "8px 12px", backdropFilter: "blur(4px)" }}>
                    {([["HEX", hex.toUpperCase()], ["RGB", rgbVal], ["HSL", hslVal]] as [string, string][]).map(([label, val]) => (
                      <span
                        key={label}
                        onClick={() => copyText(val, showToast)}
                        style={{ background: "rgba(10,10,10,0.85)", color: "#c0c0c0", padding: "6px 16px", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "monospace", transition: "all 0.1s" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#000"; }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "rgba(10,10,10,0.85)"; }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#0c0c0c", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid #2a2a2a" }}>
                  <div style={{ padding: "12px 14px", fontSize: 13, lineHeight: 1.45, display: "flex", flexDirection: "column", background: hex }}>
                    <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 5, opacity: 0.7, fontWeight: 600, color: "#060606" }}>SYSTEM DEEP DARK (#060606)</span>
                    <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 12.5, color: "#060606" }}>{DEMO_TEXT}</span>
                  </div>
                  <div style={{ padding: "12px 14px", fontSize: 13, lineHeight: 1.45, display: "flex", flexDirection: "column", background: hex, border: "1px solid rgba(255,255,210,0.2)" }}>
                    <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 5, opacity: 0.7, fontWeight: 600, color: m3css }}>MATERIAL 3 (оттенок, яркость 12%)</span>
                    <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 12.5, color: m3css }}>{DEMO_TEXT}</span>
                  </div>
                  <div style={{ marginTop: 8, background: "#181818", padding: 10, border: "1px solid #262626", display: "flex", flexDirection: "column", gap: 6 }}>
                    {([["Формат:", format.toUpperCase()], ["Цвет акцента:", hexVal], ["Material Text:", m3val], ["HEX оригинал:", hex.toUpperCase()]] as [string, string][]).map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                        <span style={{ color: "#767676" }}>{label}</span>
                        <span
                          style={{ color: "#e6e6e6", cursor: "pointer", fontFamily: "monospace" }}
                          onClick={() => copyText(val, showToast)}
                          onMouseEnter={(e) => { (e.target as HTMLElement).style.textDecoration = "underline"; }}
                          onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = "none"; }}
                        >{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              onClick={() => onNavigate(pos < 2 ? -(2 - pos) : pos - 2)}
              style={{
                width: 120, height: 140, background: hex, color: adaptive,
                opacity: 0.45, filter: "brightness(0.65)", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
                boxShadow: "0 10px 24px rgba(0,0,0,0.6)",
                transition: "transform 0.28s cubic-bezier(0.2,0.85,0.4,1), opacity 0.25s",
              }}
              onMouseEnter={(e) => { const el = e.currentTarget; el.style.opacity = "0.85"; el.style.filter = "brightness(0.92)"; el.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget; el.style.opacity = "0.45"; el.style.filter = "brightness(0.65)"; el.style.transform = "scale(1)"; }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{key}</div>
              <div style={{ fontSize: 9, marginTop: 6, fontFamily: "monospace" }}>{hex}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", color: "#aaa", fontSize: 11, background: "#111111cc", padding: "4px 14px", backdropFilter: "blur(8px)", zIndex: 1100, pointerEvents: "none", fontFamily: "monospace" }}>
        ESC / фон — закрыть  •  ◀  ▶  колесо / стрелки
      </div>
    </div>
  );
}

interface PaletteGridProps {
  format: ColorFormat;
  onSwatchClick: (idx: number) => void;
}

function PaletteGrid({ format, onSwatchClick }: PaletteGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleHeightRef = useRef(0);
  const isScrollingRef = useRef(false);

  const calcCycleHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = Array.from(el.children);
    const oneCycle = children.slice(0, groupsConfig.length * 2);
    let total = 0;
    oneCycle.forEach((child) => {
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      total += rect.height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    });
    cycleHeightRef.current = total;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      calcCycleHeight();
      if (cycleHeightRef.current) window.scrollTo(0, cycleHeightRef.current);
    }, 80);
    return () => clearTimeout(timer);
  }, [calcCycleHeight]);

  useEffect(() => {
    function onScroll() {
      if (isScrollingRef.current) return;
      const ch = cycleHeightRef.current;
      if (!ch) return;
      const top = window.scrollY;
      if (top < ch - 200) {
        isScrollingRef.current = true;
        window.scrollTo(0, top + ch);
        requestAnimationFrame(() => { isScrollingRef.current = false; });
      } else if (top > ch * 2 + 200) {
        isScrollingRef.current = true;
        window.scrollTo(0, top - ch);
        requestAnimationFrame(() => { isScrollingRef.current = false; });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onResize() {
      calcCycleHeight();
      const ch = cycleHeightRef.current;
      const cur = window.scrollY;
      if (ch && (cur > ch * 2 || cur < ch)) window.scrollTo(0, ch);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calcCycleHeight]);

  const renderCycle = (cycleIdx: number) =>
    groupsConfig.map((group) => {
      const bridgeHex = allColors[group.bridgeKey];
      const bridgeTextColor = getTextColor(bridgeHex);
      return (
        <div key={`${cycleIdx}-${group.bridgeKey}`}>
          <div
            style={{ width: "100%", height: 76, margin: "4px 0 0 0", position: "relative", zIndex: 2, cursor: "pointer" }}
            onClick={() => onSwatchClick(fullOrder.indexOf(group.bridgeKey))}
          >
            <div
              style={{
                width: "100%", height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800,
                letterSpacing: "0.8px", backgroundColor: bridgeHex, color: bridgeTextColor,
                clipPath: "polygon(0% 85%, 22% 85%, 22% 15%, 78% 15%, 78% 0%, 100% 0%, 100% 15%, 78% 15%, 78% 85%, 22% 85%, 22% 100%, 0% 100%)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                transition: "filter 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLElement).style.transform = "scaleY(1.01)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>{group.bridgeKey}</div>
              <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.75, marginTop: 3 }}>{formatColor(bridgeHex, format)}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "stretch", background: "#0c0c0c", padding: "12px 8px", border: "1px solid #262626", marginBottom: 2, position: "relative", zIndex: 1 }}>
            {group.rowKeys.map((key) => {
              const hex = allColors[key];
              const textColor = getTextColor(hex);
              return (
                <div
                  key={key}
                  onClick={() => onSwatchClick(fullOrder.indexOf(key))}
                  style={{
                    flex: 1, aspectRatio: "1/1", minWidth: 65, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600,
                    cursor: "pointer", textAlign: "center", padding: "5px 2px",
                    backgroundColor: hex, color: textColor,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    transition: "transform 0.15s cubic-bezier(0.2,0.9,0.4,1.1), box-shadow 0.1s",
                    fontFamily: "monospace",
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = "scale(1.03)"; el.style.boxShadow = "0 0 14px rgba(255,255,220,0.3)"; el.style.zIndex = "10"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = ""; el.style.boxShadow = "0 1px 2px rgba(0,0,0,0.2)"; el.style.zIndex = ""; }}
                >
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{key}</div>
                  <div style={{ fontSize: 8, opacity: 0.75, marginTop: 3 }}>{formatColor(hex, format)}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0, padding: "0 20px 20px" }}
    >
      {[0, 1, 2].map((i) => renderCycle(i))}
    </div>
  );
}

function BaseTable({ showToast }: { showToast: (s: string) => void }) {
  return (
    <div style={{ maxWidth: 1100, margin: "3rem auto 0", padding: "0 20px" }}>
      <h2 style={{ color: "#e6e6e6", borderBottom: "1px solid #363636", paddingBottom: "0.5rem", marginBottom: "1.5rem", fontFamily: "monospace" }}>
        1. Системная монохромная палитра
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#161616", border: "1px solid #363636", fontSize: "0.85rem" }}>
        <thead>
          <tr>
            {["Ключ", "HEX", "Назначение", "Свотч"].map((h) => (
              <th key={h} style={{ padding: "0.7rem 1rem", textAlign: "left", borderBottom: "1px solid #262626", background: "#262626", color: "#f6f6f6", fontWeight: 600, fontFamily: "monospace" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(basePalette).map(([key, item]) => (
            <tr key={key}>
              <td style={{ padding: "0.7rem 1rem", borderBottom: "1px solid #262626", fontFamily: "monospace", color: "#f6f6f6", fontWeight: "bold" }}>"{key}"</td>
              <td style={{ padding: "0.7rem 1rem", borderBottom: "1px solid #262626" }}>
                <span
                  style={{ cursor: "pointer", display: "inline-block", padding: "2px 6px", background: "#262626", border: "1px solid #363636", fontFamily: "monospace", color: "#c6c6c6" }}
                  onClick={() => copyText(item.hex, showToast)}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "#363636"; el.style.color = "#f6f6f6"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "#262626"; el.style.color = "#c6c6c6"; }}
                >{item.hex}</span>
              </td>
              <td style={{ padding: "0.7rem 1rem", borderBottom: "1px solid #262626", color: "#d6d6d6" }}>{item.desc}</td>
              <td style={{ padding: "0.7rem 1rem", borderBottom: "1px solid #262626" }}>
                <span style={{ display: "inline-block", width: 20, height: 20, verticalAlign: "middle", marginRight: "0.6rem", border: "1px solid #464646", background: item.hex }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccentCards({ showToast }: { showToast: (s: string) => void }) {
  const demoText = '!"№@#$;%^:&?*()_+.,<>фывasd';
  return (
    <div style={{ maxWidth: 1100, margin: "3rem auto 2rem", padding: "0 20px" }}>
      <h2 style={{ color: "#e6e6e6", borderBottom: "1px solid #363636", paddingBottom: "0.5rem", marginBottom: "1.5rem", fontFamily: "monospace" }}>
        2. Акцентная палитра — полный спектр 0…z
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
        {Object.entries(accentColors).map(([key, color]) => (
          <div key={key} style={{ background: "#161616", border: "1px solid #363636", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "0.9rem", fontFamily: "monospace", borderBottom: "1px solid #262626", paddingBottom: "0.4rem" }}>
              <span style={{ color: "#f6f6f6", fontWeight: "bold" }}>"{key}"</span>
              <span style={{ flex: 1, textAlign: "center", fontSize: "0.85rem", background: "#262626", padding: "0.1rem 0.5rem", margin: "0 0.5rem", color: color.hex }}>{color.name}</span>
              <span style={{ width: "2rem", visibility: "hidden" }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", padding: "0.5rem", wordBreak: "break-all", fontWeight: 600, background: color.hex, color: "#060606" }}>{demoText}</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", padding: "0.5rem", wordBreak: "break-all", fontWeight: 600, background: color.hex, color: color.onHex, border: "1px solid rgba(0,0,0,0.1)" }}>{demoText}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#060606", padding: 10, border: "1px dashed #363636", marginTop: "0.25rem" }}>
              {[["Акцентный фон:", color.hex.toUpperCase(), color.hex], ["Текст (onAccent):", color.onHex.toUpperCase(), color.onHex]].map(([label, val, swatchColor]) => (
                <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <div style={{ color: "#666666", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "inline-block", width: 18, height: 18, border: "1px solid #464646", background: swatchColor as string, flexShrink: 0 }} />
                    {label as string}
                  </div>
                  <span
                    onClick={() => copyText(val as string, showToast)}
                    style={{ color: "#c6c6c6", cursor: "pointer", padding: "2px 8px", background: "#161616", border: "1px solid #262626", fontFamily: "monospace", transition: "all 0.1s", fontSize: "0.75rem" }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "#666666"; el.style.color = "#f6f6f6"; el.style.background = "#262626"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "#262626"; el.style.color = "#c6c6c6"; el.style.background = "#161616"; }}
                  >{val as string}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaletteApp() {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [carouselIdx, setCarouselIdx] = useState<number | null>(null);
  const { msg, visible, show } = useToast();

  const openCarousel = (idx: number) => {
    setCarouselIdx(idx);
    document.body.style.overflow = "hidden";
  };

  const closeCarousel = () => {
    setCarouselIdx(null);
    document.body.style.overflow = "";
  };

  const navigate = useCallback((delta: number) => {
    setCarouselIdx((prev) => prev === null ? 0 : (prev + delta + fullOrder.length) % fullOrder.length);
  }, []);

  return (
    <div style={{ background: "#060606", color: "#d6d6d6", minHeight: "100vh", fontFamily: "'SF Mono','Fira Code',monospace", overflowX: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#f6f6f6", fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.05em" }}>Theme Preview</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              style={{
                background: format === f ? "#363636" : "#161616",
                color: format === f ? "#f6f6f6" : "#a6a6a6",
                border: `1px solid ${format === f ? "#868686" : "#363636"}`,
                padding: "6px 12px", cursor: "pointer",
                fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 11,
                transition: "all 0.15s ease", textTransform: "uppercase",
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      <PaletteGrid format={format} onSwatchClick={openCarousel} />

      <BaseTable showToast={show} />
      <AccentCards showToast={show} />

      {carouselIdx !== null && (
        <Carousel
          index={carouselIdx}
          format={format}
          onClose={closeCarousel}
          onNavigate={navigate}
          showToast={show}
        />
      )}

      <div
        style={{
          position: "fixed", bottom: 20, right: 20,
          background: "#464646", color: "#f6f6f6",
          padding: "8px 16px", border: "1px solid #666666",
          fontSize: "0.8rem", fontFamily: "monospace",
          opacity: visible ? 1 : 0, pointerEvents: "none",
          transition: "opacity 0.15s", zIndex: 2000,
        }}
      >
        {msg}
      </div>
    </div>
  );
}
