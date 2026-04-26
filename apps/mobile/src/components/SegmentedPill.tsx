import { colors, componentRecipes, shadows, spacing } from "@mirra/design";
import { router } from "expo-router";
import { Sparkles, UserRound } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Segment = "mirra" | "persona";

type SegmentedPillProps = {
  active: Segment;
};

const segments = [
  { id: "mirra" as const, label: "mirra", href: "/", Icon: Sparkles },
  { id: "persona" as const, label: "persona", href: "/persona", Icon: UserRound }
] as const;

export function SegmentedPill({ active }: SegmentedPillProps) {
  return (
    <View style={[styles.wrap, componentRecipes.pill, shadows.soft]}>
      {segments.map(({ id, label, href, Icon }) => {
        const selected = active === id;

        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            onPress={() => router.push(href)}
            style={[styles.segment, selected && styles.segmentActive]}
          >
            <Icon size={15} color={selected ? colors.card : colors.muted} strokeWidth={2.5} />
            <Text style={[styles.label, selected && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    padding: 4,
    gap: 4
  },
  segment: {
    minHeight: 38,
    minWidth: 104,
    paddingHorizontal: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing[2],
    borderRadius: 999
  },
  segmentActive: {
    backgroundColor: colors.text
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  labelActive: {
    color: colors.card
  }
});
