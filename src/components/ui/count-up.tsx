"use client";

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

type CountUpProps = {
  end: number;
  duration?: number;
  decimals?: number;
};

export default function CountUp({ end, duration = 2, decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const current = end * percentage;
      setCount(current);

      if (percentage < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, end, duration]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
        return num.toFixed(decimals);
    }
    return Math.round(num).toLocaleString();
  }

  return <span ref={ref}>{formatNumber(count)}</span>;
}
