import { Code2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  onCodeChange: (code: string) => void;
}

const sampleCode = `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`;

export function WelcomeScreen({ onCodeChange }: WelcomeScreenProps) {
  return (
    <div className="h-full bg-[#020617] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#22c55e] to-[#3b82f6] rounded-2xl flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-[#e5e7eb] mb-4"
        >
          Welcome to ExplainMyCode
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-[#9ca3af] mb-8"
        >
          Paste or write code to get instant AI explanations.
        </motion.p>

        {/* Supported Languages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-sm text-[#6b7280] mb-3">Supported languages:</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {["Python", "JavaScript", "C++", "Java"].map((lang, index) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-4 py-2 bg-[#111827] border border-[#1f2937] rounded-lg text-sm text-[#e5e7eb]"
              >
                {lang}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCodeChange(sampleCode)}
          className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg font-semibold flex items-center gap-2 mx-auto shadow-lg shadow-[#22c55e]/30 transition-colors"
        >
          <Code2 className="w-5 h-5" />
          Try Sample Code
        </motion.button>
      </motion.div>
    </div>
  );
}
