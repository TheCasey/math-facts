import {
  DEFAULT_RANGE_MIN,
  type GameSettings,
  type Operation,
  type PersistedAppState,
  type ProfileState
} from "./types";

export function createDefaultSettings(): GameSettings {
  return {
    difficulty: "easy",
    operations: {
      add: { enabled: true, min: DEFAULT_RANGE_MIN.add, max: 10 },
      subtract: { enabled: false, min: DEFAULT_RANGE_MIN.subtract, max: 10 },
      multiply: { enabled: false, min: DEFAULT_RANGE_MIN.multiply, max: 10 },
      divide: { enabled: false, min: DEFAULT_RANGE_MIN.divide, max: 10 }
    }
  };
}

export function createEmptyProfileState(): ProfileState {
  return {
    settings: createDefaultSettings(),
    bestScore: 0,
    factStats: {},
    sessions: []
  };
}

export function createEmptyAppState(): PersistedAppState {
  return {
    profiles: [],
    activeProfileId: null,
    profileData: {}
  };
}

export function getEnabledOperations(settings: GameSettings): Operation[] {
  return (Object.keys(settings.operations) as Operation[]).filter(
    (operation) => settings.operations[operation].enabled
  );
}

