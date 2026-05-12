import type { SessionSummary } from "../../lib/game/types";

interface ResultsScreenProps {
  bestScore: number;
  profileName: string;
  result: SessionSummary;
  onBackToSetup: () => void;
  onPlayAgain: () => void;
  onViewStats: () => void;
}

export function ResultsScreen({
  bestScore,
  profileName,
  result,
  onBackToSetup,
  onPlayAgain,
  onViewStats
}: ResultsScreenProps) {
  const isBestScore = result.score > 0 && result.score >= bestScore;

  return (
    <section className="results-layout">
      <div className="panel results-hero">
        <p className="eyebrow">Dive Complete</p>
        <h1>{profileName} surfaced with {result.score} points.</h1>
        <p className="hero-copy">
          {isBestScore ? "New personal best. " : ""}
          Accuracy landed at {Math.round(result.accuracy * 100)}% over {result.totalQuestions} question
          {result.totalQuestions === 1 ? "" : "s"}.
        </p>
      </div>

      <div className="stats-row">
        <article className="panel metric-card">
          <span>Best score</span>
          <strong>{bestScore}</strong>
        </article>
        <article className="panel metric-card">
          <span>Longest streak</span>
          <strong>{result.longestStreak}</strong>
        </article>
        <article className="panel metric-card">
          <span>Time underwater</span>
          <strong>{result.elapsedSeconds}s</strong>
        </article>
      </div>

      <div className="hero-actions">
        <button className="primary-button" onClick={onPlayAgain} type="button">
          Dive again
        </button>
        <button className="ghost-button" onClick={onViewStats} type="button">
          Check mastery
        </button>
        <button className="ghost-button" onClick={onBackToSetup} type="button">
          Change settings
        </button>
      </div>
    </section>
  );
}
