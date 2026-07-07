import { useState, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TopNavBar } from "./TopNavBar";
import { FileExplorer } from "./FileExplorer";
import { CodeEditor } from "./CodeEditor";
import { Terminal } from "./Terminal";
import { AIMentorPanel } from "./AIMentorPanel";
import { WelcomeScreen } from "./WelcomeScreen";
import { AmIOnTrackBar } from "./AmIOnTrackBar";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface AIExplainData {
  summary: string;
  explanation: string;
  bugs: string[];
  assumptions: string[];
  optimization: string[];
}

export function MainIDE() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalError, setTerminalError] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiData, setAiData] = useState<AIExplainData | null>(null);
  const [activeAITab, setActiveAITab] = useState("Comments");
  const [showTerminal, setShowTerminal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ─── Run Code via backend ──────────────────────────────────────────────────
  const handleRunCode = useCallback(async () => {
    if (!code.trim()) return;
    setShowTerminal(true);
    setTerminalOutput([`> Running ${language} code...`]);
    setTerminalError(false);
    setApiError(null);

    try {
      const res = await fetch(`${API_BASE}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Execution failed");
      }

      const data = await res.json();
      const lines: string[] = [];

      if (data.output) lines.push(...data.output.split("\n"));
      if (data.stderr) {
        lines.push("── stderr ──");
        lines.push(...data.stderr.split("\n"));
        setTerminalError(true);
      }
      lines.push(`\nProcess exited with code ${data.exit_code ?? 0}`);
      setTerminalOutput(lines.filter(Boolean));
    } catch (e: any) {
      setTerminalOutput([`Error: ${e.message}`]);
      setTerminalError(true);
      setApiError(e.message);
    }
  }, [code, language]);

  // ─── Full AI Explain — populates all tabs ──────────────────────────────────
  const handleExplainCode = useCallback(async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setActiveAITab("Summary");
    setApiError(null);
    setAiData(null);
    setAiResponse("");

    try {
      const res = await fetch(`${API_BASE}/api/ai/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "AI explanation failed");
      }

      const data: AIExplainData = await res.json();
      setAiData(data);
      setAiResponse(data.summary);
    } catch (e: any) {
      setApiError(e.message);
      setAiResponse(`Error: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [code]);

  // ─── Line click — ask AI about that specific line ─────────────────────────
  const handleLineClick = useCallback(async (lineNumber: number) => {
    if (!code.trim()) return;
    setSelectedLine(lineNumber);
    setActiveAITab("Explanation");
    setIsAnalyzing(true);
    setApiError(null);

    const lines = code.split("\n");
    const lineContent = lines[lineNumber - 1] ?? "";
    const context = lines
      .slice(Math.max(0, lineNumber - 4), Math.min(lines.length, lineNumber + 3))
      .join("\n");

    try {
      const res = await fetch(`${API_BASE}/api/ai/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Explain line ${lineNumber} of my code: \`${lineContent.trim()}\`. Be concise and clear.`,
          code: context,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "AI mentor failed");
      }

      const data = await res.json();
      setAiResponse(`**Line ${lineNumber}:** ${lineContent.trim()}\n\n${data.response}`);
    } catch (e: any) {
      setApiError(e.message);
      setAiResponse(`Error explaining line ${lineNumber}: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [code]);

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

                <Panel defaultSize={30} minSize={15}>
                  <Terminal
                    output={terminalOutput}
                    onClear={() => { setTerminalOutput([]); setTerminalError(false); }}
                    hasError={terminalError}
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
              aiData={aiData}
              isAnalyzing={isAnalyzing}
              code={code}
              language={language}
              onExplainCode={handleExplainCode}
              apiError={apiError}
            />
          </Panel>
        </PanelGroup>
      </div>

      {/* Am I On Track Bar */}
      <AmIOnTrackBar code={code} />
    </div>
  );
}
