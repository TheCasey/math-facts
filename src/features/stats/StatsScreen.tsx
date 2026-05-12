import { formatInsightHeadline, deriveOperationInsight } from "../../lib/game/mastery";
import { OPERATION_LABELS, OPERATIONS, type ProfileState } from "../../lib/game/types";

interface StatsScreenProps {
  bestScore: number;
  profileName: string;
  profileState: ProfileState;
  onBack: () => void;
  onPlayAgain: () => void;
}

export function StatsScreen({ bestScore, profileName, profileState, onBack, onPlayAgain }: StatsScreenProps) {
  const insights = OPERATIONS.map((operation) => deriveOperationInsight(operation, profileState));

  return (
    <section className="stats-layout">
      <div className="panel stats-hero">
        <p className="eyebrow">Mastery Overview</p>
        <h1>{profileName}'s progress board</h1>
        <p className="hero-copy">
          Custom ranges stay open, but mastery shows the highest fully locked-in range for each operation and
          suggests where to head next.
        </p>

        <div className="hero-actions">
          <button className="primary-button" onClick={onPlayAgain} type="button">
            Start another round
          </button>
          <button className="ghost-button" onClick={onBack} type="button">
            Back to setup
          </button>
        </div>
      </div>

      <div className="stats-row">
        <article className="panel metric-card">
          <span>Best score</span>
          <strong>{bestScore}</strong>
        </article>
        <article className="panel metric-card">
          <span>Saved sessions</span>
          <strong>{profileState.sessions.length}</strong>
        </article>
        <article className="panel metric-card">
          <span>Facts seen</span>
          <strong>{Object.keys(profileState.factStats).length}</strong>
        </article>
      </div>

      <div className="operation-grid operation-grid--stats">
        {insights.map((insight) => (
          <article className="panel insight-card" key={insight.operation}>
            <p className="eyebrow">{OPERATION_LABELS[insight.operation]}</p>
            <h2>{formatInsightHeadline(insight)}</h2>
            <p>
              Recommended next range: {insight.recommendedNextRange.min}-{insight.recommendedNextRange.max}
            </p>
            <p>
              Accuracy: {Math.round(insight.accuracy * 100)}% across {insight.seenFacts} seen fact
              {insight.seenFacts === 1 ? "" : "s"}.
            </p>
            <p>Mastered facts: {insight.masteredFacts}</p>

            <div className="fact-list">
              <div>
                <strong>Strongest</strong>
                {insight.strongestFacts.length ? (
                  <ul>
                    {insight.strongestFacts.slice(0, 3).map((fact) => (
                      <li key={`strong-${fact.key}`}>
                        {fact.displayLabel} • {Math.round(fact.accuracy * 100)}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No rounds played yet.</p>
                )}
              </div>
              <div>
                <strong>Needs more reps</strong>
                {insight.weakestFacts.length ? (
                  <ul>
                    {insight.weakestFacts.slice(0, 3).map((fact) => (
                      <li key={`weak-${fact.key}`}>
                        {fact.displayLabel} • {Math.round(fact.accuracy * 100)}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No rounds played yet.</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {profileState.sessions.length ? (
        <div className="panel session-panel">
          <p className="eyebrow">Recent Sessions</p>
          <div className="session-list">
            {profileState.sessions.slice(0, 6).map((session) => (
              <article className="session-card" key={session.id}>
                <strong>{session.score} pts</strong>
                <span>{Math.round(session.accuracy * 100)}% accuracy</span>
                <span>{session.elapsedSeconds}s underwater</span>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
