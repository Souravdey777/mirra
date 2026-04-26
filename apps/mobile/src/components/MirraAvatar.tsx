import { colors, shadows } from "@mirra/design";
import { Image, StyleSheet, View } from "react-native";

const avatarSource = require("../../assets/images/mirra-avatar.png");

type MirraAvatarProps = {
  size?: number;
  elevated?: boolean;
};

export function MirraAvatar({ size = 64, elevated = true }: MirraAvatarProps) {
  return (
    <View
      style={[
        styles.shell,
        elevated && shadows.soft,
        {
          width: size,
          height: size,
          borderRadius: size / 2
        }
      ]}
    >
      <Image source={avatarSource} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.card,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
  }
});
