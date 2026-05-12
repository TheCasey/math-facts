import { createEmptyAppState, createEmptyProfileState } from "./defaults";
import type { FactAttempt, PersistedAppState, ProfileState, SessionSummary, StudentProfile } from "./types";

const STORAGE_KEY = "underwater-math-facts.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadAppState(): PersistedAppState {
  if (!canUseStorage()) {
    return createEmptyAppState();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createEmptyAppState();
  }

  try {
    const parsed = JSON.parse(stored) as PersistedAppState;

    if (!parsed.profiles || !parsed.profileData) {
      return createEmptyAppState();
    }

    return parsed;
  } catch {
    return createEmptyAppState();
  }
}

export function saveAppState(appState: PersistedAppState): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

export function ensureProfileState(appState: PersistedAppState, profileId: string): ProfileState {
  return appState.profileData[profileId] ?? createEmptyProfileState();
}

export function createProfile(name: string): StudentProfile {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    lastPlayedAt: null
  };
}

export function addProfile(appState: PersistedAppState, profile: StudentProfile): PersistedAppState {
  return {
    ...appState,
    activeProfileId: profile.id,
    profiles: [...appState.profiles, profile],
    profileData: {
      ...appState.profileData,
      [profile.id]: createEmptyProfileState()
    }
  };
}

export function renameProfile(appState: PersistedAppState, profileId: string, name: string): PersistedAppState {
  return {
    ...appState,
    profiles: appState.profiles.map((profile) =>
      profile.id === profileId ? { ...profile, name } : profile
    )
  };
}

export function deleteProfile(appState: PersistedAppState, profileId: string): PersistedAppState {
  const remainingProfiles = appState.profiles.filter((profile) => profile.id !== profileId);
  const nextProfileData = { ...appState.profileData };
  delete nextProfileData[profileId];

  return {
    ...appState,
    profiles: remainingProfiles,
    activeProfileId:
      appState.activeProfileId === profileId ? remainingProfiles[0]?.id ?? null : appState.activeProfileId,
    profileData: nextProfileData
  };
}

export function updateProfileState(
  appState: PersistedAppState,
  profileId: string,
  updater: (profileState: ProfileState) => ProfileState
): PersistedAppState {
  const current = ensureProfileState(appState, profileId);

  return {
    ...appState,
    profileData: {
      ...appState.profileData,
      [profileId]: updater(current)
    }
  };
}

export function activateProfile(appState: PersistedAppState, profileId: string): PersistedAppState {
  return {
    ...appState,
    activeProfileId: profileId
  };
}

export function recordSession(
  appState: PersistedAppState,
  profileId: string,
  sessionSummary: SessionSummary,
  factAttempts: FactAttempt[]
): PersistedAppState {
  return {
    ...updateProfileState(appState, profileId, (profileState) => {
      const nextFactStats = { ...profileState.factStats };

      for (const attempt of factAttempts) {
        const existing = nextFactStats[attempt.key];

        nextFactStats[attempt.key] = {
          key: attempt.key,
          operation: attempt.operation,
          operandA: attempt.operandA,
          operandB: attempt.operandB,
          displayLabel: attempt.displayLabel,
          timesSeen: (existing?.timesSeen ?? 0) + 1,
          timesCorrect: (existing?.timesCorrect ?? 0) + (attempt.correct ? 1 : 0),
          currentStreak: attempt.correct ? (existing?.currentStreak ?? 0) + 1 : 0,
          lastPlayedAt: attempt.answeredAt
        };
      }

      return {
        ...profileState,
        bestScore: Math.max(profileState.bestScore, sessionSummary.score),
        factStats: nextFactStats,
        sessions: [sessionSummary, ...profileState.sessions].slice(0, 25)
      };
    }),
    profiles: appState.profiles.map((profile) =>
      profile.id === profileId
        ? { ...profile, lastPlayedAt: sessionSummary.completedAt }
        : profile
    )
  };
}

