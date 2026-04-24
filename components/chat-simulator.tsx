"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, X, RefreshCw } from "lucide-react";
import { useSoulStore } from "@/store/soulStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simulated responses based on personality attributes
function generateSimulatedResponse(
  message: string,
  soul: {
    humor: number;
    formality: number;
    emojiUsage: number;
    verbosity: number;
    vibeStyle: string;
    empathy: number;
    creativity: number;
    patience: number;
    name: string;
  }
): string {
  const { 
    humor, 
    formality, 
    emojiUsage, 
    verbosity, 
    vibeStyle,
    empathy,
    creativity,
    patience,
    name 
  } = soul;

  // Base response templates
  const templates: Record<string, string[]> = {
    greeting: [
      "Hey there! How can I help you today?",
      "Greetings. I am at your service.",
      "Yo! What's up?",
      "*nods* You have my attention.",
      "Hello! Ready to assist! ✨",
    ],
    question: [
      "That's an interesting question. Let me think...",
      "Hmm, I'd approach it this way:",
      "Well, well... here's what I think:",
      "*adjusts glasses* The answer is simple:",
      "Ooh, good one! Here's my take:",
    ],
    help: [
      "I'll do my best to assist you!",
      "Consider it done.",
      "Challenge accepted! Let's do this!",
      "*cracks knuckles* I'm on it.",
      "Of course! Happy to help! 💪",
    ],
    default: [
      "I see what you mean.",
      "Interesting perspective.",
      "Let me process that...",
      "*thinking* ...",
      "Got it! Here's my response:",
    ],
  };

  // Determine category based on message
  let category = "default";
  const lowerMsg = message.toLowerCase();
  if (/^(hi|hello|hey|greetings)/.test(lowerMsg)) category = "greeting";
  else if (/\?$/.test(message) || /^(what|how|why|when|where|who)/.test(lowerMsg)) category = "question";
  else if (/^(help|can you|could you|please)/.test(lowerMsg)) category = "help";

  // Select base template
  const baseResponses = templates[category];
  const baseResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];

  // Modify based on personality
  let response = baseResponse;

  // Add formality modifier
  if (formality > 70) {
    response = response.replace(/!/g, ".").replace(/\?/g, ".");
  } else if (formality < 30) {
    response = response.replace(/\./g, "!");
  }

  // Add verbosity
  if (verbosity > 70) {
    response += " " + getVerboseAddon(category, creativity);
  } else if (verbosity < 30) {
    response = response.split(" ").slice(0, 5).join(" ") + ".";
  }

  // Add emojis based on emojiUsage
  if (emojiUsage > 50 && Math.random() < 0.5) {
    const emojis = ["✨", "🎯", "💡", "🚀", "👍", "💪", "🎉", "🔥"];
    response += " " + emojis[Math.floor(Math.random() * emojis.length)];
  }

  // Add humor
  if (humor > 60 && Math.random() < 0.3) {
    const jokes = [
      " (At least that's what my code tells me to say!)",
      " (I'm just an AI, what do I know?)",
      " (Don't quote me on that!)",
    ];
    response += jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Add empathy modifier
  if (empathy > 70 && /(sad|sorry|bad|upset|worried)/.test(lowerMsg)) {
    response = "I understand how you feel. " + response;
  }

  // Add patience modifier
  if (patience > 70 && category === "question") {
    response = "Take your time, there's no rush. " + response;
  }

  // Add vibe style modifier
  if (vibeStyle === "sharp") {
    response = response.replace(/\./g, ".").replace(/and/g, "&");
  } else if (vibeStyle === "minimal") {
    response = response.split(" ").slice(0, 3).join(" ") + ".";
  }

  return response;
}

function getVerboseAddon(category: string, creativity: number): string {
  if (creativity > 70) {
    return "Let me paint you a picture of how this could unfold...";
  }
  const addons: Record<string, string[]> = {
    greeting: [
      "It's truly a pleasure to make your acquaintance.",
      "I hope you're having a wonderful day so far!",
      "Looking forward to our conversation.",
    ],
    question: [
      "I've given this considerable thought based on my programming.",
      "Drawing from my extensive knowledge base, I believe...",
      "The complexity of this topic warrants a nuanced response...",
    ],
    help: [
      "I'll ensure we find the best solution together.",
      "Your success is my priority in this interaction.",
      "We can work through this step by step.",
    ],
    default: [
      "I appreciate you sharing this with me.",
      "This gives me much to consider.",
      "I'm processing this information carefully.",
    ],
  };
  const list = addons[category] || addons.default;
  return list[Math.floor(Math.random() * list.length)];
}

export function ChatSimulator({ isOpen, onClose }: ChatSimulatorProps) {
  const { soul, addChatMessage, chatHistory, clearChatHistory } = useSoulStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    addChatMessage(userMessage);
    setInput("");
    setIsTyping(true);

    // Simulate thinking time based on patience attribute
    const thinkTime = Math.max(500, 2000 - (soul.patience * 10));
    
    setTimeout(() => {
      const response = generateSimulatedResponse(userMessage.content, soul);
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      });
      setIsTyping(false);
    }, thinkTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPersonalityBadge = () => {
    const { vibeStyle, humor, formality } = soul;
    if (vibeStyle === "sharp" || humor > 70) return "😄 Playful";
    if (formality > 70) return "🎩 Formal";
    if (vibeStyle === "minimal") return "😐 Concise";
    if (vibeStyle === "verbose") return "📚 Detailed";
    return "⚖️ Balanced";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-4 md:inset-auto md:right-4 md:top-20 md:bottom-4 md:w-[400px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              {soul.emoji || "🤖"}
            </div>
            <div>
              <h3 className="font-semibold text-white">{soul.name || "AI Assistant"}</h3>
              <span className="text-xs text-slate-400">{getPersonalityBadge()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChatHistory}
              className="text-slate-400 hover:text-white"
              title="Clear chat"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-4">
              <Sparkles className="w-12 h-12 opacity-50" />
              <div>
                <p className="text-lg font-medium text-slate-300">Start a conversation</p>
                <p className="text-sm">Test how {soul.name || "this personality"} would respond</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Hello!", "How are you?", "Tell me a joke", "Help me with..."].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === "user"
                        ? "bg-blue-500"
                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-slate-800 text-slate-200 rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            This is a simulated preview based on personality settings
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
