import { Container } from "@/components/container";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>
        <View className="flex-1 justify-center items-center p-6">
          <View className="items-center">
            <Text className="text-6xl mb-4">🤔</Text>
            <Text className="text-2xl font-bold text-foreground mb-2 text-center">
              Page Not Found
            </Text>
            <Text className="text-muted-foreground text-center mb-8 max-w-sm">
              Sorry, the page you're looking for doesn't exist.
            </Text>
            <Link href="/" asChild>
              <Text className="text-primary font-medium bg-primary/10 px-6 py-3 rounded-lg">
                Go to Home
              </Text>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}
