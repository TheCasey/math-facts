import { createDefaultSettings } from "./defaults";
import { buildBubbleLayout, buildDistractorValues, generateQuestion } from "./questions";

describe("buildDistractorValues", () => {
  it("uses nearby addition misses before falling back to wider neighbors", () => {
    expect(buildDistractorValues("add", 8, 7, 15, 6)).toEqual([14, 16, 13, 17, 12]);
  });

  it("uses subtraction-shaped operand mistakes for normal subtraction facts", () => {
    expect(buildDistractorValues("subtract", 12, 5, 7, 6)).toEqual([6, 8, 5, 9, 12]);
  });

  it("keeps subtraction distractors non-negative around zero-difference facts", () => {
    const distractors = buildDistractorValues("subtract", 1, 1, 0, 6);

    expect(distractors).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(distractors).size).toBe(distractors.length);
    expect(distractors.every((value) => value >= 0)).toBe(true);
  });

  it("uses adjacent multiplication facts instead of generic +/- 1 noise", () => {
    expect(buildDistractorValues("multiply", 4, 6, 24, 6)).toEqual([18, 30, 20, 28, 12]);
  });

  it("uses nearby quotient mistakes for division distractors", () => {
    expect(buildDistractorValues("divide", 24, 6, 4, 6)).toEqual([3, 5, 2, 6, 7]);
  });
});

describe("generateQuestion", () => {
  it("creates exact division questions with a valid divisor", () => {
    const settings = createDefaultSettings();
    settings.operations.add.enabled = false;
    settings.operations.divide.enabled = true;
    settings.operations.divide.min = 1;
    settings.operations.divide.max = 10;

    const question = generateQuestion(settings);

    expect(question.operation).toBe("divide");
    expect(question.operandB).toBeGreaterThan(0);
    expect(question.operandA % question.operandB).toBe(0);
    expect(question.correctAnswer).toBe(question.operandA / question.operandB);
  });

  it("matches choice count to the selected difficulty", () => {
    const settings = createDefaultSettings();
    settings.difficulty = "challenge";

    const question = generateQuestion(settings);

    expect(question.choices).toHaveLength(6);
    expect(question.choices.filter((choice) => choice.isCorrect)).toHaveLength(1);
    expect(new Set(question.choices.map((choice) => choice.value)).size).toBe(
      question.choices.length
    );
  });

  it("places challenge bubbles in staggered lanes so answers do not stack", () => {
    const layout = buildBubbleLayout(6);

    expect(layout).toHaveLength(6);
    expect(new Set(layout.map((slot) => `${slot.bubbleX}:${slot.bubbleY}`)).size).toBe(6);
    expect(layout.some((slot) => slot.bubbleY >= 30)).toBe(true);

    for (let leftIndex = 0; leftIndex < layout.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < layout.length; rightIndex += 1) {
        const horizontalGap = Math.abs(layout[leftIndex].bubbleX - layout[rightIndex].bubbleX);
        const verticalGap = Math.abs(layout[leftIndex].bubbleY - layout[rightIndex].bubbleY);

        expect(horizontalGap >= 20 || verticalGap >= 24).toBe(true);
      }
    }
  });
});
