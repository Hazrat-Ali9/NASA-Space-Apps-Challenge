const NAMES = ["Proxima Cen b", "TRAPPIST-1 e", "55 Cnc e", "51 Peg b", "HD 189733 b", "TOI-700 d", "K2-18 b", "Kepler-452 b"];

export async function GET() {
  try {
    const q = `select pl_name,pl_rade,pl_orbper,pl_eqt,sy_dist,disc_year from pscomppars where pl_name in (${NAMES.map((n) => `'${n}'`).join(",")})`;
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(q)}&format=json`;
    const r = await fetch(url, { next: { revalidate: 86400 } });
    if (!r.ok) throw new Error(String(r.status));
    return Response.json(await r.json());
  } catch {
    return Response.json([], { status: 502 });
  }
}
