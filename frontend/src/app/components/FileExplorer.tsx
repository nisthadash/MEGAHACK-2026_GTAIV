import { useState, useEffect, useCallback } from "react";
import {
  ChevronRight, ChevronDown, Folder, FileCode,
  FilePlus, Trash2, Loader2, RefreshCw, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getToken } from "../auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface BackendFile {
  id: number;
  name: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface FileExplorerProps {
  /** Called when a file is clicked — load its content into the editor */
  onFileOpen?: (content: string, language: string, name: string) => void;
  /** Current code in the editor — used when saving */
  currentCode?: string;
  /** Current language — used when creating new file */
  currentLanguage?: string;
}

const LANG_ICONS: Record<string, string> = {
  python: "🐍",
  javascript: "🟨",
  cpp: "⚙️",
  c: "🔧",
  java: "☕",
};

export function FileExplorer({ onFileOpen, currentCode, currentLanguage }: FileExplorerProps) {
  const [files, setFiles] = useState<BackendFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeFileId, setActiveFileId] = useState<number | null>(null);

  const token = getToken();

  const fetchFiles = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to load files");
      }
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleCreateFile = async () => {
    const name = newFileName.trim();
    if (!name || !token) return;

    const lang = currentLanguage ?? "python";
    const ext = lang === "python" ? ".py" : lang === "javascript" ? ".js" : lang === "cpp" ? ".cpp" : lang === "c" ? ".c" : ".java";
    const fullName = name.includes(".") ? name : `${name}${ext}`;

    try {
      const res = await fetch(`${API_BASE}/api/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          content: currentCode ?? "",
          language: lang,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Failed to create file");
        return;
      }
      setNewFileName("");
      setIsCreating(false);
      fetchFiles();
    } catch {
      setError("Failed to create file");
    }
  };

  const handleDeleteFile = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/api/files/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (activeFileId === id) setActiveFileId(null);
      fetchFiles();
    } catch {
      setError("Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenFile = (file: BackendFile) => {
    setActiveFileId(file.id);
    onFileOpen?.(file.content, file.language, file.name);
  };

  return (
    <div className="h-full bg-[#111827] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#1f2937] flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
            Explorer
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchFiles}
              title="Refresh"
              className="w-6 h-6 rounded hover:bg-[#1f2937] flex items-center justify-center transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#9ca3af]" />
            </button>
            <button
              onClick={() => setIsCreating(true)}
              title="New File"
              className="w-6 h-6 rounded hover:bg-[#1f2937] flex items-center justify-center transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5 text-[#9ca3af]" />
            </button>
          </div>
        </div>

        {/* New file input */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-1 mt-1"
            >
              <input
                autoFocus
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFile();
                  if (e.key === "Escape") { setIsCreating(false); setNewFileName(""); }
                }}
                placeholder="filename.py"
                className="flex-1 h-7 bg-[#1f2937] border border-[#374151] rounded px-2 text-xs text-[#e5e7eb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#22c55e] transition-colors"
              />
              <button
                onClick={handleCreateFile}
                className="px-2 h-7 rounded bg-[#22c55e]/20 text-[#22c55e] text-xs hover:bg-[#22c55e]/30 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => { setIsCreating(false); setNewFileName(""); }}
                className="px-1 h-7 rounded text-[#9ca3af] hover:text-[#ef4444] text-xs transition-colors"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-[#9ca3af] p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading files…
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 text-xs text-[#fca5a5] p-2 bg-[#7f1d1d]/20 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        ) : files.length === 0 ? (
          <div className="text-xs text-[#6b7280] p-2 italic">
            No files yet. Click + to create one.
          </div>
        ) : (
          <div>
            {/* Group under a "My Files" folder node */}
            <div className="flex items-center gap-1 px-2 py-1 text-[#9ca3af]">
              <ChevronDown className="w-3.5 h-3.5" />
              <Folder className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-sm text-[#e5e7eb]">My Files</span>
            </div>
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  onClick={() => handleOpenFile(file)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group transition-colors ${
                    activeFileId === file.id
                      ? "bg-[#22c55e]/10 border border-[#22c55e]/20"
                      : "hover:bg-[#1f2937]"
                  }`}
                  style={{ paddingLeft: "28px" }}
                >
                  <span className="text-sm">{LANG_ICONS[file.language] ?? "📄"}</span>
                  <FileCode className={`w-4 h-4 flex-shrink-0 ${activeFileId === file.id ? "text-[#22c55e]" : "text-[#6b7280]"}`} />
                  <span className={`text-xs flex-1 truncate ${activeFileId === file.id ? "text-[#22c55e]" : "text-[#e5e7eb]"}`}>
                    {file.name}
                  </span>
                  <button
                    onClick={(e) => handleDeleteFile(file.id, e)}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded hover:bg-[#ef4444]/20 transition-all"
                    title="Delete"
                  >
                    {deletingId === file.id
                      ? <Loader2 className="w-3 h-3 animate-spin text-[#9ca3af]" />
                      : <Trash2 className="w-3 h-3 text-[#9ca3af] hover:text-[#ef4444]" />
                    }
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
