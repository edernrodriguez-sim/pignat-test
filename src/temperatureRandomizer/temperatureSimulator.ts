// useParameterTransition.ts
// Fait progresser linéairement les valeurs de MachineParameter[]
// vers des valeurs cibles sur une durée définie.

import { useCallback, useRef } from "react";
import type { MachineParameter } from "../models/machineParameter";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TempTarget {
  key: string;    // correspond à MachineParameter.id
  value: number;  // valeur cible à atteindre
  time: number;   // durée en secondes pour atteindre la cible
}

// État interne d'une transition en cours pour un paramètre
interface ActiveTransition {
  parameterId: string;
  startValue: number;
  targetValue: number;
  totalSteps: number;   // = time (1 tick = 1 seconde)
  currentStep: number;
  intervalId: ReturnType<typeof setInterval>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseParameterTransitionOptions {
  /** Appelée à chaque tick avec le tableau de paramètres mis à jour */
  onParametersChange: (updated: MachineParameter[]) => void;
  /** Appelée quand toutes les transitions sont terminées (optionnel) */
  onAllComplete?: () => void;
  /** Appelée quand un paramètre atteint sa cible (optionnel) */
  onTargetReached?: (parameterId: string, finalValue: number) => void;
}
/** Permet le lancement d'une simulation de temperatures en passant le tableau des paramètres de machine et un tableau de TempTarget pour indiquer
 * quels champs modifiés et en combien de temps
 */
export default function UseTemperatureSimulation(
  options: UseParameterTransitionOptions,
  currentParameters: MachineParameter[], 
) {
  const { onParametersChange, onAllComplete, onTargetReached } = options;

  // On stocke les transitions actives dans une ref pour ne pas déclencher
  // de re-render à chaque tick et éviter les stale closures dans setInterval
  const activeTransitions = useRef<Map<string, ActiveTransition>>(new Map());

  // Ref vers les paramètres courants — mise à jour depuis l'extérieur
  const parametersRef = useRef<MachineParameter[]>([]);
  parametersRef.current = currentParameters; // ← sync à chaque render

  // ── Fonction principale ───────────────────────────────────────────────────

  const startTransitions = useCallback(
    (parameters: MachineParameter[], targets: TempTarget[]) => {
      // Mettre à jour la ref avec les paramètres actuels
      parametersRef.current = parameters;

      targets.forEach((target) => {
        const param = parameters.find(
          (p) => p.key === target.key && typeof p.value === "number"
        );

        if (!param) {
          console.warn(`[useParameterTransition] Paramètre "${target.key}" introuvable ou non numérique.`);
          return;
        }

        // Annuler une transition déjà en cours sur ce paramètre
        const existing = activeTransitions.current.get(target.key);
        if (existing) {
          clearInterval(existing.intervalId);
        }

        const startValue  = param.value as number;
        const totalSteps  = target.time;         // 1 step = 1 seconde
        const increment   = (target.value - startValue) / totalSteps;

        let currentStep = 0;

        const intervalId = setInterval(() => {
          currentStep++;

          const isLast      = currentStep >= totalSteps;
          // Dernière étape : on force exactement la valeur cible (évite les
          // erreurs d'arrondi flottant)
          const newValue = isLast
            ? target.value
            : startValue + increment * currentStep;

          // Mettre les valeurs modifiées uniquement
          let param = parametersRef.current.filter(p => p.key === target.key)[0];
          param.value = Math.round(newValue * 100) / 100;
          // Notifier React
          onParametersChange([param]);

          if (isLast) {
            clearInterval(intervalId);
            activeTransitions.current.delete(target.key);
            onTargetReached?.(target.key, target.value);

            // Vérifier si toutes les transitions sont terminées
            if (activeTransitions.current.size === 0) {
              onAllComplete?.();
            }
          }
        }, 1000); // 1 tick = 1 seconde

        activeTransitions.current.set(target.key, {
          parameterId: target.key,
          startValue,
          targetValue: target.value,
          totalSteps,
          currentStep: 0,
          intervalId,
        });
      });
    },
    [onParametersChange, onAllComplete, onTargetReached],
  );

  // ── Arrêter une ou toutes les transitions ──────────────────────────────────

  const stopTransition = useCallback((parameterId: string) => {
    const t = activeTransitions.current.get(parameterId);
    if (t) {
      clearInterval(t.intervalId);
      activeTransitions.current.delete(parameterId);
      t
    }
  }, []);

  const stopAll = useCallback(() => {
    activeTransitions.current.forEach((t) => clearInterval(t.intervalId));
    activeTransitions.current.clear();
  }, []);


  // ── Termine toutes les transitions pour qu'elles atteignent leur valeur finale ──────────────────────────────────
  const completeAll = useCallback(() => {
    activeTransitions.current.forEach((t) => 
    {
      clearInterval(t.intervalId)
    });

    activeTransitions.current.forEach((t) => 
    {

      let param = parametersRef.current.filter(p => p.key === t.parameterId)[0];
      param.value = t.targetValue;
      // Notifier React
      onParametersChange([param]);
    });
    
    // onParametersChange([...parametersRef.current]);
    activeTransitions.current.clear();
  }, []);
  // ── Lire l'état d'une transition ───────────────────────────────────────────

  const getProgress = useCallback((parameterId: string): number | null => {
    const t = activeTransitions.current.get(parameterId);
    if (!t) return null;
    return t.currentStep / t.totalSteps; // 0.0 → 1.0
  }, []);

  return { startTransitions, stopTransition, stopAll, getProgress, completeAll };
}