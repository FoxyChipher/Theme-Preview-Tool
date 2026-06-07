
export const basePalette: Record<string, { hex: string; desc: string }> = {
  "0": { hex: "#060606", desc: "фон окна, пустота за стеклом" },
  "1": { hex: "#161616", desc: "фон кнопок" },
  "2": { hex: "#262626", desc: "панельки, статусбары" },
  "3": { hex: "#363636", desc: "неактивные границы окон" },
  "4": { hex: "#464646", desc: "фон выделенного текста" },
  "5": { hex: "#565656", desc: "подсветка текущей строки" },
  "6": { hex: "#666666", desc: "комментарии" },
  "7": { hex: "#767676", desc: "разделители" },
  "8": { hex: "#868686", desc: "отступы" },
  "9": { hex: "#969696", desc: "иконки / неактивные вкладки" },
  "a": { hex: "#a6a6a6", desc: "второстепенная информация (размер файлов, дата)" },
  "b": { hex: "#b6b6b6", desc: "текст статусбара" },
  "c": { hex: "#c6c6c6", desc: "почти-основной текст" },
  "d": { hex: "#d6d6d6", desc: "основной текст" },
  "e": { hex: "#e6e6e6", desc: "выделенный текст" },
  "f": { hex: "#f6f6f6", desc: "чистый свет — заголовки" },
};

export interface AccentColor {
  hex: string;
  name: string;
  onHex: string;
  onName: string;
}

export const accentColors: Record<string, AccentColor> = {
  "0":  { hex: "#f69696", name: "Светло-коралловый / Light Coral",        onHex: "#660606", onName: "Глубокий бордовый / Deep Maroon" },
  "1":  { hex: "#f6a696", name: "Лососевый / Salmon",                     onHex: "#661606", onName: "Темно-бордовый / Dark Burgundy" },
  "2":  { hex: "#f6b696", name: "Темно-персиковый / Deep Peach",          onHex: "#662606", onName: "Насыщенный каштановый / Rich Maroon" },
  "3":  { hex: "#f6c696", name: "Пастельно-оранжевый / Pastel Orange",    onHex: "#663606", onName: "Темно-карамельный / Dark Amber" },
  "4":  { hex: "#f6d696", name: "Навахо / Navajo White",                  onHex: "#664606", onName: "Оливково-коричневый / Olive Brown" },
  "5":  { hex: "#f6e696", name: "Светло-хаки / Light Khaki",              onHex: "#665606", onName: "Темный хаки / Dark Khaki" },
  "6":  { hex: "#f6f696", name: "Светло-желтый / Light Yellow",           onHex: "#666606", onName: "Темно-оливковый / Dark Olive" },
  "7":  { hex: "#e6f696", name: "Желто-зеленый / Green-Yellow",           onHex: "#566606", onName: "Защитный зеленый / Army Green" },
  "8":  { hex: "#d6f696", name: "Сияющий лайм / Mindaro",                onHex: "#466606", onName: "Болотный / Swamp Green" },
  "9":  { hex: "#c6f696", name: "Ярко-лаймовый / Light Green",            onHex: "#366606", onName: "Хвойный / Deep Forest Green" },
  "a":  { hex: "#b6f696", name: "Светло-зеленый / Pale Green",            onHex: "#266606", onName: "Темно-травяной / Dark Green" },
  "b":  { hex: "#a6f696", name: "Пастельно-зеленый / Pastel Green",       onHex: "#166606", onName: "Глубокий зеленый / Deep Green" },
  "c":  { hex: "#96f696", name: "Мятно-зеленый / Mint Green",             onHex: "#066606", onName: "Темно-изумрудный / Dark Emerald" },
  "d":  { hex: "#96f6a6", name: "Светлая эрин / Erin Green",              onHex: "#066616", onName: "Малахитовый / Deep Malachite" },
  "e":  { hex: "#96f6b6", name: "Светло-нефритовый / Light Jade",         onHex: "#066626", onName: "Глубокий нефритовый / Deep Jade" },
  "f":  { hex: "#96f6c6", name: "Мятный / Mint",                          onHex: "#066636", onName: "Темный мятный / Dark Mint" },
  "g":  { hex: "#96f6d6", name: "Аквамарин / Aquamarine",                 onHex: "#066646", onName: "Темный купорос / Dark Teal" },
  "h":  { hex: "#96f6e6", name: "Бледный сине-зеленый / Pale Turquoise",  onHex: "#066656", onName: "Глубокий морской / Deep Sea Green" },
  "i":  { hex: "#96f6f6", name: "Светло-циановый / Light Cyan",           onHex: "#066666", onName: "Темный циан / Dark Cyan" },
  "j":  { hex: "#96e6f6", name: "Небесно-голубой / Sky Blue",             onHex: "#065666", onName: "Глубокий волнистый / Deep Teal Blue" },
  "k":  { hex: "#96d6f6", name: "Светло-васильковый / Light Cornflower",  onHex: "#064666", onName: "Полуночно-синий / Midnight Blue" },
  "l":  { hex: "#96c6f6", name: "Детский голубой / Baby Blue",            onHex: "#063666", onName: "Глубокий сапфировый / Deep Sapphire" },
  "m":  { hex: "#96b6f6", name: "Сизый / Vista Blue",                     onHex: "#062666", onName: "Темно-синий / Dark Blue" },
  "n":  { hex: "#96a6f6", name: "Светлый барвинок / Periwinkle",          onHex: "#061666", onName: "Военно-морской синий / Navy" },
  "o":  { hex: "#9696f6", name: "Неоновый барвинок / Medium Slate Blue",  onHex: "#060666", onName: "Темный индиго / Dark Indigo" },
  "p":  { hex: "#a696f6", name: "Светло-фиолетовый / Rich Lavender",      onHex: "#160666", onName: "Глубокий ультрамарин / Deep Ultramarine" },
  "q":  { hex: "#b696f6", name: "Яркая лаванда / Medium Purple",          onHex: "#260666", onName: "Темно-фиалковый / Dark Violet" },
  "r":  { hex: "#c696f6", name: "Светло-пурпурный / Helio",               onHex: "#360666", onName: "Глубокий слива / Deep Plum" },
  "s":  { hex: "#d696f6", name: "Светлая орхидея / Orchid",               onHex: "#460666", onName: "Темно-пурпурный / Dark Purple" },
  "t":  { hex: "#e696f6", name: "Крокус / Crocus",                        onHex: "#560666", onName: "Насыщенный фиолетовый / Deep Purple" },
  "u":  { hex: "#f696f6", name: "Светлая маджента / Light Magenta",       onHex: "#660666", onName: "Темная маджента / Dark Magenta" },
  "v":  { hex: "#f696e6", name: "Горячий розовый / Hot Pink",             onHex: "#660656", onName: "Баклажановый / Eggplant" },
  "w":  { hex: "#f696d6", name: "Гвоздика / Carnation Pink",              onHex: "#660646", onName: "Темный фуксин / Dark Fuchsia" },
  "x":  { hex: "#f696c6", name: "Неоново-розовый / Tangelo Pink",         onHex: "#660636", onName: "Темный розово-бордовый / Deep Rose" },
  "y":  { hex: "#f696b6", name: "Цвет сакуры / Cherry Blossom",           onHex: "#660626", onName: "Темный амарантовый / Dark Amaranth" },
  "z":  { hex: "#f696a6", name: "Бледный амарантовый / Amaranth Pink",    onHex: "#660616", onName: "Глубокий рубиновый / Deep Ruby" },
};

export const allColors: Record<string, string> = {
  "00": "#f69696", "10": "#f6a696", "20": "#f6b696", "30": "#f6c696", "40": "#f6d696", "50": "#f6e696",
  "60": "#f6f696", "70": "#e6f696", "80": "#d6f696", "90": "#c6f696", "100": "#b6f696", "110": "#a6f696",
  "120": "#96f696", "130": "#96f6a6", "140": "#96f6b6", "150": "#96f6c6", "160": "#96f6d6", "170": "#96f6e6",
  "180": "#96f6f6", "190": "#96e6f6", "200": "#96d6f6", "210": "#96c6f6", "220": "#96b6f6", "230": "#96a6f6",
  "240": "#9696f6", "250": "#a696f6", "260": "#b696f6", "270": "#c696f6", "280": "#d696f6", "290": "#e696f6",
  "300": "#f696f6", "310": "#f696e6", "320": "#f696d6", "330": "#f696c6", "340": "#f696b6", "350": "#f696a6",
};

export const fullOrder = [
  "00","10","20","30","40","50","60","70","80","90","100","110",
  "120","130","140","150","160","170","180","190","200","210","220","230",
  "240","250","260","270","280","290","300","310","320","330","340","350",
];

export const groupsConfig = [
  { bridgeKey: "00", rowKeys: ["10","20","30","40","50"] },
  { bridgeKey: "60", rowKeys: ["70","80","90","100","110"] },
  { bridgeKey: "120", rowKeys: ["130","140","150","160","170"] },
  { bridgeKey: "180", rowKeys: ["190","200","210","220","230"] },
  { bridgeKey: "240", rowKeys: ["250","260","270","280","290"] },
  { bridgeKey: "300", rowKeys: ["310","320","330","340","350"] },
];

export type ColorFormat = "hex" | "rgb" | "hsl";

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function formatColor(hex: string, format: ColorFormat): string {
  if (format === "rgb") {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (format === "hsl") {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return hex.toUpperCase();
}

export function getTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? "#060606" : "#e0e0e0";
}

export function getM3TextHex(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  return `hsl(${h}, ${s}%, 12%)`;
}

export function formatM3Color(hex: string, format: ColorFormat): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  if (format === "hsl") return `hsl(${h}, ${s}%, 12%)`;
  const l = 0.12;
  const a = (s / 100) * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  const mr = f(0), mg = f(8), mb = f(4);
  if (format === "rgb") return `rgb(${mr}, ${mg}, ${mb})`;
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(mr)}${toHex(mg)}${toHex(mb)}`.toUpperCase();
}
