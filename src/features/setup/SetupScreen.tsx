import { DIFFICULTIES, DIFFICULTY_CONFIG, OPERATION_LABELS, type GameSettings, type Operation, type OperationInsight } from "../../lib/game/types";
import { validateSettings } from "../../lib/game/validation";

interface SetupScreenProps {
  profileName: string;
  settings: GameSettings;
  insights: Partial<Record<Operation, OperationInsight>>;
  onSettingsChange: (settings: GameSettings) => void;
  onOpenStats: () => void;
  onStartGame: () => void;
}

function toInt(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function SetupScreen({
  profileName,
  settings,
  insights,
  onSettingsChange,
  onOpenStats,
  onStartGame
}: SetupScreenProps) {
  const errors = validateSettings(settings);
  const canStartGame = Object.keys(errors).length === 0;

  function toggleOperation(operation: Operation) {
    onSettingsChange({
      ...settings,
      operations: {
        ...settings.operations,
        [operation]: {
          ...settings.operations[operation],
          enabled: !settings.operations[operation].enabled
        }
      }
    });
  }

  function updateRange(operation: Operation, field: "min" | "max", value: string) {
    onSettingsChange({
      ...settings,
      operations: {
        ...settings.operations,
        [operation]: {
          ...settings.operations[operation],
          [field]: toInt(value)
        }
      }
    });
  }

  function applyRecommendedRange(operation: Operation) {
    const recommendation = insights[operation]?.recommendedNextRange;

    if (!recommendation) {
      return;
    }

    onSettingsChange({
      ...settings,
      operations: {
        ...settings.operations,
        [operation]: {
          ...settings.operations[operation],
          min: recommendation.min,
          max: recommendation.max,
          enabled: true
        }
      }
    });
  }

  return (
    <section className="setup-layout">
      <div className="hero-card panel">
        <p className="eyebrow">Underwater Survival Math</p>
        <h1>{profileName}, pick your practice dive.</h1>
        <p className="hero-copy">
          Mix operations, choose the number range, and set the pressure level. Mastery stays tied to this
          profile, but custom ranges are always available.
        </p>

        <div className="hero-actions">
          <button className="primary-button" disabled={!canStartGame} onClick={onStartGame} type="button">
            Start the dive
          </button>
          <button className="ghost-button" onClick={onOpenStats} type="button">
            View mastery stats
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Operations</p>
            <h2>Choose what shows up underwater</h2>
          </div>
        </div>

        {errors.operations ? <p className="error-text">{errors.operations}</p> : null}

        <div className="operation-grid">
          {(Object.keys(settings.operations) as Operation[]).map((operation) => {
            const config = settings.operations[operation];
            const insight = insights[operation];

            return (
              <article
                className={`operation-card${config.enabled ? " operation-card--active" : ""}`}
                key={operation}
              >
                <div className="operation-card__header">
                  <div>
                    <p className="eyebrow">{OPERATION_LABELS[operation]}</p>
                    <h3>
                      {config.min} to {config.max}
                    </h3>
                  </div>
                  <label className="toggle">
                    <input
                      checked={config.enabled}
                      onChange={() => toggleOperation(operation)}
                      type="checkbox"
                    />
                    <span>{config.enabled ? "On" : "Off"}</span>
                  </label>
                </div>

                <div className="range-fields">
                  <label className="field">
                    <span>Lowest</span>
                    <input
                      min={0}
                      onChange={(event) => updateRange(operation, "min", event.target.value)}
                      type="number"
                      value={config.min}
                    />
                  </label>
                  <label className="field">
                    <span>Highest</span>
                    <input
                      min={0}
                      onChange={(event) => updateRange(operation, "max", event.target.value)}
                      type="number"
                      value={config.max}
                    />
                  </label>
                </div>

                <div className="operation-card__footer">
                  <p>
                    {insight?.highestMasteredRange
                      ? `Mastered through ${insight.highestMasteredRange}`
                      : "No mastered range yet"}
                  </p>
                  <button className="ghost-button" onClick={() => applyRecommendedRange(operation)} type="button">
                    Use recommended range
                  </button>
                </div>

                {errors[operation] ? <p className="error-text">{errors[operation]}</p> : null}
              </article>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Difficulty</p>
            <h2>Control speed and bubble count</h2>
          </div>
        </div>

        <div className="difficulty-grid">
          {DIFFICULTIES.map((difficulty) => {
            const config = DIFFICULTY_CONFIG[difficulty];
            const isSelected = difficulty === settings.difficulty;

            return (
              <button
                className={`difficulty-card${isSelected ? " difficulty-card--selected" : ""}`}
                key={difficulty}
                onClick={() => onSettingsChange({ ...settings, difficulty })}
                type="button"
              >
                <strong>{config.label}</strong>
                <span>{config.choiceCount} bubbles</span>
                <span>{config.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
