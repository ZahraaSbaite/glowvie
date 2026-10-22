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

export const metadata: Metadata = {
  title: "Glow Vie Beauty Clinic — Reveal Your Natural Beauty",
  description:
    "Premium beauty treatments in a luxurious, minimal setting. Facials, nails, lashes, and semi-permanent makeup — book your appointment online.",
};

// Runs before hydration to set the .dark class synchronously, so there's no flash of the
// wrong theme on load. Light is the default — dark only applies once the visitor has
// explicitly chosen it via the toggle (we deliberately ignore the OS preference here).
const themeInitScript = `
(function() {
  try {
    if (localStorage.getItem('glowvie-theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
