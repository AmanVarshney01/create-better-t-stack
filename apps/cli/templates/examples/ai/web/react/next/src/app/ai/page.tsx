"use client"

import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef, useEffect } from "react";


export default function AIPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: `${process.env.NEXT_PUBLIC_SERVER_URL}/ai`,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden w-full mx-auto p-4">
      <div className="overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            Ask me anything to get started!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-secondary/20 mr-8"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.role === "user" ? "You" : "AI Assistant"}
              </p>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center space-x-2 pt-2 border-t"
      >
        <Input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
