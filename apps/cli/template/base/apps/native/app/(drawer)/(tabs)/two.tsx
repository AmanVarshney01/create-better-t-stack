import { Container } from "@/components/container";
import { Text, View } from "react-native";

export default function TabTwo() {
	return (
		<Container>
			<View className="p-6 flex-1 justify-center">
				<Text className="text-2xl font-bold text-foreground text-center mb-4">
					Tab Two
				</Text>
				<Text className="text-foreground text-center">
					This is the second tab of the application.
				</Text>
			</View>
		</Container>
	);
}
