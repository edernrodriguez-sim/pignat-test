import { useEffect, useState } from "react";
import type { WaitAction } from "./exercice";

interface WaitStepDisplayProps {
  action: WaitAction;
  stepName: string;
  stepDescription: string;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function WaitStepDisplay({ action, stepDescription }: WaitStepDisplayProps) {
  const { realDuration, displayDuration } = action;
  const [remaining, setRemaining] = useState(displayDuration);

  // Décrément proportionnel : chaque tick réel = displayDuration/realDuration secondes affichées
  const displayDecrement = displayDuration / realDuration;

  useEffect(() => {
    setRemaining(displayDuration); // reset si l'étape change
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - displayDecrement));
    }, 1000);
    return () => clearInterval(interval);
  }, [displayDuration, realDuration]);

  const progress = 1 - remaining / displayDuration; // 0 → 1
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return ( 
    <div id="wait-display" className={`absolute bottom-[20vh] right-[10vh] flex flex-col items-center gap-4`}>
        <div id="wait-display-header">
            <p className="text-white font-semibold text-sm">Chronomètre</p>
            <p className="text-gray-400 text-xs">{stepDescription}</p>
        </div>

      {/* Chrono circulaire */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
          {/* Fond */}
          <circle cx="72" cy="72" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
          {/* Progression */}
          <circle
            cx="72" cy="72" r={radius}
            fill="none"
            stroke={remaining <= displayDuration * 0.2 ? "#ef4444" : "#3b82f6"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
          />
        </svg>
        <span className="text-gray-700 font-mono text-2xl font-bold tabular-nums">
          {formatTime(remaining)}
        </span>
      </div>

      <p className="text-gray-500 text-[0.65rem] animate-pulse">
        Passage automatique à l'étape suivante…
      </p>
    </div>
  );
}