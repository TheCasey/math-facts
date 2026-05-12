import { useState } from "react";
import type { StudentProfile } from "../../lib/game/types";

interface ProfilePanelProps {
  profiles: StudentProfile[];
  activeProfileId: string | null;
  onCreateProfile: (name: string) => void;
  onActivateProfile: (profileId: string) => void;
  onRenameProfile: (profileId: string, name: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onClose?: () => void;
}

export function ProfilePanel({
  profiles,
  activeProfileId,
  onCreateProfile,
  onActivateProfile,
  onRenameProfile,
  onDeleteProfile,
  onClose
}: ProfilePanelProps) {
  const [draftName, setDraftName] = useState("");
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draftName.trim();

    if (!name) {
      return;
    }

    onCreateProfile(name);
    setDraftName("");
  }

  function beginRename(profile: StudentProfile) {
    setEditingProfileId(profile.id);
    setEditingName(profile.name);
  }

  function handleRenameSubmit(event: React.FormEvent<HTMLFormElement>, profileId: string) {
    event.preventDefault();
    const nextName = editingName.trim();

    if (!nextName) {
      return;
    }

    onRenameProfile(profileId, nextName);
    setEditingProfileId(null);
    setEditingName("");
  }

  return (
    <section className={`panel panel-profile${onClose ? " panel-profile--modal" : ""}`}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Student Profiles</p>
          <h2>{profiles.length ? "Choose who is playing" : "Create the first profile"}</h2>
        </div>
        {onClose ? (
          <button className="ghost-button" onClick={onClose} type="button">
            Close
          </button>
        ) : null}
      </div>

      <form className="profile-create-form" onSubmit={handleCreateSubmit}>
        <label className="field">
          <span>Profile name</span>
          <input
            maxLength={24}
            onChange={(event) => setDraftName(event.target.value)}
            placeholder="Ocean Learner"
            value={draftName}
          />
        </label>
        <button className="primary-button" type="submit">
          Add profile
        </button>
      </form>

      <div className="profile-list">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          const isEditing = editingProfileId === profile.id;

          return (
            <article className={`profile-card${isActive ? " profile-card--active" : ""}`} key={profile.id}>
              <div className="profile-card__main">
                {isEditing ? (
                  <form className="inline-form" onSubmit={(event) => handleRenameSubmit(event, profile.id)}>
                    <input
                      autoFocus
                      maxLength={24}
                      onChange={(event) => setEditingName(event.target.value)}
                      value={editingName}
                    />
                    <button className="ghost-button" type="submit">
                      Save
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => setEditingProfileId(null)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div>
                      <h3>{profile.name}</h3>
                      <p>{isActive ? "Current profile" : "Ready to switch in"}</p>
                    </div>
                    <div className="profile-card__actions">
                      <button
                        className="ghost-button"
                        onClick={() => onActivateProfile(profile.id)}
                        type="button"
                      >
                        {isActive ? "Active" : "Use profile"}
                      </button>
                      <button className="ghost-button" onClick={() => beginRename(profile)} type="button">
                        Rename
                      </button>
                      <button
                        className="ghost-button ghost-button--danger"
                        onClick={() => onDeleteProfile(profile.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

