import type { PlatformKey } from "@mirra/design";

export type PersonaTrait = {
  label: string;
  value: string;
  strength: number;
};

export type PersonaSection = {
  title: string;
  items: string[];
};

export type PlatformDifference = {
  platform: PlatformKey;
  summary: string;
  traits: string[];
};

export const personaSnapshot = {
  creatorName: "Solo creator",
  analyzedPosts: 128,
  confidence: 87,
  voiceMatch: 91,
  updatedAt: "2026-04-24",
  summary:
    "Warm, specific, and reflective. You tend to make ideas feel practical without turning them into frameworks too quickly.",
  traits: [
    { label: "Tone", value: "calm, direct, lightly personal", strength: 94 },
    { label: "Pacing", value: "short paragraphs with thoughtful pauses", strength: 88 },
    { label: "Point of view", value: "gentle contrarian, useful by the end", strength: 84 },
    { label: "Energy", value: "warm confidence, not hype", strength: 91 }
  ] satisfies PersonaTrait[],
  sections: [
    {
      title: "Best openings",
      items: [
        "I used to think...",
        "A small thing I have noticed...",
        "The mistake is not...",
        "Lately, I keep coming back to..."
      ]
    },
    {
      title: "Phrases used often",
      items: [
        "small ritual",
        "the honest version",
        "less pressure",
        "return tomorrow",
        "make it useful"
      ]
    },
    {
      title: "Avoid phrases",
      items: [
        "10x your output",
        "crushing it",
        "ultimate framework",
        "growth hack",
        "secret playbook"
      ]
    },
    {
      title: "Topics returned to",
      items: [
        "creator consistency",
        "building in public",
        "craft and taste",
        "AI as a thinking partner",
        "personal operating systems"
      ]
    }
  ] satisfies PersonaSection[],
  platformDifferences: [
    {
      platform: "linkedin",
      summary: "More reflective and essay-like, with a clear takeaway in the final third.",
      traits: ["2-4 line paragraphs", "personal setup", "gentle lesson", "question as closer"]
    },
    {
      platform: "x",
      summary: "Sharper and more compressed, with the same warmth but fewer qualifiers.",
      traits: ["one idea per line", "stronger first sentence", "less context", "memorable final beat"]
    }
  ] satisfies PlatformDifference[]
};
