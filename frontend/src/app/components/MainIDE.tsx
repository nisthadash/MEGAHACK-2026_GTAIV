import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TopNavBar } from "./TopNavBar";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";
import { Terminal } from "./Terminal";
import { AIMentorPanel } from "./AIMentorPanel";
import { WelcomeScreen } from "./WelcomeScreen";
import { AmIOnTrackBar } from "./AmIOnTrackBar";

export function MainIDE() {
  const [code, setCode] = useState("");
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState("");
  const [activeAITab, setActiveAITab] = useState("Summary");
  const [showTerminal, setShowTerminal] = useState(false);

  const handleRunCode = () => {
    setShowTerminal(true);
    setTerminalOutput([
      ...terminalOutput,
      "> Running code...",
      "Hello, World!",
      "Process finished with exit code 0",
    ]);
  };

  const handleExplainCode = () => {
    setIsAnalyzing(true);
    setActiveAITab("Explanation");
    
    setTimeout(() => {
      setAiResponse(`# Code Explanation

**Lines 1-4 — Setup**
Initialize the binary search function with array and target parameters. Set up left and right pointers to define the search boundaries.

**Lines 5-10 — Main Loop**
The while loop continues as long as left <= right, ensuring we haven't exhausted all search possibilities. Calculate the middle index to divide the array.

**Lines 11-15 — Return Value**
Return the index if element is found, otherwise return -1 to indicate element doesn't exist in the array.

**Algorithm Analysis:**
- **Time Complexity:** O(log n) - Halves search space each iteration
- **Space Complexity:** O(1) - Uses constant extra space
- **Best for:** Sorted arrays with frequent searches`);
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
    setActiveAITab("Assumptions");
    
    setTimeout(() => {
      setAiResponse(`# Code Assumptions

📌 **Input Assumption**
Assumes the input array is already sorted in ascending order. Binary search will fail on unsorted data.

📌 **Data Type Assumption**
Assumes all array elements are comparable using standard comparison operators (<, >, ==).

📌 **Index Assumption**
Assumes valid array indices - no negative values or out-of-bounds access.

📌 **Uniqueness Assumption**
If duplicates exist, returns index of any matching element (not necessarily the first occurrence).

**Recommendations:**
- Add input validation to check if array is sorted
- Consider handling edge cases (empty array, null values)
- Add documentation about duplicate handling behavior`);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="h-screen w-screen bg-[#020617] text-[#e5e7eb] flex flex-col overflow-hidden">
      <TopNavBar onRunCode={handleRunCode} />
      
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* File Explorer */}
          <Panel defaultSize={15} minSize={10} maxSize={25}>
            <FileExplorer />
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-[#1f2937] hover:bg-[#22c55e] transition-colors" />

          {/* Main Content Area */}
          <Panel defaultSize={55} minSize={30}>
            {showTerminal ? (
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
            ) : (
              <div className="h-full">
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
              </div>
            )}
          </Panel>

          <PanelResizeHandle className="w-[1px] bg-[#1f2937] hover:bg-[#22c55e] transition-colors" />

          {/* AI Mentor Panel */}
          <Panel defaultSize={30} minSize={20} maxSize={40}>
            <AIMentorPanel
              activeTab={activeAITab}
              onTabChange={setActiveAITab}
              response={aiResponse}
              isAnalyzing={isAnalyzing}
              code={code}
            />
          </Panel>
        </PanelGroup>
      </div>

      {/* Am I On Track Bar */}
      <AmIOnTrackBar code={code} />
    </div>
  );
}