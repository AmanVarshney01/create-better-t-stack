import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export const HeaderButton = forwardRef<
  typeof Pressable,
  { onPress?: () => void }
>(({ onPress }, ref) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      {({ pressed }) => (
        <FontAwesome
          name="info-circle"
          size={20}
          color={styles.icon.color}
          style={{
            opacity: pressed ? 0.7 : 1,
          }}
        />
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create((theme) => ({
  button: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.secondary}80`, // 50% opacity
  },
  icon: {
    color: theme.colors.secondaryForeground,
  },
}));
