import { act, fireEvent, render, screen } from "@testing-library/react";
import { createDefaultSettings } from "../../lib/game/defaults";
import { ROUND_NEXT_QUESTION_DELAY_MS, type GeneratedQuestion } from "../../lib/game/types";

const { generateQuestionMock } = vi.hoisted(() => ({
  generateQuestionMock: vi.fn()
}));

vi.mock("../../lib/game/questions", () => ({
  generateQuestion: generateQuestionMock
}));

import { GameScreen } from "./GameScreen";

function setReducedMotionPreference(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation(
      (query: string) =>
        ({
          matches,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn()
        }) as MediaQueryList
    )
  });
}

function createQuestion(
  factKey: string,
  prompt: string,
  choices: Array<{ value: number; isCorrect: boolean }>
): GeneratedQuestion {
  return {
    operation: "add",
    operandA: 2,
    operandB: 2,
    correctAnswer: choices.find((choice) => choice.isCorrect)?.value ?? choices[0].value,
    prompt,
    factKey,
    displayLabel: prompt.replace(" = ?", ""),
    choices: choices.map((choice, index) => ({
      ...choice,
      bubbleX: 16 + index * 24,
      bubbleY: index % 2 === 0 ? 5 : 26,
      bubbleSize: 110
    }))
  };
}

describe("GameScreen input hardening", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    generateQuestionMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("focuses the answer surface and supports arrow-key movement in the bubble field", async () => {
    setReducedMotionPreference(false);
    generateQuestionMock.mockReturnValue(
      createQuestion("add:2:2", "2 + 2 = ?", [
        { value: 3, isCorrect: false },
        { value: 4, isCorrect: true },
        { value: 5, isCorrect: false }
      ])
    );

    render(
      <GameScreen
        onExit={vi.fn()}
        onFinish={vi.fn()}
        profileName="Kai"
        settings={createDefaultSettings()}
      />
    );

    const firstChoice = screen.getByRole("button", { name: "3" });
    const secondChoice = screen.getByRole("button", { name: "4" });
    const lastChoice = screen.getByRole("button", { name: "5" });

    expect(firstChoice).toHaveFocus();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(secondChoice).toHaveFocus();

    fireEvent.keyDown(window, { key: "End" });
    expect(lastChoice).toHaveFocus();

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(secondChoice).toHaveFocus();
  });

  it("uses number shortcuts and restores focus after advancing to the next reduced-motion question", async () => {
    setReducedMotionPreference(true);
    generateQuestionMock
      .mockReturnValueOnce(
        createQuestion("add:2:2", "2 + 2 = ?", [
          { value: 3, isCorrect: false },
          { value: 4, isCorrect: true },
          { value: 5, isCorrect: false }
        ])
      )
      .mockReturnValue(
        createQuestion("add:5:3", "5 + 3 = ?", [
          { value: 8, isCorrect: true },
          { value: 7, isCorrect: false },
          { value: 9, isCorrect: false }
        ])
      );

    render(
      <GameScreen
        onExit={vi.fn()}
        onFinish={vi.fn()}
        profileName="Kai"
        settings={createDefaultSettings()}
      />
    );

    expect(screen.getByText(/reduced motion keeps answers still/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "2" });

    expect(screen.getByRole("status")).toHaveTextContent("Correct! Air restored.");

    act(() => {
      vi.advanceTimersByTime(ROUND_NEXT_QUESTION_DELAY_MS);
    });

    expect(screen.getByRole("heading", { name: "5 + 3 = ?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "8" })).toHaveFocus();
  });
});
