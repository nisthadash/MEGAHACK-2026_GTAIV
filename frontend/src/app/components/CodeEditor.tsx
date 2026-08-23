import { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  selectedLine: number | null;
  onLineClick: (lineNumber: number) => void;
  language?: string;
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

export function CodeEditor({ code, onChange, selectedLine, onLineClick, language = "python" }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define custom theme colors matching the SaaS dark theme (#020617, #111827, #1f2937)
    monaco.editor.defineTheme("explainmycode-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
        { token: "string", foreground: "fbbf24" },
        { token: "number", foreground: "fb923c" },
        { token: "type", foreground: "60a5fa" },
      ],
      colors: {
        "editor.background": "#020617",
        "editor.foreground": "#e5e7eb",
        "editorLineNumber.foreground": "#4b5563",
        "editorLineNumber.activeForeground": "#22c55e",
        "editor.lineHighlightBackground": "#1e293b50",
        "editorGutter.background": "#111827",
      },
    });

    monaco.editor.setTheme("explainmycode-theme");

    // Listen to gutter and editor body clicks to select line
    editor.onMouseDown((e: any) => {
      if (e.target && e.target.position) {
        onLineClick(e.target.position.lineNumber);
      }
    });

    // Initial value setup
    if (!code) {
      onChange(defaultCode);
    }
  };

  // Sync decorations for selectedLine
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      if (selectedLine) {
        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
          {
            range: new monaco.Range(selectedLine, 1, selectedLine, 1),
            options: {
              isWholeLine: true,
              // Use Monaco's backgroundColor token instead of Tailwind className
              className: "selected-line-highlight",
              linesDecorationsClassName: "selected-line-gutter",
            },
          },
        ]);
      } else {
        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      }
    }
  }, [selectedLine]);

  return (
    <div className="h-full w-full bg-[#020617] relative">
      <Editor
        height="100%"
        width="100%"
        language={language === "cpp" ? "cpp" : language === "c" ? "c" : language}
        value={code || defaultCode}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full w-full bg-[#020617] text-[#9ca3af] text-sm">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#22c55e] mr-3"></div>
            Loading Editor...
          </div>
        }
        options={{
          fontSize: 14,
          lineHeight: 24,
          fontFamily: "Fira Code, JetBrains Mono, source-code-pro, Menlo, Monaco, Consolas, monospace",
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
