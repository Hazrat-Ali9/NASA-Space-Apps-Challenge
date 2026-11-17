"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { habitability, toXYZ } from "../../lib/habitability";
import { useAuth } from "../../lib/auth";

const StarMap = dynamic(() => import("../../components/StarMap"), { ssr: false });
const pct = (v) => `${Math.round(v * 100)}%`;

export default function Lab() {
  const { user, openAuth } = useAuth();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(false);
  const [min, setMin] = useState(0.5);
  const [sel, setSel] = useState(null);
  const [watch, setWatch] = useState([]);
  const key = user ? `astrevion:w:${user.id}` : null;

  useEffect(() => {
    fetch("/api/catalog").then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setRows(d.map((p) => ({ ...p, ...habitability(p), pos: toXYZ(p) }))))
      .catch(() => setErr(true));
  }, []);
  useEffect(() => {
    try { setWatch(key ? JSON.parse(localStorage.getItem(key) || "[]") : []); } catch { setWatch([]); }
  }, [key]);

  const top = useMemo(() => (rows || []).map((p, i) => ({ ...p, i })).filter((p) => p.score >= min).sort((a, b) => b.score - a.score), [rows, min]);
  const p = rows && sel != null ? rows[sel] : null;

  function toggle(name) {
    if (!user) return openAuth();
    const w = watch.includes(name) ? watch.filter((x) => x !== name) : [...watch, name];
    setWatch(w);
    localStorage.setItem(key, JSON.stringify(w));
  }

  return (
    <div className="lab">
      <div className="map">{rows && <StarMap rows={rows} min={min} sel={sel} onSelect={setSel} />}</div>
      {!rows && <p className="status">{err ? "Could not reach the NASA Exoplanet Archive. Refresh to try again." : "Loading planets from NASA…"}</p>}

      <aside className="side left">
        <h2>Habitability Lab</h2>
        <p className="dim">Each dot is a confirmed exoplanet, placed by its real sky position and distance from the Sun (center). Brighter means more Earth-like.</p>
        <label>Minimum score: <b>{pct(min)}</b>
          <input type="range" min="0" max="0.9" step="0.05" value={min} onChange={(e) => setMin(+e.target.value)} />
        </label>
        {rows && <p className="dim">{top.length} of {rows.length} planets pass.</p>}
        <ol className="top">
          {top.slice(0, 10).map((x) => (
            <li key={x.pl_name}><button className={x.i === sel ? "on" : ""} onClick={() => setSel(x.i)}>{x.pl_name}<span>{pct(x.score)}</span></button></li>
          ))}
        </ol>
        {user && watch.length > 0 && <p className="dim">Your watchlist: {watch.join(", ")}</p>}
      </aside>

      {p && (
        <aside className="side right">
          <h2>{p.pl_name}</h2>
          <p className="dim">Orbits {p.hostname} · {Math.round(p.sy_dist * 3.262)} ly away{p.disc_year ? ` · found ${p.disc_year}` : ""}</p>
          <p className="big">{pct(p.score)} <small>Earth similarity</small></p>
          {[["Size", "radius", `${p.pl_rade.toFixed(2)}× Earth`], ["Starlight", "flux", `${p.pl_insol.toFixed(2)}× Earth`], ["Temperature", "temp", `${Math.round(p.pl_eqt)} K (Earth: 255 K)`]].map(([l, k, v]) => (
            <div key={k} className="bar"><span>{l}: {v}</span><i style={{ width: pct(p.parts[k]) }} /></div>
          ))}
          <p>{p.pl_eqt > 255 ? `${Math.round(p.pl_eqt - 255)} K hotter` : `${Math.round(255 - p.pl_eqt)} K colder`} than Earth, with {p.pl_insol > 1 ? "more" : "less"} starlight. Year length: {p.pl_orbper.toFixed(1)} days.</p>
          <button className="btn" onClick={() => toggle(p.pl_name)}>{watch.includes(p.pl_name) ? "Remove from watchlist" : user ? "Save to watchlist" : "Log in to save"}</button>
        </aside>
      )}
    </div>
  );
}
