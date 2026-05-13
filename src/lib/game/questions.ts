import {
  DIFFICULTY_CONFIG,
  OPERATION_SYMBOLS,
  type GameSettings,
  type GeneratedQuestion,
  type Operation,
  type QuestionChoice
} from "./types";
import { getEnabledOperations } from "./defaults";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sampleOperation(settings: GameSettings): Operation {
  const enabledOperations = getEnabledOperations(settings);

  if (enabledOperations.length === 0) {
    throw new Error("At least one operation must be enabled to generate a question.");
  }

  return enabledOperations[randomInt(0, enabledOperations.length - 1)];
}

export function buildFactKey(operation: Operation, operandA: number, operandB: number): string {
  if (operation === "add" || operation === "multiply") {
    const [left, right] = [operandA, operandB].sort((a, b) => a - b);
    return `${operation}:${left}:${right}`;
  }

  return `${operation}:${operandA}:${operandB}`;
}

export function buildFactLabel(operation: Operation, operandA: number, operandB: number): string {
  return `${operandA} ${OPERATION_SYMBOLS[operation]} ${operandB}`;
}

function createAddQuestion(min: number, max: number) {
  const operandA = randomInt(min, max);
  const operandB = randomInt(min, max);

  return {
    operandA,
    operandB,
    correctAnswer: operandA + operandB
  };
}

function createSubtractQuestion(min: number, max: number) {
  const first = randomInt(min, max);
  const second = randomInt(min, max);
  const operandA = Math.max(first, second);
  const operandB = Math.min(first, second);

  return {
    operandA,
    operandB,
    correctAnswer: operandA - operandB
  };
}

function createMultiplyQuestion(min: number, max: number) {
  const operandA = randomInt(min, max);
  const operandB = randomInt(min, max);

  return {
    operandA,
    operandB,
    correctAnswer: operandA * operandB
  };
}

function createDivideQuestion(min: number, max: number) {
  const divisorMin = Math.max(1, min);
  const divisor = randomInt(divisorMin, max);
  const quotient = randomInt(divisorMin, max);
  const dividend = divisor * quotient;

  return {
    operandA: dividend,
    operandB: divisor,
    correctAnswer: quotient
  };
}

function addDistractorCandidate(
  distractors: Set<number>,
  correctAnswer: number,
  candidate: number
) {
  if (!Number.isInteger(candidate) || candidate < 0 || candidate === correctAnswer) {
    return;
  }

  distractors.add(candidate);
}

function addAdditionDistractors(
  distractors: Set<number>,
  operandA: number,
  operandB: number,
  correctAnswer: number
) {
  if (operandA - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA - 1 + operandB);
  }

  addDistractorCandidate(distractors, correctAnswer, operandA + 1 + operandB);

  if (operandB - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA + operandB - 1);
  }

  addDistractorCandidate(distractors, correctAnswer, operandA + operandB + 1);

  if (operandA - 2 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA - 2 + operandB);
  }

  addDistractorCandidate(distractors, correctAnswer, operandA + 2 + operandB);

  if (operandB - 2 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA + operandB - 2);
  }

  addDistractorCandidate(distractors, correctAnswer, operandA + operandB + 2);

  addDistractorCandidate(distractors, correctAnswer, operandA + operandA);
  addDistractorCandidate(distractors, correctAnswer, operandB + operandB);
}

function addSubtractionDistractors(
  distractors: Set<number>,
  operandA: number,
  operandB: number,
  correctAnswer: number
) {
  if (operandA - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA - 1 - operandB);
  }

  addDistractorCandidate(distractors, correctAnswer, operandA + 1 - operandB);

  if (operandB - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA - (operandB - 1));
  }

  addDistractorCandidate(distractors, correctAnswer, operandA - (operandB + 1));

  if (operandA - 2 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA - 2 - operandB);
  }

  addDistractorCandidate(distractors, correctAnswer, operandA + 2 - operandB);

  if (operandB - 2 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA - (operandB - 2));
  }

  addDistractorCandidate(distractors, correctAnswer, operandA - (operandB + 2));
  addDistractorCandidate(distractors, correctAnswer, operandB);
  addDistractorCandidate(distractors, correctAnswer, operandA);
}

function addMultiplicationDistractors(
  distractors: Set<number>,
  operandA: number,
  operandB: number,
  correctAnswer: number
) {
  if (operandA - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, (operandA - 1) * operandB);
  }

  addDistractorCandidate(distractors, correctAnswer, (operandA + 1) * operandB);

  if (operandB - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA * (operandB - 1));
  }

  addDistractorCandidate(distractors, correctAnswer, operandA * (operandB + 1));

  if (operandA - 2 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, (operandA - 2) * operandB);
  }

  addDistractorCandidate(distractors, correctAnswer, (operandA + 2) * operandB);

  if (operandB - 2 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandA * (operandB - 2));
  }

  addDistractorCandidate(distractors, correctAnswer, operandA * (operandB + 2));
  addDistractorCandidate(distractors, correctAnswer, operandA + operandB);
}

function addDivisionDistractors(
  distractors: Set<number>,
  operandA: number,
  operandB: number,
  correctAnswer: number
) {
  addDistractorCandidate(distractors, correctAnswer, (operandA - operandB) / operandB);
  addDistractorCandidate(distractors, correctAnswer, (operandA + operandB) / operandB);
  addDistractorCandidate(distractors, correctAnswer, (operandA - 2 * operandB) / operandB);
  addDistractorCandidate(distractors, correctAnswer, (operandA + 2 * operandB) / operandB);
  addDistractorCandidate(distractors, correctAnswer, operandB);

  if (operandB - 1 >= 0) {
    addDistractorCandidate(distractors, correctAnswer, operandB - 1);
  }

  addDistractorCandidate(distractors, correctAnswer, operandB + 1);
}

function addOperationAwareDistractors(
  distractors: Set<number>,
  operation: Operation,
  operandA: number,
  operandB: number,
  correctAnswer: number
) {
  switch (operation) {
    case "add":
      addAdditionDistractors(distractors, operandA, operandB, correctAnswer);
      break;
    case "subtract":
      addSubtractionDistractors(distractors, operandA, operandB, correctAnswer);
      break;
    case "multiply":
      addMultiplicationDistractors(distractors, operandA, operandB, correctAnswer);
      break;
    case "divide":
      addDivisionDistractors(distractors, operandA, operandB, correctAnswer);
      break;
  }
}

function addFallbackDistractors(
  distractors: Set<number>,
  correctAnswer: number,
  targetCount: number
) {
  let offset = 1;

  while (distractors.size < targetCount) {
    const lower = correctAnswer - offset;

    if (lower >= 0) {
      distractors.add(lower);
    }

    if (distractors.size >= targetCount) {
      break;
    }

    distractors.add(correctAnswer + offset);
    offset += 1;
  }
}

export function buildDistractorValues(
  operation: Operation,
  operandA: number,
  operandB: number,
  correctAnswer: number,
  choiceCount: number
): number[] {
  const targetCount = Math.max(0, choiceCount - 1);
  const distractors = new Set<number>();

  // Start with operation-shaped mistakes, then fill any remaining slots with nearby values.
  addOperationAwareDistractors(distractors, operation, operandA, operandB, correctAnswer);
  addFallbackDistractors(distractors, correctAnswer, targetCount);

  return [...distractors].slice(0, targetCount);
}

export function buildBubbleLayout(
  choiceCount: number
): Array<Pick<QuestionChoice, "bubbleX" | "bubbleY">> {
  const layoutPresets: Record<number, Array<Pick<QuestionChoice, "bubbleX" | "bubbleY">>> = {
    3: [
      { bubbleX: 18, bubbleY: 5 },
      { bubbleX: 50, bubbleY: 18 },
      { bubbleX: 82, bubbleY: 5 }
    ],
    4: [
      { bubbleX: 24, bubbleY: 5 },
      { bubbleX: 76, bubbleY: 5 },
      { bubbleX: 24, bubbleY: 32 },
      { bubbleX: 76, bubbleY: 32 }
    ],
    5: [
      { bubbleX: 18, bubbleY: 5 },
      { bubbleX: 50, bubbleY: 5 },
      { bubbleX: 82, bubbleY: 5 },
      { bubbleX: 34, bubbleY: 32 },
      { bubbleX: 66, bubbleY: 32 }
    ],
    6: [
      { bubbleX: 18, bubbleY: 5 },
      { bubbleX: 50, bubbleY: 5 },
      { bubbleX: 82, bubbleY: 5 },
      { bubbleX: 18, bubbleY: 32 },
      { bubbleX: 50, bubbleY: 32 },
      { bubbleX: 82, bubbleY: 32 }
    ]
  };

  const preset = layoutPresets[choiceCount];

  if (preset) {
    return preset;
  }

  return Array.from({ length: choiceCount }, (_, index) => {
    const spread = choiceCount <= 1 ? 0 : index / (choiceCount - 1);
    return {
      bubbleX: clamp(16 + spread * 68, 14, 86),
      bubbleY: index % 2 === 0 ? 6 : 28
    };
  });
}

function createBubbleChoices(
  operation: Operation,
  operandA: number,
  operandB: number,
  correctAnswer: number,
  choiceCount: number
): QuestionChoice[] {
  const candidateAnswers = [
    correctAnswer,
    ...buildDistractorValues(operation, operandA, operandB, correctAnswer, choiceCount)
  ];
  const shuffled = [...candidateAnswers].sort(() => Math.random() - 0.5);
  const bubbleLayout = buildBubbleLayout(shuffled.length);

  return shuffled.map((value, index) => ({
    value,
    isCorrect: value === correctAnswer,
    bubbleX: bubbleLayout[index]?.bubbleX ?? 50,
    bubbleY: bubbleLayout[index]?.bubbleY ?? 8,
    bubbleSize: randomInt(96, 112)
  }));
}

export function generateQuestion(settings: GameSettings): GeneratedQuestion {
  const operation = sampleOperation(settings);
  const { min, max } = settings.operations[operation];
  const difficulty = DIFFICULTY_CONFIG[settings.difficulty];

  let payload: { operandA: number; operandB: number; correctAnswer: number };

  switch (operation) {
    case "add":
      payload = createAddQuestion(min, max);
      break;
    case "subtract":
      payload = createSubtractQuestion(min, max);
      break;
    case "multiply":
      payload = createMultiplyQuestion(min, max);
      break;
    case "divide":
      payload = createDivideQuestion(min, max);
      break;
  }

  const displayLabel = buildFactLabel(operation, payload.operandA, payload.operandB);

  return {
    operation,
    operandA: payload.operandA,
    operandB: payload.operandB,
    correctAnswer: payload.correctAnswer,
    prompt: `${displayLabel} = ?`,
    factKey: buildFactKey(operation, payload.operandA, payload.operandB),
    displayLabel,
    choices: createBubbleChoices(
      operation,
      payload.operandA,
      payload.operandB,
      payload.correctAnswer,
      difficulty.choiceCount
    )
  };
}
