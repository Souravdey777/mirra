import type { PlatformKey } from "@mirra/design";

export type CreatorPlatform = PlatformKey;

export type DraftIntent =
  | "idea-shaping"
  | "rewrite"
  | "first-draft"
  | "refinement"
  | "repurpose";

export type PersonaMemorySnapshot = {
  creatorId: string;
  platforms: CreatorPlatform[];
  analyzedPostCount: number;
  updatedAt: string;
  confidence: number;
  voiceSummary: string;
};

export type DraftRequest = {
  creatorId: string;
  platform: CreatorPlatform;
  intent: DraftIntent;
  prompt: string;
  personaSnapshotId?: string;
};

export type DraftResult = {
  id: string;
  platform: CreatorPlatform;
  title: string;
  body: string;
  voiceMatch: number;
  createdAt: string;
};

export interface PersonaRepository {
  getCurrentSnapshot(creatorId: string): Promise<PersonaMemorySnapshot>;
  refreshFromPostHistory(creatorId: string): Promise<PersonaMemorySnapshot>;
}

export interface DraftingService {
  createDraft(request: DraftRequest): Promise<DraftResult>;
  rewriteDraft(draftId: string, prompt: string): Promise<DraftResult>;
}

export interface PostHistoryImporter {
  importLinkedIn(creatorId: string): Promise<{ importedCount: number }>;
  importX(creatorId: string): Promise<{ importedCount: number }>;
}

export interface StreakRepository {
  getCurrentStreak(creatorId: string): Promise<{ days: number; nextReminderAt: string }>;
  markDraftCreated(creatorId: string): Promise<void>;
}
