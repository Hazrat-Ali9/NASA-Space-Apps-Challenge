import { Instrument_Serif, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/auth";
import Nav from "../components/Nav";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--display" });
const body = Sora({ subsets: ["latin"], variable: "--body" });

export const metadata = {
  title: "ASTREVION — Exploring the Universe Beyond",
  description: "Beyond the Known Cosmos. Astronomy, galaxies and exoplanets — explored in 3D.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}><AuthProvider><Nav />{children}</AuthProvider></body>
    </html>
  );
}
