import { useRef, useEffect } from "react";
import { motion } from "motion/react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  selectedLine: number | null;
  onLineClick: (lineNumber: number) => void;
}

const defaultCode = `def binary_search(arr, target):
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
    return -1

# Example usage
numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
result = binary_search(numbers, 7)
print(f"Element found at index: {result}")`;

export function CodeEditor({ code, onChange, selectedLine, onLineClick }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayCode = code || defaultCode;
  const lines = displayCode.split("\n");

  useEffect(() => {
    if (code === "" && textareaRef.current) {
      onChange(defaultCode);
    }
  }, []);

  return (
    <div className="h-full bg-[#020617] flex">
      {/* Line Numbers */}
      <div className="bg-[#111827] border-r border-[#1f2937] py-4 pr-4 pl-3 select-none">
        {lines.map((_, index) => {
          const lineNumber = index + 1;
          const isSelected = selectedLine === lineNumber;
          
          return (
            <motion.div
              key={index}
              onClick={() => onLineClick(lineNumber)}
              className={`text-right font-mono text-sm h-6 leading-6 cursor-pointer transition-colors ${
                isSelected
                  ? "text-[#22c55e] font-semibold"
                  : "text-[#6b7280] hover:text-[#9ca3af]"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {lineNumber}
            </motion.div>
          );
        })}
      </div>

      {/* Code Content */}
      <div className="flex-1 relative overflow-auto">
        {/* Syntax Highlighted Display */}
        <div className="absolute inset-0 p-4 pointer-events-none font-mono text-sm leading-6">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isSelected = selectedLine === lineNumber;
            
            return (
              <motion.div
                key={index}
                className={`transition-colors ${
                  isSelected ? "bg-[#22c55e]/10" : ""
                }`}
                initial={false}
                animate={isSelected ? { x: [0, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <SyntaxHighlightedLine line={line} />
              </motion.div>
            );
          })}
        </div>

        {/* Editable Textarea */}
        <textarea
          ref={textareaRef}
          value={displayCode}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 p-4 bg-transparent text-transparent caret-[#22c55e] resize-none outline-none font-mono text-sm leading-6 selection:bg-[#3b82f6]/30"
          style={{
            caretColor: "#22c55e",
          }}
        />
      </div>
    </div>
  );
}

function SyntaxHighlightedLine({ line }: { line: string }) {
  // Simple syntax highlighting for Python
  const keywords = /\b(def|return|if|elif|else|while|for|in|import|from|class|try|except|finally|with|as|True|False|None|and|or|not|is|lambda|yield|pass|break|continue|raise|assert|del|global|nonlocal|async|await)\b/g;
  const strings = /(["'`])((?:\\.|(?!\1).)*?)\1/g;
  const comments = /(#.*$)/gm;
  const numbers = /\b(\d+)\b/g;
  const functions = /\b([a-zA-Z_]\w*)\s*(?=\()/g;

  let highlighted = line;
  
  // Replace in order: comments, strings, keywords, functions, numbers
  highlighted = highlighted.replace(comments, '<span class="text-[#6b7280] italic">$1</span>');
  highlighted = highlighted.replace(strings, '<span class="text-[#fbbf24]">$&</span>');
  highlighted = highlighted.replace(keywords, '<span class="text-[#c084fc]">$&</span>');
  highlighted = highlighted.replace(functions, '<span class="text-[#60a5fa]">$&</span>');
  highlighted = highlighted.replace(numbers, '<span class="text-[#fb923c]">$&</span>');

  return (
    <div
      className="text-[#e5e7eb]"
      dangerouslySetInnerHTML={{ __html: highlighted || " " }}
    />
  );
}
