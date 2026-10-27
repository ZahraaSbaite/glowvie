"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Elements that already have their own motion, or live in overlays, are left alone.
const SKIP = "[data-no-reveal], .flip-card, .gallery-depth, .fixed";

/**
 * Site-wide scroll motion, applied to the page as it renders (and to content that loads
 * later, like the gallery): section headings sweep in left-to-right as if being written,
 * photos unveil with an upward wipe, and photos inside [data-parallax] drift slowly as the
 * page scrolls. Re-runs on every route; skipped on admin pages and under reduced motion.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    const seen = new WeakSet<Element>();
    const ctx = gsap.context(() => {});

    const scan = () => {
      ctx.add(() => {
        main.querySelectorAll("h2").forEach((h) => {
          if (seen.has(h) || h.closest(SKIP)) return;
          seen.add(h);
          gsap.fromTo(
            h,
            { clipPath: "inset(-25% 100% -25% 0%)" },
            {
              clipPath: "inset(-25% -5% -25% 0%)",
              duration: 1.5,
              ease: "power3.inOut",
              clearProps: "clipPath",
              scrollTrigger: { trigger: h, start: "top 88%", once: true },
            }
          );
        });

        main.querySelectorAll("[data-parallax]").forEach((wrap) => {
          if (seen.has(wrap) || wrap.closest(SKIP)) return;
          seen.add(wrap);
          const img = wrap.querySelector("img");
          wrap.querySelectorAll("img").forEach((i) => seen.add(i));
          gsap.fromTo(
            wrap,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: wrap, start: "top 90%", once: true } }
          );
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -7, scale: 1.18 },
              { yPercent: 7, scale: 1.18, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } }
            );
          }
        });

        main.querySelectorAll("img").forEach((img) => {
          if (seen.has(img) || img.closest(SKIP)) return;
          seen.add(img);
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 1.4,
              ease: "power3.out",
              clearProps: "clipPath,transform",
              scrollTrigger: { trigger: img.parentElement ?? img, start: "top 90%", once: true },
            }
          );
        });
      });
      ScrollTrigger.refresh();
    };

    const first = setTimeout(scan, 120);
    // Content that arrives later (fetched gallery photos, client lists) gets picked up too.
    let pending: ReturnType<typeof setTimeout> | undefined;
    const observer = new MutationObserver(() => {
      clearTimeout(pending);
      pending = setTimeout(scan, 200);
    });
    observer.observe(main, { childList: true, subtree: true });

    return () => {
      clearTimeout(first);
      clearTimeout(pending);
      observer.disconnect();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}

/** A thin rose-gold line along the top of the window that fills as the page is scrolled. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-[3px] origin-left"
      style={{ transform: "scaleX(0)", backgroundImage: "linear-gradient(90deg, #D8A7A7, #C9A66B, #E8799B)" }}
    />
  );
}
