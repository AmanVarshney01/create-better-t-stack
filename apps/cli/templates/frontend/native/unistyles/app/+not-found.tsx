import { Container } from "@/components/container";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🤔</Text>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.description}>
              Sorry, the page you're looking for doesn't exist.
            </Text>
            <Link href="/" style={styles.button}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize["2xl"],
    fontWeight: "bold",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  description: {
    color: theme.colors.mutedForeground,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    maxWidth: 280,
  },
  button: {
    backgroundColor: `${theme.colors.primary}1A`, // 10% opacity
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.lg,
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
}));
