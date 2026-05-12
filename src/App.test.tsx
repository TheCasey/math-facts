import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultSettings } from "./lib/game/defaults";
import type { GameSettings, PersistedAppState } from "./lib/game/types";

vi.mock("./features/setup/SetupScreen", () => ({
  SetupScreen: ({ onStartGame }: { onStartGame: () => void }) => (
    <button type="button" onClick={onStartGame}>
      Bypass start guard
    </button>
  )
}));

vi.mock("./features/game/GameScreen", () => ({
  GameScreen: () => <div>Game screen reached</div>
}));

import App from "./App";

const STORAGE_KEY = "underwater-math-facts.v1";

function createStoredAppState(settings: GameSettings): PersistedAppState {
  return {
    activeProfileId: "profile-1",
    profiles: [
      {
        id: "profile-1",
        name: "Kai",
        createdAt: "2026-05-11T00:00:00.000Z",
        lastPlayedAt: null
      }
    ],
    profileData: {
      "profile-1": {
        settings,
        bestScore: 0,
        factStats: {},
        sessions: []
      }
    }
  };
}

describe("App start guard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps setup active when a bypassed start action uses invalid settings", async () => {
    const settings = createDefaultSettings();
    settings.operations.add.enabled = false;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createStoredAppState(settings)));

    render(<App />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Bypass start guard" }));

    expect(screen.getByRole("button", { name: "Bypass start guard" })).toBeInTheDocument();
    expect(screen.queryByText("Game screen reached")).not.toBeInTheDocument();
  });

  it("keeps setup active when a bypassed start action uses a min-greater-than-max range", async () => {
    const settings = createDefaultSettings();
    settings.operations.add.min = 12;
    settings.operations.add.max = 6;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createStoredAppState(settings)));

    render(<App />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Bypass start guard" }));

    expect(screen.getByRole("button", { name: "Bypass start guard" })).toBeInTheDocument();
    expect(screen.queryByText("Game screen reached")).not.toBeInTheDocument();
  });

  it("still enters gameplay when settings are valid", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(createStoredAppState(createDefaultSettings()))
    );

    render(<App />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Bypass start guard" }));

    expect(screen.getByText("Game screen reached")).toBeInTheDocument();
  });
});
