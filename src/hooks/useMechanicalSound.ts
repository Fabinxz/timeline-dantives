"use client";

import { useRef, useCallback, useState, useEffect } from "react";

export function useMechanicalSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Default muted to not annoy the user initially, or maybe false? The user requested "botão global... para não incomodar o usuário por padrão", meaning muted by default or unmuted with a toggle? Let's default to false (sound ON), but the user said "para não incomodar o usuário por padrão" which implies it should be MUTED by default. Let's set it to true.

  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playClick = useCallback(() => {
    if (isMuted || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const t = ctx.currentTime;
    
    // 1. Noise Burst (Wood/plastic snap)
    const bufferSize = ctx.sampleRate * 0.03; // 30ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // 2. Filter for wooden resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800; // Hz - plasticy/wood snap
    filter.Q.value = 0.8;

    // 3. Low freq oscillator for the "thud" body
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.03);
    
    // 4. Envelopes
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.6, t + 0.002); 
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.02); 

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0, t);
    oscGain.gain.linearRampToValueAtTime(0.4, t + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);

    // Connections
    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Play
    noiseSource.start(t);
    osc.start(t);
    osc.stop(t + 0.04);
  }, [isMuted]);

  return { playClick, isMuted, setIsMuted };
}
