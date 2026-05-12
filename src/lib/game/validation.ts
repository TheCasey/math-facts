import {
  ABSOLUTE_MAX,
  ABSOLUTE_MIN,
  type GameSettings,
  type Operation
} from "./types";
import { getEnabledOperations } from "./defaults";

export type SetupErrors = Partial<Record<Operation, string>> & {
  operations?: string;
};

export function validateSettings(settings: GameSettings): SetupErrors {
  const errors: SetupErrors = {};
  const enabledOperations = getEnabledOperations(settings);

  if (enabledOperations.length === 0) {
    errors.operations = "Choose at least one operation to start a round.";
  }

  for (const operation of enabledOperations) {
    const { min, max } = settings.operations[operation];

    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      errors[operation] = "Use whole numbers for the range.";
      continue;
    }

    if (min < ABSOLUTE_MIN || max > ABSOLUTE_MAX) {
      errors[operation] = `Choose values between ${ABSOLUTE_MIN} and ${ABSOLUTE_MAX}.`;
      continue;
    }

    if (min > max) {
      errors[operation] = "The lowest number cannot be greater than the highest number.";
    }

    if (operation === "divide" && max === 0) {
      errors[operation] = "Division needs a highest number greater than zero.";
    }
  }

  return errors;
}

export function isSettingsValid(settings: GameSettings): boolean {
  return Object.keys(validateSettings(settings)).length === 0;
}

