import { Container } from "@/components/container";
import { Text, View } from "react-native";

export default function Modal() {
  return (
    <Container>
      <View className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-2xl font-bold text-foreground">Modal</Text>
        </View>
      </View>
    </Container>
  );
}
