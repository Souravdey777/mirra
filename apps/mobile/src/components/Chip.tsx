import { colors, spacing } from "@mirra/design";
import { Pressable, StyleSheet, Text } from "react-native";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  selected: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  selectedLabel: {
    color: colors.card
  }
});
