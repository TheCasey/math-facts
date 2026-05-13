import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { generateQuestion } from "../../lib/game/questions";
import {
  DIFFICULTY_CONFIG,
  ROUND_AIR_DRAIN_INTERVAL_MS,
  ROUND_AIR_RULES,
  ROUND_NEXT_QUESTION_DELAY_MS,
  type FactAttempt,
  type GameSettings,
  type GeneratedQuestion,
  type SessionSummary
} from "../../lib/game/types";

const ANSWER_SHORTCUT_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

interface GameScreenProps {
  profileName: string;
  settings: GameSettings;
  onExit: () => void;
  onFinish: (summary: SessionSummary, attempts: FactAttempt[]) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isEditableElement(target: EventTarget | null): target is HTMLElement {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}

export function GameScreen({ profileName, settings, onExit, onFinish }: GameScreenProps) {
  const difficulty = DIFFICULTY_CONFIG[settings.difficulty];
  const prefersReducedMotion = usePrefersReducedMotion();
  const answerHelpId = useId();
  const feedbackId = useId();
  const startedAtRef = useRef(Date.now());
  const attemptsRef = useRef<FactAttempt[]>([]);
  const advanceTimeoutRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const choiceRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [question, setQuestion] = useState<GeneratedQuestion>(() => generateQuestion(settings));
  const [remainingMs, setRemainingMs] = useState(difficulty.bubbleDurationMs);
  const [air, setAir] = useState(ROUND_AIR_RULES.startingAir);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const accuracy = totalQuestions === 0 ? 0 : correctAnswers / totalQuestions;
  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
  const lastShortcutKey =
    ANSWER_SHORTCUT_KEYS[Math.max(0, question.choices.length - 1)] ?? ANSWER_SHORTCUT_KEYS[0];
  const answerHint = prefersReducedMotion
    ? `Reduced motion keeps answers still. Tap or press 1-${lastShortcutKey}. Use arrow keys to move focus and Enter to choose.`
    : `Tap a bubble or press 1-${lastShortcutKey}. Use arrow keys to move focus and Enter to choose.`;
  const answerSurfaceDescription = feedback ? `${answerHelpId} ${feedbackId}` : answerHelpId;

  function focusChoiceByIndex(index: number) {
    if (question.choices.length === 0) {
      return;
    }

    const normalizedIndex =
      ((index % question.choices.length) + question.choices.length) % question.choices.length;

    choiceRefs.current[normalizedIndex]?.focus();
  }

  function getFocusedChoiceIndex() {
    return choiceRefs.current.findIndex((button) => button === document.activeElement);
  }

  function finishRound(finalAir: number) {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;

    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
    }

    const roundedElapsedSeconds = Math.max(1, Math.round(elapsedSeconds));

    onFinish(
      {
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
        score: Math.max(0, Math.round(score + finalAir * 0.5)),
        correctAnswers,
        totalQuestions,
        longestStreak,
        elapsedSeconds: roundedElapsedSeconds,
        accuracy
      },
      attemptsRef.current
    );
  }

  function queueNextQuestion() {
    advanceTimeoutRef.current = window.setTimeout(() => {
      if (finishedRef.current) {
        return;
      }

      setQuestion(generateQuestion(settings));
      setRemainingMs(difficulty.bubbleDurationMs);
      setLocked(false);
      setFeedback(null);
    }, ROUND_NEXT_QUESTION_DELAY_MS);
  }

  function recordAttempt(correct: boolean) {
    attemptsRef.current.push({
      key: question.factKey,
      operation: question.operation,
      operandA: question.operandA,
      operandB: question.operandB,
      displayLabel: question.displayLabel,
      correct,
      answeredAt: new Date().toISOString()
    });
  }

  function resolveQuestion(result: "correct" | "wrong" | "miss") {
    if (locked || finishedRef.current) {
      return;
    }

    setLocked(true);
    setTotalQuestions((current) => current + 1);

    if (result === "correct") {
      recordAttempt(true);
      setCorrectAnswers((current) => current + 1);
      setScore((current) => current + 18);
      setStreak((current) => {
        const next = current + 1;
        setLongestStreak((best) => Math.max(best, next));
        return next;
      });
      setAir((current) => clamp(current + ROUND_AIR_RULES.correctAirGain, 0, 100));
      setFeedback("Correct! Air restored.");
    } else {
      recordAttempt(false);
      setStreak(0);
      setAir((current) =>
        clamp(
          current -
            (result === "miss"
              ? ROUND_AIR_RULES.missedAirPenalty
              : ROUND_AIR_RULES.wrongAirPenalty),
          0,
          100
        )
      );
      setFeedback(result === "miss" ? "Missed bubble. Air slipping away." : "Wrong bubble. Air lost.");
    }

    queueNextQuestion();
  }

  useEffect(() => {
    const airDrainPerTick =
      difficulty.airDrainPerSecond * (ROUND_AIR_DRAIN_INTERVAL_MS / 1000);
    const airInterval = window.setInterval(() => {
      setAir((current) => clamp(current - airDrainPerTick, 0, 100));
      setElapsedSeconds((Date.now() - startedAtRef.current) / 1000);
    }, ROUND_AIR_DRAIN_INTERVAL_MS);

    return () => window.clearInterval(airInterval);
  }, [difficulty.airDrainPerSecond]);

  useEffect(() => {
    if (locked) {
      return undefined;
    }

    const questionInterval = window.setInterval(() => {
      setRemainingMs((current) => Math.max(0, current - 100));
    }, 100);

    return () => window.clearInterval(questionInterval);
  }, [locked, question.factKey]);

  useEffect(() => {
    if (remainingMs === 0 && !locked) {
      resolveQuestion("miss");
    }
  }, [locked, remainingMs]);

  useEffect(() => {
    if (air <= 0) {
      finishRound(0);
    }
  }, [air]);

  useEffect(() => {
    if (locked || question.choices.length === 0) {
      return;
    }

    focusChoiceByIndex(0);
  }, [locked, question.choices.length, question.factKey, prefersReducedMotion]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        locked ||
        finishedRef.current ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableElement(event.target)
      ) {
        return;
      }

      const shortcutIndex = ANSWER_SHORTCUT_KEYS.indexOf(
        event.key as (typeof ANSWER_SHORTCUT_KEYS)[number]
      );

      if (shortcutIndex >= 0 && shortcutIndex < question.choices.length) {
        event.preventDefault();
        focusChoiceByIndex(shortcutIndex);
        const selectedChoice = question.choices[shortcutIndex];
        resolveQuestion(selectedChoice.isCorrect ? "correct" : "wrong");
        return;
      }

      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowDown" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowUp" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === "Home") {
        focusChoiceByIndex(0);
        return;
      }

      if (event.key === "End") {
        focusChoiceByIndex(question.choices.length - 1);
        return;
      }

      const currentIndex = getFocusedChoiceIndex();
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const fallbackIndex = step > 0 ? 0 : question.choices.length - 1;
      focusChoiceByIndex(currentIndex === -1 ? fallbackIndex : currentIndex + step);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [locked, question.choices, question.factKey]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const timerPercent = useMemo(
    () => clamp((remainingMs / difficulty.bubbleDurationMs) * 100, 0, 100),
    [difficulty.bubbleDurationMs, remainingMs]
  );

  return (
    <section className="game-shell">
      <div className="hud panel">
        <div>
          <p className="eyebrow">Current Diver</p>
          <h2>{profileName}</h2>
        </div>

        <div className="hud-stats">
          <div>
            <span>Score</span>
            <strong>{Math.round(score)}</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>{streak}</strong>
          </div>
          <div>
            <span>Accuracy</span>
            <strong>{Math.round(accuracy * 100)}%</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{Math.round(elapsedSeconds)}s</strong>
          </div>
        </div>

        <div className="hud-actions">
          <div className="air-meter">
            <span>Air</span>
            <div
              aria-label="Remaining air"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(air)}
              className="air-meter__track"
              role="progressbar"
            >
              <div className="air-meter__fill" style={{ width: `${air}%` }} />
            </div>
            <strong>{Math.round(air)}</strong>
          </div>
          <button className="ghost-button game-action-button" onClick={onExit} type="button">
            Leave dive
          </button>
        </div>
      </div>

      <div className="game-panel panel">
        <div className="question-header">
          <div>
            <p className="eyebrow">Answer before the bubbles rise away</p>
            <h1>{question.prompt}</h1>
          </div>
          <div className="timer-pill">
            <div className="timer-pill__copy">
              <span>Bubble clock</span>
              <strong>{remainingSeconds}s left</strong>
            </div>
            <div
              aria-label="Time left for this question"
              aria-valuemax={difficulty.bubbleDurationMs}
              aria-valuemin={0}
              aria-valuenow={remainingMs}
              className="timer-pill__track"
              role="progressbar"
            >
              <div className="timer-pill__fill" style={{ width: `${timerPercent}%` }} />
            </div>
          </div>
        </div>

        <p className="game-surface-hint" id={answerHelpId}>
          {answerHint}
        </p>

        {feedback ? (
          <p aria-live="polite" className="feedback-banner" id={feedbackId} role="status">
            {feedback}
          </p>
        ) : null}

        {prefersReducedMotion ? (
          <div
            aria-describedby={answerSurfaceDescription}
            aria-label="Answer choices"
            className="reduced-motion-grid"
            role="group"
          >
            {question.choices.map((choice, index) => (
              <button
                aria-keyshortcuts={ANSWER_SHORTCUT_KEYS[index]}
                className="reduced-motion-choice game-answer-choice"
                disabled={locked}
                key={`${question.factKey}-${choice.value}`}
                onClick={() => resolveQuestion(choice.isCorrect ? "correct" : "wrong")}
                ref={(element) => {
                  choiceRefs.current[index] = element;
                }}
                type="button"
              >
                <span aria-hidden="true" className="choice-shortcut">
                  {ANSWER_SHORTCUT_KEYS[index]}
                </span>
                <span className="choice-value">{choice.value}</span>
              </button>
            ))}
          </div>
        ) : (
          <div
            aria-describedby={answerSurfaceDescription}
            aria-label="Answer bubbles"
            className="bubble-field"
            role="group"
          >
            {question.choices.map((choice, index) => (
              <button
                aria-keyshortcuts={ANSWER_SHORTCUT_KEYS[index]}
                className="answer-bubble game-answer-choice"
                disabled={locked}
                key={`${question.factKey}-${choice.value}`}
                onClick={() => resolveQuestion(choice.isCorrect ? "correct" : "wrong")}
                ref={(element) => {
                  choiceRefs.current[index] = element;
                }}
                style={
                  {
                    "--bubble-duration": `${difficulty.bubbleDurationMs}ms`,
                    "--bubble-left": `${choice.bubbleX}%`,
                    "--bubble-y": `${choice.bubbleY}%`,
                    "--bubble-size": `${choice.bubbleSize}px`
                  } as CSSProperties
                }
                type="button"
              >
                <span aria-hidden="true" className="choice-shortcut">
                  {ANSWER_SHORTCUT_KEYS[index]}
                </span>
                <span className="choice-value">{choice.value}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
