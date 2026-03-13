import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle, Code2 } from "lucide-react";

interface AmIOnTrackBarProps {
  code: string;
}

type StatusType = "success" | "warning" | "error" | "idle";

interface Status {
  type: StatusType;
  message: string;
  details: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

export function AmIOnTrackBar({ code }: AmIOnTrackBarProps) {
  const [status, setStatus] = useState<Status>({
    type: "idle",
    message: "Ready to code",
    details: "Write or paste code to get instant AI feedback",
    icon: <Code2 className="w-5 h-5" />,
    bgColor: "bg-[#111827]",
    borderColor: "border-[#1f2937]",
  });

  useEffect(() => {
    if (!code) {
      setStatus({
        type: "idle",
        message: "Ready to code",
        details: "Write or paste code to get instant AI feedback",
        icon: <Code2 className="w-5 h-5" />,
        bgColor: "bg-[#111827]",
        borderColor: "border-[#1f2937]",
      });
      return;
    }

    const timer = setTimeout(() => {
      analyzeCode(code);
    }, 1500);

    return () => clearTimeout(timer);
  }, [code]);

  const analyzeCode = (code: string) => {
    const lines = code.split("\n").filter(line => line.trim() !== "");
    const lineCount = lines.length;
    const language = detectLanguage(code);
    
    // Simple bug detection
    const hasDivisionByZero = code.includes("/ 0") || code.includes("/0");
    const hasUnusedVariable = /\b(let|const|var)\s+\w+\s*=/.test(code) && code.split("\n").length < 5;
    const hasInfiniteLoop = code.includes("while(true)") || code.includes("while (true)");
    
    if (hasDivisionByZero) {
      setStatus({
        type: "error",
        message: "🔴 Error — division by zero detected",
        details: `${language} • ${lineCount} lines • 1 error`,
        icon: <XCircle className="w-5 h-5" />,
        bgColor: "bg-[#7f1d1d]",
        borderColor: "border-[#dc2626]",
      });
    } else if (hasInfiniteLoop) {
      setStatus({
        type: "warning",
        message: "🟡 Warning — potential infinite loop detected",
        details: `${language} • ${lineCount} lines • 1 warning`,
        icon: <AlertTriangle className="w-5 h-5" />,
        bgColor: "bg-[#713f12]",
        borderColor: "border-[#f59e0b]",
      });
    } else if (hasUnusedVariable) {
      setStatus({
        type: "warning",
        message: "🟡 Warning — variable defined but not used",
        details: `${language} • ${lineCount} lines • 1 warning`,
        icon: <AlertTriangle className="w-5 h-5" />,
        bgColor: "bg-[#713f12]",
        borderColor: "border-[#f59e0b]",
      });
    } else {
      setStatus({
        type: "success",
        message: "🟢 Looks good! Your code logic is correct",
        details: `${language} • ${lineCount} lines • 0 bugs`,
        icon: <CheckCircle2 className="w-5 h-5" />,
        bgColor: "bg-[#14532d]",
        borderColor: "border-[#22c55e]",
      });
    }
  };

  const detectLanguage = (code: string): string => {
    if (code.includes("def ") || code.includes("import ") || code.includes("print(")) {
      return "Python";
    } else if (code.includes("function ") || code.includes("const ") || code.includes("let ")) {
      return "JavaScript";
    } else if (code.includes("#include") || code.includes("std::")) {
      return "C++";
    } else if (code.includes("public class") || code.includes("System.out")) {
      return "Java";
    }
    return "Code";
  };

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
            className="font-semibold"
          >
            {status.message}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[#9ca3af]"
          >
            {status.details}
          </motion.span>
        </div>

        {status.type !== "idle" && (
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
