import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIMentorPanelProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  response: string;
  isAnalyzing: boolean;
}

const tabs = ["Summary", "Line Explanation", "Bugs", "Optimization", "Visualization"];

export function AIMentorPanel({ activeTab, onTabChange, response, isAnalyzing }: AIMentorPanelProps) {
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Handle chat message
      setChatInput("");
    }
  };

  return (
    <div className="h-full bg-[#111827] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#1f2937]">
        <h2 className="text-lg font-semibold text-[#e5e7eb] mb-3">AI Mentor</h2>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/20"
                  : "bg-[#1f2937] text-[#9ca3af] hover:bg-[#374151] hover:text-[#e5e7eb]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <AnalyzingAnimation key="analyzing" />
          ) : response ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="prose prose-invert prose-sm max-w-none"
            >
              <ResponseRenderer content={response} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#6b7280] text-sm italic"
            >
              Click on a line of code or use the AI buttons to get insights...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-[#1f2937]">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask AI Mentor about this code..."
            className="flex-1 h-10 bg-[#1f2937] border border-[#374151] rounded-lg px-4 text-sm text-[#e5e7eb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#22c55e] transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            className="w-10 h-10 bg-[#22c55e] hover:bg-[#16a34a] rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-[#22c55e]/20"
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function AnalyzingAnimation() {
  const steps = [
    "AI analyzing code...",
    "Scanning functions...",
    "Detecting algorithms...",
    "Generating explanation...",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-[#22c55e] animate-spin" />
        <span className="text-sm text-[#e5e7eb]">Analyzing your code...</span>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.5 }}
            className="flex items-center gap-2 text-sm text-[#9ca3af]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            {step}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#1f2937] rounded-lg border border-[#374151]">
        <div className="space-y-2">
          <div className="h-3 bg-[#374151] rounded animate-pulse" style={{ width: "80%" }} />
          <div className="h-3 bg-[#374151] rounded animate-pulse" style={{ width: "60%" }} />
          <div className="h-3 bg-[#374151] rounded animate-pulse" style={{ width: "90%" }} />
        </div>
      </div>
    </motion.div>
  );
}

function ResponseRenderer({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split("\n");

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith("# ")) {
          return (
            <h2 key={index} className="text-lg font-bold text-[#e5e7eb] mb-2">
              {line.substring(2)}
            </h2>
          );
        }
        
        // Subheaders
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <h3 key={index} className="font-semibold text-[#e5e7eb] mt-3">
              {line.substring(2, line.length - 2)}
            </h3>
          );
        }
        
        // List items
        if (line.startsWith("- ") || line.startsWith("⚠️") || line.startsWith("✅")) {
          return (
            <div key={index} className="text-sm text-[#d1d5db] ml-2">
              {line}
            </div>
          );
        }
        
        // Code-like text
        if (line.includes("`") && line.includes("`")) {
          const parts = line.split("`");
          return (
            <div key={index} className="text-sm text-[#d1d5db]">
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <code key={i} className="px-2 py-0.5 bg-[#1f2937] rounded text-[#22c55e] font-mono text-xs">
                    {part}
                  </code>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          );
        }
        
        // Regular text
        if (line.trim()) {
          return (
            <p key={index} className="text-sm text-[#d1d5db]">
              {line}
            </p>
          );
        }
        
        return null;
      })}
    </div>
  );
}
