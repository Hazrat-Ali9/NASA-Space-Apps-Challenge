export const metadata = { title: "About — ASTREVION" };

export default function About() {
  return (
    <main className="about">
      <h1>About ASTREVION</h1>

      <h2>The problem</h2>
      <p>Thousands of exoplanets are confirmed, and the archive table is hard to read. It is difficult to see which worlds are closest to Earth in size, temperature and starlight, and where they sit in the sky. EDIT: connect this to the Space Apps challenge you chose.</p>

      <h2>What we built</h2>
      <p>The Habitability Lab places confirmed exoplanets in a 3D map by their real sky position and distance. It scores each planet on how close it is to Earth, lets you filter by score, compares each world with Earth, and saves favorites to a personal watchlist.</p>

      <h2>NASA data used</h2>
      <p>NASA Exoplanet Archive, Planetary Systems Composite table (TAP API). Columns used: planet radius, equilibrium temperature, insolation flux, orbital period, distance, right ascension, declination and discovery year. Data is fetched live and cached for 24 hours.</p>

      <h2>How the score works</h2>
      <p>For radius, starlight and temperature we measure how close each value is to Earth's, then combine them as a weighted geometric mean, in the style of the Earth Similarity Index. It is a simplified ranking tool, not proof that a planet is habitable. It ignores atmosphere, star type and composition.</p>

      <h2>Team, code and demo</h2>
      <p>EDIT: team names and roles · GitHub: github.com/astrevion · Demo video: add link.</p>
    </main>
  );
}
