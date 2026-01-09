import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { useAppTheme } from '@/contexts/app-theme-context';

const StyledIonicons = withUniwind(Ionicons);

export function ThemeToggle() {
	const { toggleTheme, isLight } = useAppTheme();

	return (
		<Pressable
			onPress={() => {
				if (Platform.OS === 'ios') {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				toggleTheme();
			}}
			className="px-2.5"
		>
			{isLight ? (
				<Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
					<StyledIonicons name="moon" size={20} className="text-foreground" />
				</Animated.View>
			) : (
				<Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
					<StyledIonicons name="sunny" size={20} className="text-foreground" />
				</Animated.View>
			)}
		</Pressable>
	);
}

