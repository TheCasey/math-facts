import { useEffect, useMemo, useState } from "react";
import { ProfilePanel } from "./features/profiles/ProfilePanel";
import { GameScreen } from "./features/game/GameScreen";
import { ResultsScreen } from "./features/results/ResultsScreen";
import { SetupScreen } from "./features/setup/SetupScreen";
import { StatsScreen } from "./features/stats/StatsScreen";
import { createProfile, addProfile, activateProfile, deleteProfile, ensureProfileState, loadAppState, recordSession, renameProfile, saveAppState, updateProfileState } from "./lib/game/storage";
import { deriveOperationInsight } from "./lib/game/mastery";
import type { FactAttempt, GameSettings, PersistedAppState, SessionSummary, ViewMode } from "./lib/game/types";
import { isSettingsValid } from "./lib/game/validation";

export default function App() {
  const [appState, setAppState] = useState<PersistedAppState>(() => loadAppState());
  const [view, setView] = useState<ViewMode>("setup");
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [lastResult, setLastResult] = useState<SessionSummary | null>(null);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const activeProfile = appState.profiles.find((profile) => profile.id === appState.activeProfileId) ?? null;
  const activeProfileState = activeProfile ? ensureProfileState(appState, activeProfile.id) : null;

  useEffect(() => {
    if (!activeProfile) {
      setShowProfilePanel(true);
      setView("setup");
    }
  }, [activeProfile]);

  const insights = useMemo(() => {
    if (!activeProfileState) {
      return {};
    }

    return {
      add: deriveOperationInsight("add", activeProfileState),
      subtract: deriveOperationInsight("subtract", activeProfileState),
      multiply: deriveOperationInsight("multiply", activeProfileState),
      divide: deriveOperationInsight("divide", activeProfileState)
    };
  }, [activeProfileState]);

  function handleCreateProfile(name: string) {
    setAppState((current) => addProfile(current, createProfile(name)));
    setShowProfilePanel(false);
  }

  function handleActivateProfile(profileId: string) {
    setAppState((current) => activateProfile(current, profileId));
    setShowProfilePanel(false);
  }

  function handleRenameProfile(profileId: string, name: string) {
    setAppState((current) => renameProfile(current, profileId, name));
  }

  function handleDeleteProfile(profileId: string) {
    const profile = appState.profiles.find((entry) => entry.id === profileId);

    if (!profile) {
      return;
    }

    const confirmed = window.confirm(`Delete ${profile.name}'s local profile and stats?`);

    if (!confirmed) {
      return;
    }

    setAppState((current) => deleteProfile(current, profileId));
  }

  function handleSettingsChange(settings: GameSettings) {
    if (!activeProfile) {
      return;
    }

    setAppState((current) =>
      updateProfileState(current, activeProfile.id, (profileState) => ({
        ...profileState,
        settings
      }))
    );
  }

  function handleStartGame() {
    if (!activeProfileState || !isSettingsValid(activeProfileState.settings)) {
      setView("setup");
      return;
    }

    setGameKey((current) => current + 1);
    setView("game");
  }

  function handleRoundFinish(summary: SessionSummary, attempts: FactAttempt[]) {
    if (!activeProfile) {
      return;
    }

    setAppState((current) => recordSession(current, activeProfile.id, summary, attempts));
    setLastResult(summary);
    setView("results");
  }

  return (
    <main className="app-shell">
      <div className="background-orbs" aria-hidden="true">
        <span className="orb orb--large" />
        <span className="orb orb--medium" />
        <span className="orb orb--small" />
      </div>

      <header className="topbar">
        <div>
          <p className="eyebrow">mathfacts.thecaseyb.com</p>
          <h1>Underwater Math Facts</h1>
        </div>

        {activeProfile ? (
          <div className="topbar-actions">
            <span className="profile-chip">{activeProfile.name}</span>
            <button className="ghost-button" onClick={() => setShowProfilePanel(true)} type="button">
              Switch profile
            </button>
          </div>
        ) : null}
      </header>

      {showProfilePanel ? (
        <ProfilePanel
          activeProfileId={appState.activeProfileId}
          onActivateProfile={handleActivateProfile}
          onClose={activeProfile ? () => setShowProfilePanel(false) : undefined}
          onCreateProfile={handleCreateProfile}
          onDeleteProfile={handleDeleteProfile}
          onRenameProfile={handleRenameProfile}
          profiles={appState.profiles}
        />
      ) : null}

      {(!activeProfile || !activeProfileState) && !showProfilePanel ? (
        <section className="empty-state panel">
          <p className="eyebrow">Shared Device Setup</p>
          <h2>Create a profile to keep each student's progress separate.</h2>
          <p className="hero-copy">
            This first release keeps profiles local on the device, which lines up with the future platform plan
            without needing login yet.
          </p>
          <button className="primary-button" onClick={() => setShowProfilePanel(true)} type="button">
            Open profile manager
          </button>
        </section>
      ) : null}

      {activeProfile && activeProfileState && !showProfilePanel ? (
        <>
          {view === "setup" ? (
            <SetupScreen
              insights={insights}
              onOpenStats={() => setView("stats")}
              onSettingsChange={handleSettingsChange}
              onStartGame={handleStartGame}
              profileName={activeProfile.name}
              settings={activeProfileState.settings}
            />
          ) : null}

          {view === "game" ? (
            <GameScreen
              key={`${activeProfile.id}-${gameKey}`}
              onExit={() => setView("setup")}
              onFinish={handleRoundFinish}
              profileName={activeProfile.name}
              settings={activeProfileState.settings}
            />
          ) : null}

          {view === "results" && lastResult ? (
            <ResultsScreen
              bestScore={Math.max(activeProfileState.bestScore, lastResult.score)}
              onBackToSetup={() => setView("setup")}
              onPlayAgain={handleStartGame}
              onViewStats={() => setView("stats")}
              profileName={activeProfile.name}
              result={lastResult}
            />
          ) : null}

          {view === "stats" ? (
            <StatsScreen
              bestScore={activeProfileState.bestScore}
              onBack={() => setView("setup")}
              onPlayAgain={handleStartGame}
              profileName={activeProfile.name}
              profileState={activeProfileState}
            />
          ) : null}
        </>
      ) : null}
    </main>
  );
}
