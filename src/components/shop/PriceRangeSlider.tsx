"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

type Props = {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  step?: number;
  onCommit: (min: number, max: number) => void;
};

/**
 * Two-thumb price slider. Moves freely while dragging and only updates
 * the results when the thumb is released. Give it a `key` of the current
 * values so it resets when filters are cleared.
 */
export function PriceRangeSlider({ min, max, valueMin, valueMax, step = 500, onCommit }: Props) {
  const [lo, setLo] = useState(valueMin);
  const [hi, setHi] = useState(valueMax);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const commit = () => onCommit(lo, hi);

  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rotate-45 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gold-300 [&::-webkit-slider-thumb]:bg-ink [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rotate-45 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gold-300 [&::-moz-range-thumb]:bg-ink";

  return (
    <div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ivory-100/15" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-gold-400"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - step))}
          onPointerUp={commit}
          onKeyUp={commit}
          className={thumb}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + step))}
          onPointerUp={commit}
          onKeyUp={commit}
          className={thumb}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-ivory-100/60">
        <span>{formatPrice(lo)}</span>
        <span>
          {formatPrice(hi)}
          {hi === max && "+"}
        </span>
      </div>
    </div>
  );
}
