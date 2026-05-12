import { createDefaultSettings } from "./defaults";
import { isSettingsValid, validateSettings } from "./validation";

describe("validateSettings", () => {
  it("requires at least one enabled operation", () => {
    const settings = createDefaultSettings();
    settings.operations.add.enabled = false;

    expect(validateSettings(settings).operations).toContain("Choose at least one operation");
  });

  it("rejects ranges where min is greater than max", () => {
    const settings = createDefaultSettings();
    settings.operations.add.enabled = true;
    settings.operations.add.min = 12;
    settings.operations.add.max = 6;

    expect(validateSettings(settings).add).toContain("lowest number");
  });
});

describe("isSettingsValid", () => {
  it("returns false when no operations are enabled", () => {
    const settings = createDefaultSettings();
    settings.operations.add.enabled = false;

    expect(isSettingsValid(settings)).toBe(false);
  });

  it("returns false when an enabled operation has min greater than max", () => {
    const settings = createDefaultSettings();
    settings.operations.add.min = 12;
    settings.operations.add.max = 6;

    expect(isSettingsValid(settings)).toBe(false);
  });

  it("returns true for the default setup", () => {
    expect(isSettingsValid(createDefaultSettings())).toBe(true);
  });
});
