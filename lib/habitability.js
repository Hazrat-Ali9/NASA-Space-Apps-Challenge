// Simplified Earth-similarity index (ESI-style). Not a scientific verdict.
const sim = (x, x0) => Math.max(0, 1 - Math.abs(x - x0) / (x + x0));
const W = { radius: 0.57, flux: 0.7, temp: 0.6 };
//
export function habitability(p) {
  const parts = { radius: sim(p.pl_rade, 1), flux: sim(p.pl_insol, 1), temp: sim(p.pl_eqt, 255) };
  const sum = W.radius + W.flux + W.temp;
  const score = Math.exp(Object.keys(W).reduce((a, k) => a + W[k] * Math.log(Math.max(parts[k], 1e-6)), 0) / sum);
  return { score, parts };
}

export function toXYZ(p) {
  const r = 2 + Math.log10(Math.max(p.sy_dist, 1)) * 3;
  const ra = (p.ra * Math.PI) / 180, de = (p.dec * Math.PI) / 180;
  return [r * Math.cos(de) * Math.cos(ra), r * Math.sin(de), r * Math.cos(de) * Math.sin(ra)];
}
