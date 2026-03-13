import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileCode, Search, FilePlus } from "lucide-react";
import { motion } from "motion/react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

const fileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "algorithms",
        type: "folder",
        children: [
          { name: "binary_search.py", type: "file" },
          { name: "quick_sort.py", type: "file" },
          { name: "merge_sort.py", type: "file" },
        ],
      },
      {
        name: "data_structures",
        type: "folder",
        children: [
          { name: "linked_list.py", type: "file" },
          { name: "binary_tree.py", type: "file" },
        ],
      },
      { name: "main.py", type: "file" },
      { name: "utils.py", type: "file" },
    ],
  },
  { name: "tests", type: "folder", children: [{ name: "test_search.py", type: "file" }] },
  { name: "README.md", type: "file" },
  { name: "requirements.txt", type: "file" },
];

export function FileExplorer() {
  return (
    <div className="h-full bg-[#111827] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#1f2937]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
            Explorer
          </span>
          <button className="w-6 h-6 rounded hover:bg-[#1f2937] flex items-center justify-center transition-colors">
            <FilePlus className="w-4 h-4 text-[#9ca3af]" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full h-7 bg-[#1f2937] border border-[#374151] rounded pl-8 pr-2 text-xs text-[#e5e7eb] placeholder:text-[#6b7280] focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.map((node, index) => (
          <FileTreeNode key={index} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
}

function FileTreeNode({ node, depth }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  if (node.type === "folder") {
    return (
      <div>
        <motion.div
          whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.5)" }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer group"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
          )}
          <Folder className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-sm text-[#e5e7eb]">{node.name}</span>
        </motion.div>
        
        {isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {node.children.map((child, index) => (
              <FileTreeNode key={index} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.5)" }}
      className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer group"
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <FileCode className="w-4 h-4 text-[#22c55e]" />
      <span className="text-sm text-[#e5e7eb]">{node.name}</span>
    </motion.div>
  );
}
