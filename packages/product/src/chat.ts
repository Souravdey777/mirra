import type { PlatformKey } from "@mirra/design";

export type ChatMessage = {
  id: string;
  role: "mirra" | "creator";
  tone?: "warm" | "reflective" | "focused";
  body: string;
};

export type DraftAction =
  | "Rewrite"
  | "Edit"
  | "Copy"
  | "Open LinkedIn"
  | "Open X"
  | "Schedule";

export type PostDraft = {
  id: string;
  platform: PlatformKey;
  label: string;
  title: string;
  body: string;
  match: number;
  readTime: string;
  actions: DraftAction[];
};

export const suggestionChips = [
  "AI agents",
  "builder lesson",
  "career note"
] as const;

export const composerPowers = [
  "Idea",
  "Rewrite",
  "Voice check",
  "Repurpose"
] as const;

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "mirra",
    tone: "warm",
    body: "i found something worth posting today."
  },
  {
    id: "m2",
    role: "creator",
    body: "make it sharper for x"
  },
  {
    id: "m3",
    role: "mirra",
    tone: "reflective",
    body: "done. shorter, punchier, same voice."
  }
];

const draftSeeds = [
  {
    id: "d1",
    platform: "linkedin",
    label: "draft for linkedin + x",
    title: "Better rhythm changes the work.",
    body:
      "Most AI tools do not fail because of the model.\nThey fail because the workflow is unclear.\nBetter prompts help, but better rhythm changes the work.",
    match: 91,
    readTime: "35 sec"
  },
  {
    id: "d2",
    platform: "x",
    label: "x version",
    title: "Optimized for X",
    body:
      "AI tools rarely fail because of the model.\nThey fail because the workflow is vague.\nBetter prompts help. Better rhythm changes the work.",
    match: 90,
    readTime: "18 sec"
  }
] as const;

export const postDrafts: PostDraft[] = draftSeeds.map((draft): PostDraft => ({
  ...draft,
  actions:
    draft.platform === "linkedin"
      ? ["Rewrite", "Edit", "Copy", "Open LinkedIn", "Schedule"]
      : ["Rewrite", "Edit", "Copy", "Open X", "Schedule"]
}));

export const todayPrompt = {
  label: "Today",
  streak: 6,
  focus: "Keep the thought simple and publishable.",
  nextReminder: "7:30 PM"
};
