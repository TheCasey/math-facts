import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createDefaultSettings } from "../../lib/game/defaults";
import { SetupScreen } from "./SetupScreen";

describe("SetupScreen", () => {
  it("prevents the setup start control from firing when no operations are enabled", async () => {
    const settings = createDefaultSettings();
    const onStartGame = vi.fn();

    settings.operations.add.enabled = false;

    render(
      <SetupScreen
        insights={{}}
        onOpenStats={vi.fn()}
        onSettingsChange={vi.fn()}
        onStartGame={onStartGame}
        profileName="Kai"
        settings={settings}
      />
    );

    const startButton = screen.getByRole("button", { name: /start the dive/i });

    expect(screen.getByText(/choose at least one operation to start a round/i)).toBeInTheDocument();
    expect(startButton).toBeDisabled();

    await userEvent.setup().click(startButton);

    expect(onStartGame).not.toHaveBeenCalled();
  });

  it("prevents the setup start control from firing when a selected operation has min greater than max", async () => {
    const settings = createDefaultSettings();
    const onStartGame = vi.fn();

    settings.operations.add.min = 12;
    settings.operations.add.max = 6;

    render(
      <SetupScreen
        insights={{}}
        onOpenStats={vi.fn()}
        onSettingsChange={vi.fn()}
        onStartGame={onStartGame}
        profileName="Kai"
        settings={settings}
      />
    );

    const startButton = screen.getByRole("button", { name: /start the dive/i });

    expect(
      screen.getByText(/lowest number cannot be greater than the highest number/i)
    ).toBeInTheDocument();
    expect(startButton).toBeDisabled();

    await userEvent.setup().click(startButton);

    expect(onStartGame).not.toHaveBeenCalled();
  });
});
