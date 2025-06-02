import { Container } from "@/components/container";
import { ScrollView, Text, View } from "react-native";

export default function TabTwo() {
  return (
    <Container>
      <ScrollView className="flex-1 p-6">
        <View className="py-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Tab Two
          </Text>
          <Text className="text-lg text-muted-foreground">
            Discover more features and content
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}
