export const colors = {
  cream: "#FBF4EA",
  card: "#FFFDF9",
  denim: "#5B8CFF",
  mint: "#7EE7C7",
  coral: "#FF8A5B",
  amber: "#F6B73C",
  lavender: "#C9B6FF",
  text: "#1F1A17",
  muted: "#6F655D",
  border: "#EDE3D8",
  linkedin: "#0A66C2",
  x: "#1F1A17",
  success: "#3BBE8C"
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64
} as const;

export const radii = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 8,
  pill: 999
} as const;

export const typography = {
  display: {
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "800"
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800"
  },
  section: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800"
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500"
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700"
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600"
  }
} as const;

export const shadows = {
  soft: {
    shadowColor: "#8A5A2B",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  button: {
    shadowColor: "#5B8CFF",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  }
} as const;

export const componentRecipes = {
  surface: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg
  },
  pill: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.pill
  },
  primaryAction: {
    backgroundColor: colors.denim,
    borderRadius: radii.pill
  },
  secondaryAction: {
    backgroundColor: "#F7EFE5",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.pill
  }
} as const;

export const platforms = {
  linkedin: {
    label: "LinkedIn",
    color: colors.linkedin,
    shortLabel: "in"
  },
  x: {
    label: "X",
    color: colors.x,
    shortLabel: "x"
  }
} as const;

export type MirraColor = keyof typeof colors;
export type PlatformKey = keyof typeof platforms;
