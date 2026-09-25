'use client';

import { useEffect, useRef, useState } from 'react';

type VideoSource = { src: string; type: 'video/webm' | 'video/mp4' };

type StudioVideoProps = {
  /** Em ordem de preferencia: o navegador usa o primeiro formato que suportar. */
  sources: VideoSource[];
  poster: string;
  label: string;
  className?: string;
};

/**
 * Video decorativo em loop, sem som.
 *
 * - So toca enquanto esta visivel na tela (economiza bateria e dados no celular).
 * - Respeita "reduzir movimento" do sistema: nao inicia sozinho e mostra os
 *   controles para a pessoa tocar se quiser.
 * - `muted` e aplicado tambem via propriedade: o React nao grava o atributo no
 *   HTML do servidor e, sem ele, os navegadores bloqueiam a reproducao automatica.
 */
export default function StudioVideo({ sources, poster, label, className }: StudioVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      if (visible && !motionQuery.matches) {
        // play() pode ser recusado (economia de energia, aba em segundo plano): ignorar e seguro.
        video.play().catch(() => undefined);
      } else if (!motionQuery.matches) {
        video.pause();
      }
    };

    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          sync();
        },
        { threshold: 0.25 }
      );
      observer.observe(video);
    } else {
      visible = true;
      sync();
    }

    motionQuery.addEventListener('change', sync);
    return () => {
      observer?.disconnect();
      motionQuery.removeEventListener('change', sync);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reducedMotion}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
