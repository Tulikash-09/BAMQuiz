"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Statistics Quiz", href: "/quiz?playlist=statistics" },
  { label: "Machine Learning Quiz", href: "/quiz?playlist=machine-learning" },
  { label: "All Topics", href: "/#topics" },
  { label: "About", href: "/#about" },
];

export default function HamburgerNav({ score, total, onFinish }: {
  score?: number;
  total?: number;
  onFinish?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Fixed top bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 sm:px-8 bg-white border-b-2 border-ink/10"
        style={{ boxShadow: "0 2px 0px rgba(26,26,46,0.04)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-hand text-sq-red tracking-tight hover:opacity-75 transition-opacity"
          style={{ fontSize: "28px", lineHeight: 1 }}
          onClick={() => setOpen(false)}
        >
          BAM<span style={{ fontSize: "34px" }}>!</span>
        </Link>

        {/* Right side: score (quiz page only) + hamburger */}
        <div className="flex items-center gap-4">
          {typeof total === "number" && total > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 text-sm">
              <span className="font-body text-muted hidden xs:inline sm:inline">
                Score:{" "}
              </span>
              <span className="font-hand text-ink text-sm">{score}/{total}</span>
              {onFinish && (
                <button
                  onClick={onFinish}
                  className="font-hand text-sq-red hover:opacity-75 transition-opacity text-base min-h-[44px] px-1"
                >
                  Finish →
                </button>
              )}
            </div>
          )}

          {/* Hamburger button — slightly uneven lines for hand-drawn feel */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex flex-col justify-center items-start w-11 h-11 gap-[5px] -mr-1"
          >
            <span
              className="block bg-ink transition-all duration-300 origin-center"
              style={open
                ? { height: "2px", width: "22px", transform: "rotate(45deg) translateY(7px)" }
                : { height: "2px", width: "22px" }
              }
            />
            <span
              className="block bg-ink transition-all duration-300"
              style={open
                ? { height: "2px", width: "24px", opacity: 0, transform: "scaleX(0)" }
                : { height: "2px", width: "24px" }
              }
            />
            <span
              className="block bg-ink transition-all duration-300 origin-center"
              style={open
                ? { height: "2px", width: "22px", transform: "rotate(-45deg) translateY(-7px)" }
                : { height: "2px", width: "20px" }
              }
            />
          </button>
        </div>
      </header>

      {/* Full-screen overlay — white */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300 bg-white"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={() => setOpen(false)}
      >
        {/* Menu content */}
        <nav
          className="flex flex-col justify-center items-start h-full px-10 sm:px-20 gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group font-hand text-ink py-2"
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                transitionDelay: open ? `${i * 40}ms` : "0ms",
                transform: open ? "translateX(0)" : "translateX(-20px)",
                opacity: open ? 1 : 0,
                transition: `transform 0.3s ease ${i * 40}ms, opacity 0.3s ease ${i * 40}ms, color 0.15s ease`,
              }}
            >
              {item.label}
              {/* Red underline that draws in on hover */}
              <span
                className="block h-0.5 w-0 group-hover:w-full bg-sq-red transition-all duration-300 mt-0.5"
              />
            </Link>
          ))}

          <div
            className="absolute bottom-10 left-10 sm:left-20 font-body text-xs text-muted"
            style={{ opacity: open ? 1 : 0, transition: "opacity 0.3s ease 250ms" }}
          >
            Based on Josh Starmer&apos;s StatQuest playlists
          </div>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-14" />
    </>
  );
}
