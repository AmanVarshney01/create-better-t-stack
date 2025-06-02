import { useRef, useEffect } from "react";
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
import { fetch as expoFetch } from "expo/fetch";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Container } from "@/components/container";

const generateAPIUrl = (relativePath: string) => {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined",
    );
  }

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return serverUrl.concat(path);
};

export default function AIScreen() {
  const { theme } = useUnistyles();
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/ai"),
    onError: (error) => console.error(error, "AI Chat Error"),
    maxSteps: 5,
  });

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const onSubmit = () => {
    if (input.trim()) {
      handleSubmit();
    }
  };

  if (error) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          <Text style={styles.errorSubtext}>
            Please check your connection and try again.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Chat</Text>
            <Text style={styles.headerSubtitle}>
              Chat with our AI assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View style={styles.messagesWrapper}>
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage,
                    ]}
                  >
                    <Text style={styles.messageRole}>
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <Text style={styles.messageContent}>{message.content}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                value={input}
                onChange={(e) =>
                  handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      value: e.nativeEvent.text,
                    },
                  } as unknown as React.ChangeEvent<HTMLInputElement>)
                }
                placeholder="Type your message..."
                placeholderTextColor={theme.colors.border}
                style={styles.textInput}
                onSubmitEditing={(e) => {
                  handleSubmit(e);
                  e.preventDefault();
                }}
                autoFocus={true}
              />
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim()}
                style={[
                  styles.sendButton,
                  !input.trim() && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    input.trim() ? theme.colors.background : theme.colors.border
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.destructive,
    textAlign: "center",
    fontSize: 18,
    marginBottom: theme.spacing.md,
  },
  errorSubtext: {
    color: theme.colors.typography,
    textAlign: "center",
    fontSize: 16,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: theme.spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.typography,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.typography,
    fontSize: 18,
  },
  messagesWrapper: {
    gap: theme.spacing.md,
  },
  messageContainer: {
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  userMessage: {
    backgroundColor: theme.colors.primary + "20",
    marginLeft: theme.spacing.xl,
    alignSelf: "flex-end",
  },
  assistantMessage: {
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageRole: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    color: theme.colors.typography,
  },
  messageContent: {
    color: theme.colors.typography,
    lineHeight: 20,
  },
  toolInvocations: {
    fontSize: 12,
    color: theme.colors.typography,
    fontFamily: "monospace",
    backgroundColor: theme.colors.border + "40",
    padding: theme.spacing.sm,
    borderRadius: 4,
    marginTop: theme.spacing.sm,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.typography,
    backgroundColor: theme.colors.background,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
}));
