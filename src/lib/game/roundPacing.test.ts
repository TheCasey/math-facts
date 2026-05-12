import {
  DIFFICULTY_CONFIG,
  ROUND_AIR_DRAIN_INTERVAL_MS,
  ROUND_AIR_RULES,
  ROUND_NEXT_QUESTION_DELAY_MS,
  type Difficulty
} from "./types";

const MODERATE_CORRECT_RESPONSE_SHARE = 0.6;

interface TickAlignedDelta {
  elapsedMs: number;
  fewestTicks: number;
  mostTicks: number;
  bestCaseDelta: number;
  worstCaseDelta: number;
}

function getAirDrainPerTick(difficulty: Difficulty) {
  return DIFFICULTY_CONFIG[difficulty].airDrainPerSecond * (ROUND_AIR_DRAIN_INTERVAL_MS / 1000);
}

function getTickCountRange(elapsedMs: number) {
  return {
    fewestTicks: Math.floor(elapsedMs / ROUND_AIR_DRAIN_INTERVAL_MS),
    mostTicks: Math.ceil(elapsedMs / ROUND_AIR_DRAIN_INTERVAL_MS)
  };
}

function getTickAlignedCorrectResponseDelta(
  difficulty: Difficulty,
  elapsedShare: number,
  includeLockedDelay = true
): TickAlignedDelta {
  const config = DIFFICULTY_CONFIG[difficulty];
  const elapsedMs =
    config.bubbleDurationMs * elapsedShare +
    (includeLockedDelay ? ROUND_NEXT_QUESTION_DELAY_MS : 0);
  const tickCounts = getTickCountRange(elapsedMs);
  const drainPerTick = getAirDrainPerTick(difficulty);

  return {
    elapsedMs,
    ...tickCounts,
    bestCaseDelta: ROUND_AIR_RULES.correctAirGain - tickCounts.fewestTicks * drainPerTick,
    worstCaseDelta: ROUND_AIR_RULES.correctAirGain - tickCounts.mostTicks * drainPerTick
  };
}

function getWorstAlignedNetPositiveResponseWindowMs(difficulty: Difficulty) {
  const maxSafeTicks = Math.floor(ROUND_AIR_RULES.correctAirGain / getAirDrainPerTick(difficulty));

  return maxSafeTicks * ROUND_AIR_DRAIN_INTERVAL_MS - ROUND_NEXT_QUESTION_DELAY_MS;
}

function getFullBubbleDrain(difficulty: Difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const { mostTicks } = getTickCountRange(config.bubbleDurationMs);

  return mostTicks * getAirDrainPerTick(difficulty);
}

describe("round pacing", () => {
  it("models passive drain in the same 100 ms ticks as the live loop", () => {
    const responseOnlyDelta = getTickAlignedCorrectResponseDelta(
      "medium",
      MODERATE_CORRECT_RESPONSE_SHARE,
      false
    );
    const liveLoopDelta = getTickAlignedCorrectResponseDelta(
      "medium",
      MODERATE_CORRECT_RESPONSE_SHARE
    );
    const drainPerTick = getAirDrainPerTick("medium");

    expect(liveLoopDelta.elapsedMs).toBe(responseOnlyDelta.elapsedMs + ROUND_NEXT_QUESTION_DELAY_MS);
    expect(responseOnlyDelta.fewestTicks).toBe(39);
    expect(responseOnlyDelta.mostTicks).toBe(39);
    expect(liveLoopDelta.fewestTicks).toBe(43);
    expect(liveLoopDelta.mostTicks).toBe(44);
    expect(liveLoopDelta.bestCaseDelta).toBeCloseTo(
      ROUND_AIR_RULES.correctAirGain - 43 * drainPerTick,
      5
    );
    expect(liveLoopDelta.worstCaseDelta).toBeCloseTo(
      ROUND_AIR_RULES.correctAirGain - 44 * drainPerTick,
      5
    );
  });

  it("keeps easy and medium non-negative for a moderate correct answer across tick alignments", () => {
    const easy = getTickAlignedCorrectResponseDelta("easy", MODERATE_CORRECT_RESPONSE_SHARE);
    const medium = getTickAlignedCorrectResponseDelta("medium", MODERATE_CORRECT_RESPONSE_SHARE);
    const hard = getTickAlignedCorrectResponseDelta("hard", MODERATE_CORRECT_RESPONSE_SHARE);
    const challenge = getTickAlignedCorrectResponseDelta(
      "challenge",
      MODERATE_CORRECT_RESPONSE_SHARE
    );

    expect(easy.worstCaseDelta).toBeGreaterThan(medium.worstCaseDelta);
    expect(easy.worstCaseDelta).toBeGreaterThan(0);
    expect(medium.worstCaseDelta).toBeGreaterThanOrEqual(0);
    expect(hard.bestCaseDelta).toBeLessThan(0);
    expect(challenge.bestCaseDelta).toBeLessThan(0);
  });

  it("keeps the tick-aligned net-positive answer window descending by difficulty", () => {
    const mediumWindow = getWorstAlignedNetPositiveResponseWindowMs("medium");
    const hardWindow = getWorstAlignedNetPositiveResponseWindowMs("hard");
    const challengeWindow = getWorstAlignedNetPositiveResponseWindowMs("challenge");

    expect(getWorstAlignedNetPositiveResponseWindowMs("easy")).toBeGreaterThan(mediumWindow);
    expect(mediumWindow).toBeGreaterThan(hardWindow);
    expect(hardWindow).toBeGreaterThan(challengeWindow);
    expect(mediumWindow - hardWindow).toBeGreaterThanOrEqual(1000);
    expect(mediumWindow - challengeWindow).toBeGreaterThanOrEqual(1000);
  });

  it("still applies more passive pressure as difficulty rises", () => {
    expect(getFullBubbleDrain("easy")).toBeLessThan(getFullBubbleDrain("medium"));
    expect(getFullBubbleDrain("medium")).toBeLessThan(getFullBubbleDrain("hard"));
    expect(getFullBubbleDrain("medium")).toBeLessThan(getFullBubbleDrain("challenge"));
    expect(DIFFICULTY_CONFIG.easy.bubbleDurationMs).toBeGreaterThan(
      DIFFICULTY_CONFIG.medium.bubbleDurationMs
    );
    expect(DIFFICULTY_CONFIG.medium.bubbleDurationMs).toBeGreaterThan(
      DIFFICULTY_CONFIG.hard.bubbleDurationMs
    );
    expect(DIFFICULTY_CONFIG.hard.bubbleDurationMs).toBeGreaterThan(
      DIFFICULTY_CONFIG.challenge.bubbleDurationMs
    );
  });
});
