import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Code2, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface AmIOnTrackBarProps {
  code: string;
}

type StatusType = "success" | "warning" | "error" | "idle" | "loading";

interface Status {
  type: StatusType;
  message: string;
  details: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

const IDLE: Status = {
  type: "idle",
  message: "Ready to code",
  details: "Write or paste code to get instant AI feedback",
  icon: <Code2 className="w-5 h-5" />,
  bgColor: "bg-[#111827]",
  borderColor: "border-[#1f2937]",
};

export function AmIOnTrackBar({ code }: AmIOnTrackBarProps) {
  const [status, setStatus] = useState<Status>(IDLE);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!code || code.trim().length < 10) {
      setStatus(IDLE);
      return;
    }

    // Show loading immediately when typing stops
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setStatus({
      ...IDLE,
      type: "loading",
      message: "Analyzing code…",
      details: "Running static analysis",
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
    });

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) throw new Error("Analysis failed");

        const data = await res.json();
        const quality: number = data.quality_score ?? 50;
        const complexity: number = data.complexity_score ?? 0;
        const lang: string = data.language_detected ?? "Code";
        const lines: number = data.total_lines ?? 0;

        if (quality < 40 || complexity > 80) {
          setStatus({
            type: "error",
            message: "🔴 High complexity or low quality detected",
            details: `${lang} • ${lines} lines • Quality: ${Math.round(quality)}% • Complexity: ${Math.round(complexity)}%`,
            icon: <XCircle className="w-5 h-5" />,
            bgColor: "bg-[#7f1d1d]",
            borderColor: "border-[#dc2626]",
          });
        } else if (quality < 70 || complexity > 50) {
          setStatus({
            type: "warning",
            message: "🟡 Code quality could be improved",
            details: `${lang} • ${lines} lines • Quality: ${Math.round(quality)}% • Complexity: ${Math.round(complexity)}%`,
            icon: <AlertTriangle className="w-5 h-5" />,
            bgColor: "bg-[#713f12]",
            borderColor: "border-[#f59e0b]",
          });
        } else {
          setStatus({
            type: "success",
            message: "🟢 Looks good! Code quality is solid",
            details: `${lang} • ${lines} lines • Quality: ${Math.round(quality)}% • Complexity: ${Math.round(complexity)}%`,
            icon: <CheckCircle2 className="w-5 h-5" />,
            bgColor: "bg-[#14532d]",
            borderColor: "border-[#22c55e]",
          });
        }
      } catch {
        // Fallback to simple heuristic if backend is down
        const lines = code.split("\n").filter((l) => l.trim()).length;
        const hasDivisionByZero = code.includes("/ 0") || code.includes("/0");
        const hasInfiniteLoop = code.includes("while(true)") || code.includes("while (true)");

        if (hasDivisionByZero) {
          setStatus({
            type: "error",
            message: "🔴 Error — division by zero detected",
            details: `${lines} lines • 1 error`,
            icon: <XCircle className="w-5 h-5" />,
            bgColor: "bg-[#7f1d1d]",
            borderColor: "border-[#dc2626]",
          });
        } else if (hasInfiniteLoop) {
          setStatus({
            type: "warning",
            message: "🟡 Warning — potential infinite loop",
            details: `${lines} lines • 1 warning`,
            icon: <AlertTriangle className="w-5 h-5" />,
            bgColor: "bg-[#713f12]",
            borderColor: "border-[#f59e0b]",
          });
        } else {
          setStatus({
            type: "success",
            message: "🟢 Looks good!",
            details: `${lines} lines • (offline check)`,
            icon: <CheckCircle2 className="w-5 h-5" />,
            bgColor: "bg-[#14532d]",
            borderColor: "border-[#22c55e]",
          });
        }
      }
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`h-12 ${status.bgColor} border-t-2 ${status.borderColor} transition-all duration-500 flex items-center px-6 gap-4`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`${
            status.type === "success"
              ? "text-[#22c55e]"
              : status.type === "warning"
              ? "text-[#f59e0b]"
              : status.type === "error"
              ? "text-[#ef4444]"
              : status.type === "loading"
              ? "text-[#3b82f6]"
              : "text-[#3b82f6]"
          }`}
        >
          {status.icon}
        </motion.div>

        <div className="flex-1 flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="font-semibold text-sm"
          >
            {status.message}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-[#9ca3af]"
          >
            {status.details}
          </motion.span>
        </div>

        {status.type !== "idle" && status.type !== "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-xs text-[#9ca3af]">Live Analysis</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
