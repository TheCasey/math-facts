import { createEmptyProfileState } from "./defaults";
import { deriveOperationInsight } from "./mastery";
import { buildFactKey } from "./questions";
import type { FactStats } from "./types";

function createMasteredFact(key: string, operandA: number, operandB: number): FactStats {
  return {
    key,
    operation: "add",
    operandA,
    operandB,
    displayLabel: `${operandA} + ${operandB}`,
    timesSeen: 10,
    timesCorrect: 10,
    currentStreak: 10,
    lastPlayedAt: new Date().toISOString()
  };
}

describe("deriveOperationInsight", () => {
  it("derives the highest mastered range for addition", () => {
    const profileState = createEmptyProfileState();

    for (let left = 1; left <= 2; left += 1) {
      for (let right = 1; right <= 2; right += 1) {
        const key = buildFactKey("add", left, right);
        profileState.factStats[key] = createMasteredFact(key, left, right);
      }
    }

    const insight = deriveOperationInsight("add", profileState);

    expect(insight.highestMasteredRange).toBe(2);
    expect(insight.recommendedNextRange).toEqual({ min: 1, max: 3 });
  });
});
