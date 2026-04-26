import { colors } from "@mirra/design";
import { Lightbulb, Pencil, Rocket, Send, Sparkles, Star } from "lucide-react-native";
import type { ComponentType } from "react";
import type { DimensionValue } from "react-native";
import { StyleSheet, View } from "react-native";

type DoodleIcon = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const patternMarks: Array<{ id: number; left: DimensionValue; top: DimensionValue; opacity: number }> = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 23) % 100}%` as DimensionValue,
  top: `${(index * 37) % 100}%` as DimensionValue,
  opacity: index % 3 === 0 ? 0.18 : 0.1
}));

const doodles: Array<{
  id: string;
  Icon: DoodleIcon;
  left: DimensionValue;
  top: DimensionValue;
  size: number;
  rotate: string;
  opacity: number;
}> = [
  { id: "idea-1", Icon: Lightbulb, left: "88%", top: "9%", size: 46, rotate: "16deg", opacity: 0.16 },
  { id: "rocket-1", Icon: Rocket, left: "4%", top: "29%", size: 58, rotate: "-18deg", opacity: 0.12 },
  { id: "send-1", Icon: Send, left: "80%", top: "60%", size: 70, rotate: "-18deg", opacity: 0.14 },
  { id: "star-1", Icon: Star, left: "1%", top: "72%", size: 44, rotate: "10deg", opacity: 0.14 },
  { id: "pencil-1", Icon: Pencil, left: "91%", top: "78%", size: 42, rotate: "-14deg", opacity: 0.12 },
  { id: "sparkle-1", Icon: Sparkles, left: "7%", top: "52%", size: 36, rotate: "8deg", opacity: 0.13 }
];

export function PatternBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {doodles.map(({ id, Icon, left, top, size, rotate, opacity }) => (
        <View key={id} style={[styles.doodle, { left, top, opacity, transform: [{ rotate }] }]}>
          <Icon size={size} color="#F3BDA9" strokeWidth={1.35} />
        </View>
      ))}
      {patternMarks.map((mark) => (
        <View
          key={mark.id}
          style={[
            styles.mark,
            {
              left: mark.left,
              top: mark.top,
              opacity: mark.opacity
            }
          ]}
        />
      ))}
      <View style={styles.warmPanel} />
    </View>
  );
}

const styles = StyleSheet.create({
  doodle: {
    position: "absolute"
  },
  mark: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.coral
  },
  warmPanel: {
    position: "absolute",
    left: -80,
    right: -80,
    bottom: -120,
    height: 260,
    backgroundColor: "#FFF8EF",
    transform: [{ rotate: "-6deg" }]
  }
});
