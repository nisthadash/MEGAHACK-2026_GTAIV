import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, Loader2, MessageSquare, FileText, Bug,
  Shield, Lightbulb, Zap, AlertCircle, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { AIExplainData } from "./MainIDE";

const API_BASE = "http://localhost:8000";

interface LineComment {
  line: number;
  comment: string;
  type: "info" | "important" | "warning";
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIMentorPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  response: string;
  aiData: AIExplainData | null;
  isAnalyzing: boolean;
  code: string;
  language: string;
  onExplainCode: () => void;
  apiError: string | null;
}

const TABS = [
  { id: "Comments",    label: "Comments",    icon: MessageSquare },
  { id: "Summary",     label: "Summary",     icon: FileText      },
  { id: "Explanation", label: "Explanation", icon: Lightbulb     },
  { id: "Bugs",        label: "Bugs",        icon: Bug           },
  { id: "Assumptions", label: "Assumptions", icon: Shield        },
  { id: "Optimize",    label: "Optimize",    icon: Zap           },
];

export function AIMentorPanel({
  activeTab, onTabChange, response, aiData, isAnalyzing,
  code, language, onExplainCode, apiError,
}: AIMentorPanelProps) {

  // â”€â”€â”€ Chat state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [chatInput, setChatInput]     = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // â”€â”€â”€ Real-time comments state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [liveComments, setLiveComments]       = useState<LineComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError]     = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // â”€â”€â”€ Real-time AI comments with 800ms debounce â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchComments = useCallback(async (src: string) => {
    if (!src.trim() || src.length < 10) {
      setLiveComments([]);
      return;
    }
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const res = await fetch(`${API_BASE}/api/ai/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: src, language }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Comments fetch failed");
      }
      const data = await res.json();
      setLiveComments(data.comments ?? []);
    } catch (e: any) {
      setCommentsError(e.message);
    } finally {
      setCommentsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (activeTab !== "Comments") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchComments(code), 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [code, activeTab, fetchComments]);

  // â”€â”€â”€ Chat send â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSendMessage = useCallback(async () => {
    const msg = chatInput.trim();
    if (!msg || isChatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: msg, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, code: code || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Mentor API failed");
      }
      const data = await res.json();
      const aiMsg: ChatMessage = { role: "ai", content: data.response, timestamp: new Date() };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      const errMsg: ChatMessage = {
        role: "ai",
        content: `âš ï¸ Error: ${e.message}`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, code, isChatLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <div className="h-full bg-[#111827] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#1f2937] flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-[#e5e7eb]">AI Mentor</h2>
          </div>
          {/* Explain Code trigger */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onExplainCode}
            disabled={!code.trim() || isAnalyzing}
            className="px-3 py-1 text-xs font-medium rounded-md bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 border border-[#22c55e]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> : null}
            {isAnalyzing ? "Analyzingâ€¦" : "âš¡ Explain Code"}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                activeTab === id
                  ? "bg-[#22c55e] text-white shadow shadow-[#22c55e]/30"
                  : "bg-[#1f2937] text-[#9ca3af] hover:bg-[#374151] hover:text-[#e5e7eb]"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Global API error banner */}
      {apiError && (
        <div className="mx-3 mt-2 p-2 rounded-lg bg-[#7f1d1d]/30 border border-[#ef4444]/30 flex items-start gap-2 text-xs text-[#fca5a5]">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <AnimatePresence mode="wait">
          {isAnalyzing && activeTab !== "Comments" ? (
            <AnalyzingAnimation key="analyzing" />
          ) : activeTab === "Comments" ? (
            <CommentsTab
              key="comments"
              comments={liveComments}
              loading={commentsLoading}
              error={commentsError}
              code={code}
            />
          ) : activeTab === "Summary" ? (
            <ListTab key="summary" items={aiData ? [aiData.summary] : []} emptyMsg="Click 'âš¡ Explain Code' to generate a summary." isText />
          ) : activeTab === "Explanation" ? (
            <ListTab key="explanation" items={aiData ? [aiData.explanation] : [response]} emptyMsg="Click 'âš¡ Explain Code' or click a line in the editor." isText />
          ) : activeTab === "Bugs" ? (
            <ListTab key="bugs" items={aiData?.bugs ?? []} emptyMsg="No bugs detected. Click 'âš¡ Explain Code' to scan." icon="ðŸ›" />
          ) : activeTab === "Assumptions" ? (
            <ListTab key="assumptions" items={aiData?.assumptions ?? []} emptyMsg="Click 'âš¡ Explain Code' to detect assumptions." icon="ðŸ“Œ" />
          ) : activeTab === "Optimize" ? (
            <ListTab key="optimize" items={aiData?.optimization ?? []} emptyMsg="Click 'âš¡ Explain Code' to get optimization suggestions." icon="âš¡" />
          ) : null}
        </AnimatePresence>
      </div>

      {/* Chat area */}
      <div className="border-t border-[#1f2937] flex-shrink-0">
        {/* Message thread (shown when there are messages) */}
        {chatMessages.length > 0 && (
          <div className="max-h-48 overflow-y-auto p-3 space-y-2">
            {chatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-1.5 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#22c55e]/15 text-[#e5e7eb] border border-[#22c55e]/20"
                      : "bg-[#1f2937] text-[#d1d5db] border border-[#374151]"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isChatLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="px-3 py-2 rounded-xl bg-[#1f2937] border border-[#374151] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input row */}
        <div className="p-3 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isChatLoading}
            placeholder="Ask AI Mentor about this codeâ€¦"
            className="flex-1 h-9 bg-[#1f2937] border border-[#374151] rounded-lg px-3 text-xs text-[#e5e7eb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#22c55e] transition-colors disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isChatLoading || !chatInput.trim()}
            className="w-9 h-9 bg-[#22c55e] hover:bg-[#16a34a] rounded-lg flex items-center justify-center transition-colors shadow shadow-[#22c55e]/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AnalyzingAnimation() {
  const steps = ["Scanning functionsâ€¦", "Detecting algorithmsâ€¦", "Analyzing bugsâ€¦", "Generating explanationâ€¦"];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-[#22c55e] animate-spin" />
        <span className="text-sm text-[#e5e7eb]">Analyzing your codeâ€¦</span>
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4 }}
            className="flex items-center gap-2 text-xs text-[#9ca3af]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            {step}
          </motion.div>
        ))}
      </div>
      <div className="p-3 bg-[#1f2937] rounded-lg border border-[#374151] space-y-2">
        {[80, 60, 90].map((w, i) => (
          <div key={i} className="h-2.5 bg-[#374151] rounded animate-pulse" style={{ width: `${w}%` }} />
        ))}
      </div>
    </motion.div>
  );
}

function CommentsTab({ comments, loading, error, code }: {
  comments: LineComment[];
  loading: boolean;
  error: string | null;
  code: string;
}) {
  if (!code || code.length < 10) {
    return <div className="text-[#6b7280] text-xs italic">Write some code to see real-time AI commentsâ€¦</div>;
  }
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#22c55e]" />
        <span>AI is reading your codeâ€¦ (gemini-2.0-flash-lite)</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-2 rounded-lg bg-[#7f1d1d]/30 border border-[#ef4444]/30 flex items-start gap-2 text-xs text-[#fca5a5]">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        {error}
      </div>
    );
  }
  if (comments.length === 0) {
    return <div className="text-[#6b7280] text-xs italic">Waiting for you to pause typingâ€¦</div>;
  }

  const colorMap = {
    info:      { bg: "bg-[#1e3a8a]/20 border-[#3b82f6]/40", text: "text-[#60a5fa]" },
    important: { bg: "bg-[#14532d]/20 border-[#22c55e]/40", text: "text-[#4ade80]" },
    warning:   { bg: "bg-[#7f1d1d]/20 border-[#ef4444]/40", text: "text-[#f87171]" },
  };

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-[#6b7280] mb-2 flex items-center gap-1">
        <Zap className="w-3 h-3 text-[#22c55e]" />
        Real-time AI comments Â· gemini-2.0-flash-lite Â· updates on 800ms pause
      </div>
      {comments.map((c, i) => {
        const { bg, text } = colorMap[c.type as keyof typeof colorMap] ?? colorMap.info;
        return (
          <motion.div
            key={`${c.line}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-2.5 rounded-lg border ${bg}`}
          >
            <div className="flex items-start gap-2">
              <span className={`text-[10px] font-mono font-bold ${text} min-w-[3rem] flex-shrink-0`}>
                Line {c.line}
              </span>
              <span className="text-xs text-[#d1d5db] leading-relaxed">{c.comment}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ListTab({ items, emptyMsg, icon, isText }: {
  items: string[];
  emptyMsg: string;
  icon?: string;
  isText?: boolean;
}) {
  if (!items.length || (items.length === 1 && !items[0])) {
    return <div className="text-[#6b7280] text-xs italic">{emptyMsg}</div>;
  }
  if (isText) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-[#d1d5db] leading-relaxed whitespace-pre-wrap"
      >
        {items[0]}
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="p-2.5 rounded-lg bg-[#1f2937] border border-[#374151] text-xs text-[#d1d5db] leading-relaxed"
        >
          {icon && <span className="mr-1.5">{icon}</span>}
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}


interface AIMentorPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  response: string;
  isAnalyzing: boolean;
