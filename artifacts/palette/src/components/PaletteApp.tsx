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

// ─── Карусель ────────────────────────────────────────────────────────────────

interface CarouselProps {
  index: number;
  format: ColorFormat;
  onClose: () => void;
  onNavigate: (delta: number) => void;
  showToast: (s: string) => void;
}

function Carousel({ index, format: initialFormat, onClose, onNavigate, showToast }: CarouselProps) {
  const [localFormat, setLocalFormat] = useState<ColorFormat>(initialFormat);
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
      style={{ position: "fixed", inset: 0, background: "rgba(6,6,6,0.96)", backdropFilter: "blur(14px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 1400, gap: 16, padding: "0 24px" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {neighbors.map((idx, pos) => {
          const key = fullOrder[idx];
          const hex = allColors[key];
          const isCenter = pos === 2;
          const adaptive = getTextColor(hex);
          const m3css = getM3TextHex(hex);
          const { r, g, b } = hexToRgb(hex);
          const { h, s, l } = rgbToHsl(r, g, b);
          const accentVal = formatColor(hex, localFormat);
          const m3val = formatM3Color(hex, localFormat);

          if (isCenter) {
            return (
              <div
                key={idx}
                style={{ width: 560, minHeight: 460, background: "#0a0a0a", border: "1px solid #3a3a3a", boxShadow: "0 25px 45px rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", overflow: "hidden", transform: "scale(1.02)", margin: "0 20px" }}
              >
                {/* ── Герой ── */}
                <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: hex }}>
                  <div style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: 1, color: adaptive }}>{key}</div>
                  <div style={{ fontSize: 13, marginTop: 8, color: adaptive, fontFamily: "monospace", fontWeight: 600 }}>{accentVal}</div>

                  {/* ── Кнопки переключения формата ── */}
                  <div style={{ marginTop: 16, display: "flex", gap: 6, background: "rgba(0,0,0,0.35)", padding: "6px 10px", backdropFilter: "blur(4px)" }}>
                    {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
                      <span
                        key={f}
                        onClick={(e) => { e.stopPropagation(); setLocalFormat(f); }}
                        style={{
                          background: localFormat === f ? "rgba(255,255,255,0.18)" : "rgba(10,10,10,0.7)",
                          color: localFormat === f ? "#ffffff" : "#a0a0a0",
                          border: localFormat === f ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
                          padding: "5px 14px", cursor: "pointer", fontSize: 10,
                          fontWeight: 700, fontFamily: "monospace", textTransform: "uppercase",
                          transition: "all 0.12s",
                        }}
                      >{f}</span>
                    ))}
                  </div>
                </div>

                {/* ── Тест читаемости ── */}
                <div style={{ background: "#0c0c0c", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #2a2a2a" }}>
                  <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", background: hex }}>
                    <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 4, opacity: 0.7, fontWeight: 600, color: "#060606" }}>SYSTEM DEEP DARK (#060606)</span>
                    <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 12, color: "#060606" }}>{DEMO_TEXT}</span>
                  </div>
                  <div style={{ padding: "11px 13px", display: "flex", flexDirection: "column", background: hex, border: "1px solid rgba(255,255,210,0.2)" }}>
                    <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 4, opacity: 0.7, fontWeight: 600, color: m3css }}>MATERIAL 3 (яркость 12%)</span>
                    <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: 12, color: m3css }}>{DEMO_TEXT}</span>
                  </div>

                  {/* ── Значения для копирования ── */}
                  <div style={{ background: "#181818", padding: "10px 12px", border: "1px solid #262626", display: "flex", flexDirection: "column", gap: 6 }}>
                    {([["Акцент:", accentVal], ["Material Text:", m3val]] as [string, string][]).map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                        <span style={{ color: "#666666" }}>{label}</span>
                        <span
                          style={{ color: "#e6e6e6", cursor: "pointer", fontFamily: "monospace", padding: "1px 4px" }}
                          onClick={() => copyText(val, showToast)}
                          title="Нажмите чтобы скопировать"
                          onMouseEnter={(e) => { const el = e.currentTarget; el.style.textDecoration = "underline"; el.style.color = "#ffffff"; }}
                          onMouseLeave={(e) => { const el = e.currentTarget; el.style.textDecoration = "none"; el.style.color = "#e6e6e6"; }}
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
              style={{ width: 120, height: 140, background: hex, color: adaptive, opacity: 0.45, filter: "brightness(0.65)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 24px rgba(0,0,0,0.6)", transition: "transform 0.28s cubic-bezier(0.2,0.85,0.4,1), opacity 0.25s" }}
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

// ─── Вкладка 1: Палитра (лейаут из файла 2) ──────────────────────────────────

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
    const oneCycle = children.slice(0, groupsConfig.length);
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
          <div style={{ width: "100%", height: 76, margin: "4px 0 0 0", position: "relative", zIndex: 2, cursor: "pointer" }} onClick={() => onSwatchClick(fullOrder.indexOf(group.bridgeKey))}>
            <div
              style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, letterSpacing: "0.8px", backgroundColor: bridgeHex, color: bridgeTextColor, clipPath: "polygon(0% 85%, 22% 85%, 22% 15%, 78% 15%, 78% 0%, 100% 0%, 100% 15%, 78% 15%, 78% 85%, 22% 85%, 22% 100%, 0% 100%)", boxShadow: "0 2px 6px rgba(0,0,0,0.4)", transition: "filter 0.2s, transform 0.1s" }}
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
                  style={{ flex: 1, aspectRatio: "1/1", minWidth: 65, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, cursor: "pointer", textAlign: "center", padding: "5px 2px", backgroundColor: hex, color: textColor, boxShadow: "0 1px 2px rgba(0,0,0,0.2)", transition: "transform 0.15s cubic-bezier(0.2,0.9,0.4,1.1), box-shadow 0.1s", fontFamily: "monospace" }}
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
    <div ref={containerRef} style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0, padding: "0 20px 20px" }}>
      {[0, 1, 2].map((i) => renderCycle(i))}
    </div>
  );
}

// ─── Вкладка 2: Base palette ──────────────────────────────────────────────────

function BaseTab({ showToast }: { showToast: (s: string) => void }) {
  const entries = Object.entries(basePalette);
  const gradient = entries.map(([, v]) => v.hex).join(", ");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 40px" }}>
      <div style={{ height: 56, background: `linear-gradient(to right, ${gradient})`, marginBottom: 32, border: "1px solid #262626" }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 2 }}>
        {entries.map(([key, item]) => {
          const luminance = parseInt(item.hex.slice(1, 3), 16);
          const textColor = luminance > 120 ? "#060606" : "#f6f6f6";
          const subColor = luminance > 120 ? "#26262680" : "#f6f6f640";
          return (
            <div
              key={key}
              style={{ background: item.hex, padding: "18px 14px", cursor: "pointer", position: "relative", minHeight: 110, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.1s" }}
              onClick={() => copyText(item.hex, showToast)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.zIndex = "5"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.zIndex = ""; }}
            >
              <div>
                <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 22, color: textColor, letterSpacing: "0.05em" }}>base-{key}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: textColor, opacity: 0.7, marginTop: 4 }}>{item.desc}</div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: textColor, borderTop: `1px solid ${subColor}`, paddingTop: 8, marginTop: 8 }}>{item.hex}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 40, background: "#161616", border: "1px solid #262626", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", background: "#262626", fontFamily: "monospace", fontSize: 11, color: "#a6a6a6", letterSpacing: "0.08em" }}>ПРИМЕР КОНТЕКСТА</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          {[
            { bg: "#161616", border: "#363636", text: "#d6d6d6", label: "Карточка" },
            { bg: "#262626", border: "#363636", text: "#b6b6b6", label: "Статусбар" },
            { bg: "#060606", border: "#262626", text: "#666666", label: "# комментарий" },
            { bg: "#464646", border: "#565656", text: "#e6e6e6", label: "Выделение" },
          ].map(({ bg, border, text, label }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, padding: "14px 16px", fontFamily: "monospace", fontSize: 12, color: text }}>
              <div style={{ fontSize: 9, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
              <div>Пример текста и UI-элементов</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 2, background: "#161616", border: "1px solid #262626", padding: "16px" }}>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#666666", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Шкала яркости</div>
        <div style={{ display: "flex", height: 32, gap: 1 }}>
          {entries.map(([key, item]) => (
            <div
              key={key}
              style={{ flex: 1, background: item.hex, cursor: "pointer" }}
              title={`base-${key}: ${item.hex}`}
              onClick={() => copyText(item.hex, showToast)}
            />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 4 }}>
          {entries.map(([key]) => (
            <div key={key} style={{ flex: 1, textAlign: "center", fontFamily: "monospace", fontSize: 8, color: "#565656" }}>{key}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Вкладка 3: Акцентные карточки (из файла 3) ───────────────────────────────

function NameBadges({ name, accentHex, onHex }: { name: string; accentHex: string; onHex: string }) {
  const [ru, en] = name.split(" / ");
  const badge = (text: string) => (
    <span key={text} style={{
      display: "inline-block",
      background: onHex,
      color: accentHex,
      fontSize: "0.7rem",
      fontWeight: 700,
      fontFamily: "sans-serif",
      padding: "2px 7px",
      lineHeight: 1.5,
      whiteSpace: "nowrap",
    }}>{text}</span>
  );
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      {ru && badge(ru)}
      {en && badge(en)}
    </div>
  );
}

function AccentTab({ showToast }: { showToast: (s: string) => void }) {
  const demoText = '!"№@#$;%^:&?*()_+.,<>фывasd';
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {Object.entries(accentColors).map(([key, color]) => (
          <div key={key} style={{ background: "#161616", border: "1px solid #363636", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid #262626", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ color: "#f6f6f6", fontWeight: "bold", fontSize: "0.9rem", fontFamily: "monospace" }}>"{key}"</span>
              <NameBadges name={color.name} accentHex={color.hex} onHex={color.onHex} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", padding: "0.5rem", wordBreak: "break-all", fontWeight: 600, background: color.hex, color: "#060606" }}>
              <div style={{ fontSize: "0.62rem", opacity: 0.55, marginBottom: 4 }}>base-0 / #060606</div>
              {demoText}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", padding: "0.5rem", wordBreak: "break-all", fontWeight: 600, background: color.hex, color: color.onHex }}>
              <div style={{ marginBottom: 4 }}>
                <NameBadges name={color.onName} accentHex={color.hex} onHex={color.onHex} />
              </div>
              {demoText}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, background: "#060606", padding: 8, border: "1px dashed #363636" }}>
              {([["accent:", color.hex.toUpperCase(), color.hex], ["onAccent:", color.onHex.toUpperCase(), color.onHex]] as [string, string, string][]).map(([label, val, sw]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem" }}>
                  <div style={{ color: "#666666", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", width: 14, height: 14, border: "1px solid #464646", background: sw, flexShrink: 0 }} />
                    {label}
                  </div>
                  <span
                    onClick={() => copyText(val, showToast)}
                    style={{ color: "#c6c6c6", cursor: "pointer", padding: "2px 6px", background: "#161616", border: "1px solid #262626", fontFamily: "monospace", fontSize: "0.72rem" }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.borderColor = "#666"; el.style.color = "#f6f6f6"; el.style.background = "#262626"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.borderColor = "#262626"; el.style.color = "#c6c6c6"; el.style.background = "#161616"; }}
                  >{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Шапка ───────────────────────────────────────────────────────────────────

type Tab = "palette" | "base" | "accent";

interface HeaderProps {
  activeTab: Tab;
  onTab: (t: Tab) => void;
  format: ColorFormat;
  onFormat: (f: ColorFormat) => void;
  showFormat: boolean;
}

function Header({ activeTab, onTab, format, onFormat, showFormat }: HeaderProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "palette", label: "Акцент" },
    { id: "base",    label: "Base 0–f" },
    { id: "accent",  label: "Карточки" },
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "#0a0a0a", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 44 }}>
      <div style={{ display: "flex", gap: 0 }}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTab(id)}
            style={{ background: activeTab === id ? "#262626" : "transparent", color: activeTab === id ? "#f6f6f6" : "#666666", border: "none", borderBottom: activeTab === id ? "2px solid #a6a6a6" : "2px solid transparent", padding: "0 18px", height: 44, cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: activeTab === id ? 700 : 400, letterSpacing: "0.05em", transition: "all 0.15s" }}
          >{label}</button>
        ))}
      </div>
      {showFormat && (
        <div style={{ display: "flex", gap: 6 }}>
          {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => onFormat(f)}
              style={{ background: format === f ? "#363636" : "#161616", color: format === f ? "#f6f6f6" : "#666666", border: `1px solid ${format === f ? "#868686" : "#363636"}`, padding: "4px 10px", cursor: "pointer", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", transition: "all 0.15s" }}
            >{f}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Корневой компонент ───────────────────────────────────────────────────────

export default function PaletteApp() {
  const [tab, setTab] = useState<Tab>("palette");
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

  const handleTab = (t: Tab) => {
    setTab(t);
    if (t !== "palette") window.scrollTo(0, 0);
  };

  return (
    <div style={{ background: "#060606", color: "#d6d6d6", minHeight: "100vh", fontFamily: "'SF Mono','Fira Code',monospace", overflowX: "hidden" }}>
      <Header activeTab={tab} onTab={handleTab} format={format} onFormat={setFormat} showFormat={tab === "palette"} />

      {tab === "palette" && <PaletteGrid format={format} onSwatchClick={openCarousel} />}
      {tab === "base"    && <div style={{ paddingTop: 44 }}><BaseTab showToast={show} /></div>}
      {tab === "accent"  && <div style={{ paddingTop: 44 }}><AccentTab showToast={show} /></div>}

      {carouselIdx !== null && (
        <Carousel index={carouselIdx} format={format} onClose={closeCarousel} onNavigate={navigate} showToast={show} />
      )}

      <div style={{ position: "fixed", bottom: 20, right: 20, background: "#464646", color: "#f6f6f6", padding: "8px 16px", border: "1px solid #666666", fontSize: "0.8rem", fontFamily: "monospace", opacity: visible ? 1 : 0, pointerEvents: "none", transition: "opacity 0.15s", zIndex: 2000 }}>
        {msg}
      </div>
    </div>
  );
}
