import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";

const generateAPIUrl = (relativePath: string) => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("EXPO_PUBLIC_SERVER_URL environment variable is not defined");
  }
  
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return serverUrl.concat(path);
};

export default function AIScreen() {
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/ai'),
    }),
    onError: error => console.error(error, 'AI Chat Error'),
  });

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = () => {
    const value = input.trim();
    if (value) {
      sendMessage({ text: value });
      setInput("");
    }
  };

  if (error) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-destructive text-center text-lg mb-4">
            Error: {error.message}
          </Text>
          <Text className="text-muted-foreground text-center">
            Please check your connection and try again.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-4 py-6">
          <View className="mb-6">
            <Text className="text-foreground text-2xl font-bold mb-2">
              AI Chat
            </Text>
            <Text className="text-muted-foreground">
              Chat with our AI assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-center text-muted-foreground text-lg">
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View className="space-y-4">
                {messages.map((message) => (
                  <View
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary/10 ml-8"
                        : "bg-card mr-8 border border-border"
                    }`}
                  >
                    <Text className="text-sm font-semibold mb-1 text-foreground">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <View className="space-y-1">
                      {message.parts.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <Text
                              key={`${message.id}-${i}`}
                              className="text-foreground leading-relaxed"
                            >
                              {part.text}
                            </Text>
                          );
                        }
                        return (
                          <Text
                            key={`${message.id}-${i}`}
                            className="text-foreground leading-relaxed"
                          >
                            {JSON.stringify(part)}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="border-t border-border pt-4">
            <View className="flex-row items-end space-x-2">
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor="#6b7280"
                className="flex-1 border border-border rounded-md px-3 py-2 text-foreground bg-background min-h-[40px] max-h-[120px]"
                onSubmitEditing={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                autoFocus={true}
              />
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim()}
                className={`p-2 rounded-md ${
                  input.trim() 
                    ? "bg-primary" 
                    : "bg-muted"
                }`}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={input.trim() ? "#ffffff" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
} 