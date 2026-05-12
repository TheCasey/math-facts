import { ABSOLUTE_MAX, DEFAULT_RANGE_MIN, OPERATION_LABELS, type FactStats, type MasteryFactSummary, type Operation, type OperationInsight, type ProfileState, type RangeSettings } from "./types";
import { buildFactKey } from "./questions";

const MIN_SEEN_FOR_MASTERY = 10;
const MIN_STREAK_FOR_MASTERY = 5;
const MIN_ACCURACY_FOR_MASTERY = 0.9;

function summarizeFact(stats: FactStats): MasteryFactSummary {
  const accuracy = stats.timesSeen === 0 ? 0 : stats.timesCorrect / stats.timesSeen;

  return {
    ...stats,
    accuracy,
    mastered:
      stats.timesSeen >= MIN_SEEN_FOR_MASTERY &&
      accuracy >= MIN_ACCURACY_FOR_MASTERY &&
      stats.currentStreak >= MIN_STREAK_FOR_MASTERY
  };
}

function createRequiredFactKeys(operation: Operation, upperBound: number): string[] {
  const keys = new Set<string>();
  const lowerBound = DEFAULT_RANGE_MIN[operation];

  if (operation === "add") {
    for (let left = lowerBound; left <= upperBound; left += 1) {
      for (let right = lowerBound; right <= upperBound; right += 1) {
        keys.add(buildFactKey(operation, left, right));
      }
    }
  }

  if (operation === "subtract") {
    for (let left = lowerBound; left <= upperBound; left += 1) {
      for (let right = lowerBound; right <= left; right += 1) {
        keys.add(buildFactKey(operation, left, right));
      }
    }
  }

  if (operation === "multiply") {
    for (let left = lowerBound; left <= upperBound; left += 1) {
      for (let right = lowerBound; right <= upperBound; right += 1) {
        keys.add(buildFactKey(operation, left, right));
      }
    }
  }

  if (operation === "divide") {
    for (let divisor = lowerBound; divisor <= upperBound; divisor += 1) {
      for (let quotient = lowerBound; quotient <= upperBound; quotient += 1) {
        keys.add(buildFactKey(operation, divisor * quotient, divisor));
      }
    }
  }

  return [...keys];
}

function deriveHighestMasteredRange(operation: Operation, summaries: Record<string, MasteryFactSummary>): number | null {
  let highest: number | null = null;

  for (let upper = DEFAULT_RANGE_MIN[operation]; upper <= ABSOLUTE_MAX; upper += 1) {
    const factKeys = createRequiredFactKeys(operation, upper);
    const masteredRange = factKeys.every((factKey) => summaries[factKey]?.mastered);

    if (!masteredRange) {
      break;
    }

    highest = upper;
  }

  return highest;
}

function deriveRecommendedRange(operation: Operation, highestMasteredRange: number | null): RangeSettings {
  const min = DEFAULT_RANGE_MIN[operation];
  const max = Math.min((highestMasteredRange ?? min) + 1, ABSOLUTE_MAX);

  return { min, max };
}

function sortFacts(facts: MasteryFactSummary[]): MasteryFactSummary[] {
  return [...facts].sort((left, right) => {
    if (left.mastered !== right.mastered) {
      return Number(right.mastered) - Number(left.mastered);
    }

    if (left.accuracy !== right.accuracy) {
      return right.accuracy - left.accuracy;
    }

    return right.currentStreak - left.currentStreak;
  });
}

export function deriveOperationInsight(operation: Operation, profileState: ProfileState): OperationInsight {
  const facts = Object.values(profileState.factStats)
    .filter((fact) => fact.operation === operation)
    .map(summarizeFact);

  const totalSeen = facts.reduce((total, fact) => total + fact.timesSeen, 0);
  const totalCorrect = facts.reduce((total, fact) => total + fact.timesCorrect, 0);
  const summariesByKey = Object.fromEntries(facts.map((fact) => [fact.key, fact]));
  const highestMasteredRange = deriveHighestMasteredRange(operation, summariesByKey);
  const strongestFacts = sortFacts(facts).slice(0, 5);
  const weakestFacts = [...facts]
    .sort((left, right) => {
      if (left.accuracy !== right.accuracy) {
        return left.accuracy - right.accuracy;
      }

      return right.timesSeen - left.timesSeen;
    })
    .slice(0, 5);

  return {
    operation,
    accuracy: totalSeen === 0 ? 0 : totalCorrect / totalSeen,
    highestMasteredRange,
    recommendedNextRange: deriveRecommendedRange(operation, highestMasteredRange),
    masteredFacts: facts.filter((fact) => fact.mastered).length,
    seenFacts: facts.length,
    strongestFacts,
    weakestFacts
  };
}

export function formatInsightHeadline(insight: OperationInsight): string {
  const label = OPERATION_LABELS[insight.operation];

  if (insight.highestMasteredRange === null) {
    return `${label} is just getting started.`;
  }

  return `${label} mastered through ${insight.highestMasteredRange}.`;
}

