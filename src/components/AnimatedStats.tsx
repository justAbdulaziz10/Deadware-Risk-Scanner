'use client';

import { useEffect, useState, useRef } from 'react';

function useCountUp(target: number, duration: number = 2000, suffix: string = '') {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count: `${count}${suffix}`, ref };
}

export default function AnimatedStats() {
  const ecosystems = useCountUp(5, 1500, '+');
  const riskFactors = useCountUp(7, 1500);
  const replacements = useCountUp(50, 2000, '+');
  const clientSide = useCountUp(100, 1500, '%');

  return (
    <section className="py-16 border-y border-surface-800 bg-surface-900/50">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div ref={ecosystems.ref}>
          <div className="text-3xl font-bold text-surface-100">{ecosystems.count}</div>
          <div className="text-sm text-surface-400 mt-1">Ecosystems Supported</div>
        </div>
        <div ref={riskFactors.ref}>
          <div className="text-3xl font-bold text-surface-100">{riskFactors.count}</div>
          <div className="text-sm text-surface-400 mt-1">Risk Factors Analyzed</div>
        </div>
        <div ref={replacements.ref}>
          <div className="text-3xl font-bold text-surface-100">{replacements.count}</div>
          <div className="text-sm text-surface-400 mt-1">Package Replacements</div>
        </div>
        <div ref={clientSide.ref}>
          <div className="text-3xl font-bold text-surface-100">{clientSide.count}</div>
          <div className="text-sm text-surface-400 mt-1">Client-Side Processing</div>
        </div>
      </div>
    </section>
  );
}
