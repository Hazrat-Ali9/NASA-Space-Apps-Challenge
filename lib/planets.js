export const FALLBACK = [
  { name: "Kepler-452 b", type: "Super-Earth", color: "#4fb6ff", dist: 3.2, size: 0.22, speed: 0.35, gas: false, facts: "1,400 ly away · 385-day year · inside the habitable zone" },
  { name: "TRAPPIST-1 e", type: "Rocky", color: "#3ff0c8", dist: 4.4, size: 0.17, speed: 0.55, gas: false, facts: "40 ly away · 6-day year · one of seven worlds around a red dwarf" },
  { name: "HD 189733 b", type: "Gas giant", color: "#5b7cff", dist: 5.6, size: 0.38, speed: 0.25, gas: true, facts: "64 ly away · 2-day year · glass rain blown sideways" },
  { name: "55 Cnc e", type: "Lava world", color: "#ff7a3d", dist: 6.8, size: 0.2, speed: 0.7, gas: false, facts: "41 ly away · 18-hour year · molten surface" },
];

const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [A, B] = [p(a), p(b)];
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

export function toPlanet(r, i, n) {
  const rade = r.pl_rade ?? 2, per = r.pl_orbper ?? 10;
  const t = Math.min(Math.max(((r.pl_eqt ?? 400) - 200) / 1800, 0), 1);
  const type = rade < 1.25 ? "Rocky" : rade < 2 ? "Super-Earth" : rade < 6 ? "Neptune-like" : "Gas giant";
  const ly = r.sy_dist ? Math.round(r.sy_dist * 3.262) : null;
  return {
    name: r.pl_name,
    type,
    color: mix("#4fb6ff", "#ff7a3d", t),
    dist: 3 + (i * 4.8) / Math.max(n - 1, 1),
    size: Math.min(0.14 + Math.log10(Math.max(rade, 1)) * 0.22, 0.5),
    speed: 0.8 / (1 + Math.log10(1 + per)),
    gas: rade > 6,
    facts: [ly && `${ly.toLocaleString()} ly away`, `${per.toFixed(1)}-day year`, `${rade.toFixed(1)}× Earth radius`, r.pl_eqt && `~${Math.round(r.pl_eqt)} K`, r.disc_year && `found ${r.disc_year}`].filter(Boolean).join(" · "),
  };
}
