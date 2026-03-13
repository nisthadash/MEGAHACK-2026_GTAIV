import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TopNavBar } from "./TopNavBar";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";
import { Terminal } from "./Terminal";
import { AIMentorPanel } from "./AIMentorPanel";
import { WelcomeScreen } from "./WelcomeScreen";

export function MainIDE() {
  const [code, setCode] = useState("");
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [activeAITab, setActiveAITab] = useState("Summary");

  const handleRunCode = () => {
    setTerminalOutput([
      ...terminalOutput,
      "> Running code...",
      "Hello, World!",
      "Process finished with exit code 0",
    ]);
  };

  const handleExplainCode = () => {
    setIsAnalyzing(true);
    setActiveAITab("Summary");
    
    setTimeout(() => {
      setAiResponse(`# Code Summary

This Python code implements a binary search algorithm to find an element in a sorted array.

**Main Components:**
- \`binary_search(arr, target)\` function that uses divide-and-conquer approach
- Iterative implementation for better space complexity
- Returns the index of target element or -1 if not found

**Algorithm Flow:**
1. Initialize left and right pointers
2. Calculate middle index
3. Compare target with middle element
4. Adjust search range based on comparison
5. Repeat until element found or range exhausted

**Time Complexity:** O(log n)
**Space Complexity:** O(1)`);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
    setActiveAITab("Line Explanation");
    
    const lineExplanations: Record<number, string> = {
      1: "This function implements binary search, an efficient search algorithm for sorted arrays.",
      2: "Initialize the left pointer to the start of the array (index 0).",
      3: "Initialize the right pointer to the end of the array (last index).",
      4: "Continue searching while the left pointer hasn't crossed the right pointer.",
      5: "Calculate the middle index to divide the search space in half.",
      6: "Check if the middle element equals the target value.",
      7: "If found, return the index of the target element.",
      8: "If middle element is less than target, search in the right half.",
      9: "Move the left pointer to mid + 1 to eliminate the left half.",
      10: "Otherwise, the target is in the left half.",
      11: "Move the right pointer to mid - 1 to eliminate the right half.",
      12: "If element not found after exhausting all possibilities, return -1.",
    };

    setAiResponse(
      lineExplanations[lineNumber] || `Explanation for line ${lineNumber}: This line is part of the binary search implementation.`
    );
  };

  const handleAIAnalyze = () => {
    setIsAnalyzing(true);
    setActiveAITab("Bugs");
    
    setTimeout(() => {
      setAiResponse(`# Bug Analysis

✅ **No Critical Bugs Found**

**Potential Issues:**
⚠️ Line 5: Integer overflow possible for very large arrays
   - Suggestion: Use \`mid = left + (right - left) // 2\` instead

✅ **Code Quality:** Excellent
- Proper edge case handling
- Clean variable naming
- Efficient algorithm choice

**Security:** No vulnerabilities detected`);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="h-screen w-screen bg-[#020617] text-[#e5e7eb] flex flex-col overflow-hidden">
      <TopNavBar
        onRunCode={handleRunCode}
        onExplainCode={handleExplainCode}
        onAIAnalyze={handleAIAnalyze}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* File Explorer */}
          <Panel defaultSize={15} minSize={10} maxSize={25}>
            <FileExplorer />
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-[#1f2937] hover:bg-[#22c55e] transition-colors" />

          {/* Main Content Area */}
          <Panel defaultSize={55} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Code Editor */}
              <Panel defaultSize={70} minSize={40}>
                {code === "" ? (
                  <WelcomeScreen onCodeChange={setCode} />
                ) : (
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    selectedLine={selectedLine}
                    onLineClick={handleLineClick}
                  />
                )}
              </Panel>

              <PanelResizeHandle className="h-[1px] bg-[#1f2937] hover:bg-[#22c55e] transition-colors" />

              {/* Terminal */}
              <Panel defaultSize={30} minSize={15}>
                <Terminal
                  output={terminalOutput}
                  onClear={() => setTerminalOutput([])}
                />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-[#1f2937] hover:bg-[#22c55e] transition-colors" />

          {/* AI Mentor Panel */}
          <Panel defaultSize={30} minSize={20} maxSize={40}>
            <AIMentorPanel
              activeTab={activeAITab}
              onTabChange={setActiveAITab}
              response={aiResponse}
              isAnalyzing={isAnalyzing}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
