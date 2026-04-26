import type { PlatformKey } from "@mirra/design";
import type { composerPowers } from "@mirra/product";
import { create } from "zustand";

type PersonaPlatformFilter = "all" | PlatformKey;
type ComposerPower = (typeof composerPowers)[number];

type CreatorState = {
  personaPlatform: PersonaPlatformFilter;
  activePower: ComposerPower;
  setPersonaPlatform: (platform: PersonaPlatformFilter) => void;
  setActivePower: (power: ComposerPower) => void;
};

export const useCreatorStore = create<CreatorState>((set) => ({
  personaPlatform: "all",
  activePower: "Idea",
  setPersonaPlatform: (personaPlatform) => set({ personaPlatform }),
  setActivePower: (activePower) => set({ activePower })
}));
