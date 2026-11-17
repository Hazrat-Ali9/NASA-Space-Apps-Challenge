"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FALLBACK, toPlanet } from "../lib/planets";

const Scene = dynamic(() => import("../components/Scene"), { ssr: false });

const FIELDS = [
  ["Astronomy", "Track stars, transits and light curves from open NASA archives, then see them in motion."],
  ["Galaxies", "Fly through a spiral of 45,000 stars and learn how arms, bulges and halos form."],
  ["Exoplanets", "Compare worlds by orbit, size and temperature. Pick one and watch it in its system."],
];

export default function Home() {
  const [planets, setPlanets] = useState(FALLBACK);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const p = planets[active] ?? planets[0];

  useEffect(() => {
    fetch("/api/exoplanets")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        if (!rows.length) return;
        rows.sort((a, b) => (a.sy_dist ?? 1e9) - (b.sy_dist ?? 1e9));
        setPlanets(rows.map((r, i) => toPlanet(r, i, rows.length)));
        setLive(true);
        setActive(0);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="canvas"><Scene active={active} planets={planets} /></div>

      <main>
        <section id="top" className="hero">
          <h1>Beyond the<br />Known Cosmos.</h1>
          <p>Astrevion turns real astronomy data into a universe you can fly through. Scroll to move the camera.</p>
          <a className="btn" href="/lab">Open the Habitability Lab</a>
        </section>

        <section id="fields" className="block">
          <h2>Three ways to look up</h2>
          <div className="fields">
            {FIELDS.map(([t, d]) => (
              <article key={t}><h3>{t}</h3><p>{d}</p></article>
            ))}
          </div>
        </section>

        <section id="explore" className="block right">
          <h2>Choose a world</h2>
          <div className="tabs" role="tablist">
            {planets.map((x, i) => (
              <button key={x.name} role="tab" aria-selected={i === active} onClick={() => setActive(i)}
                style={{ "--c": x.color }}>{x.name}</button>
            ))}
          </div>
          <div className="panel" style={{ "--c": p.color }}>
            <h3>{p.name}</h3>
            <span>{p.type}</span>
            <p>{p.facts}</p>
            <small>{live ? "Live data: NASA Exoplanet Archive" : "Sample data"}</small>
          </div>
        </section>

        <section id="mission" className="block center">
          <h2>Exploring the Universe Beyond</h2>
          <p>Astronomical exploration, stellar evolution and innovation — built for NASA Space Apps Challenge 2026.</p>
        </section>
      </main>

      <footer>© 2026 ASTREVION · github.com/astrevion</footer>
    </>
  );
}
