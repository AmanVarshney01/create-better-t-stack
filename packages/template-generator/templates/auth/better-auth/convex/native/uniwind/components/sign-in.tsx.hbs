import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, ErrorView, Spinner, Surface, TextField } from "heroui-native";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: () => {
          setEmail("");
          setPassword("");
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">Sign In</Text>

      <ErrorView isInvalid={!!error} className="mb-3">
        {error}
      </ErrorView>

      <View className="gap-3">
        <TextField>
          <TextField.Label>Email</TextField.Label>
          <TextField.Input
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </TextField>

        <TextField>
          <TextField.Label>Password</TextField.Label>
          <TextField.Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </TextField>

        <Button onPress={handleLogin} isDisabled={isLoading} className="mt-1">
          {isLoading ? <Spinner size="sm" color="default" /> : <Button.Label>Sign In</Button.Label>}
        </Button>
      </View>
    </Surface>
  );
}
