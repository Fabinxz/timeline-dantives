"use client";

import { ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        relative w-full
        border-t border-white/[0.04]
        px-4 sm:px-6 md:px-8
        py-8 sm:py-10
      "
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 15%, rgba(0,245,255,0.1) 50%, transparent 85%)",
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left — Branding */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <p
            className="text-[10px] sm:text-xs tracking-[2px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Exposição Virtual — Grupo Ábaco
          </p>
          <p
            className="text-[9px] sm:text-[10px] tracking-[1px]"
            style={{ color: "rgba(0,245,255,0.15)" }}
          >
            ICMC USP São Carlos · {year}
          </p>
        </div>

        {/* Right — Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Fabinxz/timeline-dantives"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1.5
              text-[10px] tracking-[2px] uppercase
              transition-colors duration-300
              hover:text-[#00F5FF]
            "
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            Source
          </a>
          <span
            className="text-[10px]"
            style={{ color: "rgba(255,255,255,0.08)" }}
          >
            v2.0
          </span>
        </div>
      </div>
    </footer>
  );
}
