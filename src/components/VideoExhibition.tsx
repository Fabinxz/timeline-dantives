"use client";

import { motion } from "framer-motion";
import { Play, BookOpen, GraduationCap, Info } from "lucide-react";
import Image from "next/image";

interface VideoCardProps {
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  icon: React.ReactNode;
  duration?: string;
  url?: string;
}

function VideoCard({ title, subtitle, description, thumbnail, icon, duration, url }: VideoCardProps) {
  const isAvailable = !!url;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group relative flex flex-col bg-[#080808]/40 border rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl ${isAvailable ? 'hover:border-[#00F5FF]/30 border-white/5' : 'border-white/5 opacity-80 hover:opacity-100'}`}
    >
      {/* Video Thumbnail Area */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        />
        
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isAvailable ? (
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-full bg-[#00F5FF]/10 backdrop-blur-md border border-[#00F5FF]/40 flex items-center justify-center text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 hover:bg-[#00F5FF]/20 hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current" />
            </a>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/20">
              <Play className="w-8 h-8 fill-current" />
            </div>
          )}
        </div>

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70">
            {duration}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg border ${isAvailable ? 'bg-[#00F5FF]/5 border-[#00F5FF]/20 text-[#00F5FF]' : 'bg-white/5 border-white/10 text-white/40'}`}>
            {icon}
          </div>
          <div>
            <h4 className={`text-[10px] uppercase tracking-[3px] font-mono ${isAvailable ? 'text-[#00F5FF]/50' : 'text-white/30'}`}>
              {subtitle}
            </h4>
            <h3 className="text-xl font-bold text-white/90">
              {title}
            </h3>
          </div>
        </div>
        
        <p className="text-sm text-white/40 leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            {isAvailable ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                Disponível
              </>
            ) : (
              <>
                <Info className="w-3 h-3" />
                Em breve
              </>
            )}
          </div>
          
          {isAvailable ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-[#00F5FF] uppercase tracking-widest flex items-center gap-2 group/btn"
            >
              Assistir Agora
              <div className="w-4 h-px bg-[#00F5FF]/30 group-hover/btn:w-8 transition-all duration-300" />
            </a>
          ) : (
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
              Aguardando Link
              <div className="w-4 h-px bg-white/10" />
            </div>
          )}
        </div>
      </div>

      {/* Decorative Accents */}
      {isAvailable && (
        <>
          <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-[#00F5FF]/0 via-[#00F5FF]/40 to-[#00F5FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-r from-[#00F5FF]/0 via-[#00F5FF]/40 to-[#00F5FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </>
      )}
    </motion.div>
  );
}

export default function VideoExhibition() {
  const videos = [
    {
      title: "Operando o Soroban na Prática",
      subtitle: "HANDS-ON",
      description: "Deixe a teoria de lado por um momento. Neste tutorial em vídeo, a Sabrina demonstra o uso real e físico de um Soroban. Entenda na prática como representar números, realizar operações básicas e sinta a mecânica tátil do cálculo manual que inspirou a lógica dos processadores modernos.",
      thumbnail: "/video_tutorial_thumb_1777654260013.png",
      icon: <GraduationCap className="w-5 h-5" />,
      duration: "03:42",
      url: "https://youtu.be/Vu3cNhpVjXo"
    },
    {
      title: "Do Ábaco à Ciência da Computação",
      subtitle: "HISTÓRIA DA COMPUTAÇÃO",
      description: "Qual a verdadeira relação entre os primeiros instrumentos de cálculo da humanidade e os computadores atuais? Este minidocumentário explora a linha do tempo geral do ábaco e discute como a necessidade humana de abstrair e automatizar o processamento de dados deu origem à computação discreta.",
      thumbnail: "/video_history_thumb_1777654277759.png",
      icon: <BookOpen className="w-5 h-5" />,
      duration: "12:20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {videos.map((video, idx) => (
        <VideoCard key={idx} {...video} />
      ))}
    </div>
  );
}
