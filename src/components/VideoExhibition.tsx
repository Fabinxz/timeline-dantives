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
}

function VideoCard({ title, subtitle, description, thumbnail, icon, duration }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-[#080808]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-[#00F5FF]/30 transition-all duration-500 shadow-2xl"
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
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-[#00F5FF]/10 backdrop-blur-md border border-[#00F5FF]/40 flex items-center justify-center text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 group-hover:bg-[#00F5FF]/20 group-hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] cursor-pointer"
          >
            <Play className="w-8 h-8 fill-current" />
          </motion.div>
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
          <div className="p-2 rounded-lg bg-[#00F5FF]/5 border border-[#00F5FF]/20 text-[#00F5FF]">
            {icon}
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[3px] text-[#00F5FF]/50 font-mono">
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
            <Info className="w-3 h-3" />
            Em breve
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="text-[10px] font-mono text-[#00F5FF] uppercase tracking-widest flex items-center gap-2 group/btn"
          >
            Aguardando Link
            <div className="w-4 h-px bg-[#00F5FF]/30 group-hover/btn:w-8 transition-all duration-300" />
          </motion.button>
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-[#00F5FF]/0 via-[#00F5FF]/40 to-[#00F5FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-r from-[#00F5FF]/0 via-[#00F5FF]/40 to-[#00F5FF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

export default function VideoExhibition() {
  const videos = [
    {
      title: "Dominando o Soroban",
      subtitle: "Tutorial Técnico",
      description: "Um guia passo a passo para iniciantes. Aprenda as técnicas fundamentais de soma e subtração no ábaco japonês com demonstrações visuais claras.",
      thumbnail: "/video_tutorial_thumb_1777654260013.png",
      icon: <GraduationCap className="w-5 h-5" />,
      duration: "08:45"
    },
    {
      title: "Do Ábaco ao Silício",
      subtitle: "Documentário Histórico",
      description: "Explore como os princípios binários e decimais do ábaco influenciaram a arquitetura dos primeiros computadores modernos e a lógica da computação.",
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
