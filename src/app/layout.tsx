import type { Metadata } from "next";
// Fonts are bundled from npm (@fontsource) rather than fetched from Google at build/dev
// time, so they always load even when Google Fonts is slow or unreachable.
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-400-italic.css";
import "@fontsource/bodoni-moda/latin-500.css";
import "@fontsource/bodoni-moda/latin-500-italic.css";
import "@fontsource/bodoni-moda/latin-600.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/pinyon-script/latin-400.css";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ClickSparkles } from "@/components/ClickSparkles";

export const metadata: Metadata = {
  title: "Glow Vie Beauty Clinic — Reveal Your Natural Beauty",
  description:
    "Premium beauty treatments in a luxurious, minimal setting. Facials, nails, lashes, and semi-permanent makeup — book your appointment online.",
};

// The page is server-rendered with the .dark class already on <html>, so dark is the
// default with no flash. This runs before hydration and only switches to light when the
// visitor has explicitly chosen it via the toggle (we deliberately ignore the OS preference).
const themeInitScript = `
(function() {
  try {
    if (localStorage.getItem('glowvie-theme') === 'light') {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <ClickSparkles />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
