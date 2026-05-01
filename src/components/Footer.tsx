"use client";

import { ExternalLink, Terminal } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        relative w-full
        border-t border-white/[0.04]
        px-4 sm:px-6 md:px-8
        py-12 sm:py-16
        mt-10 sm:mt-20
        overflow-hidden
      "
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {/* ── Top accent glow ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[20px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,245,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00F5FF]/60" strokeWidth={1.5} />
            <p
              className="text-xs sm:text-sm tracking-[3px] uppercase font-bold text-white/70"
            >
              Exposição Virtual Interativa
            </p>
          </div>
          
          <div className="space-y-1.5 max-w-xl">
            <p className="text-[10px] sm:text-xs tracking-[1px] text-white/50 uppercase">
              Desenvolvido como trabalho acadêmico para a disciplina de Evolução Histórica da Computação e Aplicações.
            </p>
            <p className="text-[10px] sm:text-xs tracking-[1px] text-[#00F5FF]/70 uppercase font-bold">
              Projeto suportado pelo acervo e pesquisa do Museu de Computação Professor Odelar Leite Linhares - ICMC USP São Carlos.
            </p>
          </div>
        </div>

        {/* Center — Members */}
        <div className="flex flex-col items-center md:items-start flex-1 md:pl-10">
          <p className="text-[10px] tracking-[2px] uppercase text-white/30 mb-2 border-b border-white/10 pb-1 w-full text-center md:text-left">
            Membros do Grupo
          </p>
          <div className="flex flex-col gap-1 text-[10px] sm:text-[11px] text-white/50 tracking-[1px] uppercase text-center md:text-left">
            <span className="text-[#00F5FF]/60 mb-2 border-b border-[#00F5FF]/10 pb-1">Docente: Cláudio Fabiano Motta Toledo</span>
            <span>Elisa Chen Huang</span>
            <span>Fábio Machado da Silva</span>
            <span>Sabrina Ayumi Cardoso</span>
            <span>Victor Domingues Paccini</span>
          </div>
        </div>

        {/* Right — Version */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 md:mt-0">
          <p className="text-[10px] tracking-[1px] text-[#00F5FF]/30 uppercase">
            {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
