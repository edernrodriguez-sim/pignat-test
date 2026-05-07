
import type { StepStatus, ExerciseStep, ExerciseState } from "./exercice";
import "./exercicePanel.css";

// ─── Step Icon ────────────────────────────────────────────────────────────────

function StepIcon({ status, number }: { status: StepStatus; number: number }) {
  if (status === "completed")
    return (
      <span className="ep-step-icon ep-step-icon--completed" aria-label="Étape complétée">
        ✓
      </span>
    );
  if (status === "active")
    return (
      <span className="ep-step-icon ep-step-icon--active" aria-label="Étape active">
        {number}
      </span>
    );
  return (
    <span className="ep-step-icon ep-step-icon--pending" aria-label="Étape en attente">
      {number}
    </span>
  );
}

// ─── Action Hint ──────────────────────────────────────────────────────────────

function ActionHint({ step }: { step: ExerciseStep }) {
  const { action } = step;

  if (action.type === "click3D") {
    return (
      <p className="ep-action-hint ep-action-hint--click">
        <span className="ep-action-hint__icon">🖱️</span>
        {action.label ?? `Cliquez sur « ${action.entityTag} » dans la scène 3D`}
      </p>
    );
  }

  if (action.type === "inputChange") {
    return (
      <p className="ep-action-hint ep-action-hint--input">
        <span className="ep-action-hint__icon">✏️</span>
        {action.label ?? `Renseignez le champ « ${action.fieldId} »`}
        {action.expectedValue !== undefined && (
          <span className="ep-action-hint__expected">
            {" "}— valeur attendue : <code>{action.expectedValue}</code>
          </span>
        )}
      </p>
    );
  }

  return null;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="ep-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="ep-progress__fill" style={{ width: `${pct}%` }} />
      <span className="ep-progress__label">{current}/{total}</span>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

interface ExercisePanelProps {
  state: ExerciseState;
  onReset?: () => void;
  /** Permet de valider manuellement (bouton debug) */
  onForceComplete?: () => void;
  showDebug?: boolean;
}

export function ExercisePanel({
  state,
  onReset,
  onForceComplete,
  showDebug = false,
}: ExercisePanelProps) {
  const { exercise, currentStepIndex, stepStatuses, isCompleted } = state;
  const completedCount = Object.values(stepStatuses).filter(
    (s) => s === "completed"
  ).length;

  return (
    <div  className={`absolute top-[2vh] left-[2vh] ep-panel`}  aria-label={`Exercice : ${exercise.name}`}>
      {/* Header */}
      <div className="ep-header">
        <h2 className="ep-title">{exercise.name}</h2>
        <p className="ep-description">{exercise.description}</p>
        <ProgressBar current={completedCount} total={exercise.steps.length} />
      </div>

      {/* Steps list */}
      <ol className="ep-steps" aria-label="Étapes">
        {exercise.steps.map((step) => {
          const status = stepStatuses[step.id];
          const isActive = status === "active";

          return (
            <li
              key={step.id}
              className={`ep-step ep-step--${status}`}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="ep-step__header">
                <StepIcon status={status} number={step.number} />
                <span className="ep-step__name">{step.name}</span>
              </div>

              {/* Contenu visible uniquement pour l'étape active */}
              {isActive && (
                <div className="ep-step__body">
                  <p className="ep-step__desc">{step.description}</p>
                  <ActionHint step={step} />
                  {showDebug && onForceComplete && (
                    <button
                      className="ep-btn ep-btn--debug"
                      onClick={onForceComplete}
                    >
                      ⚡ Valider (debug)
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Completion screen */}
      {isCompleted && (
        <div className="ep-complete" role="status" aria-live="polite">
          <span className="ep-complete__icon">🎉</span>
          <p className="ep-complete__msg">Exercice terminé !</p>
          {onReset && (
            <button className="ep-btn ep-btn--reset" onClick={onReset}>
              Recommencer
            </button>
          )}
        </div>
      )}
    </div>
  );
}