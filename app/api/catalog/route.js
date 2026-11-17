export async function GET() {
  try {
    const q = "select top 700 pl_name,hostname,ra,dec,sy_dist,pl_rade,pl_eqt,pl_insol,pl_orbper,disc_year from pscomppars where pl_rade is not null and pl_eqt is not null and pl_insol is not null and sy_dist is not null and sy_dist<600";
    const r = await fetch(`https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(q)}&format=json`, { next: { revalidate: 86400 } });
    if (!r.ok) throw new Error(String(r.status));
    return Response.json(await r.json());
  } catch {
    return Response.json([], { status: 502 });
  }
}
