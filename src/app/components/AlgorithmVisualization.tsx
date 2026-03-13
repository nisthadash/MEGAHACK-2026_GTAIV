import { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

type AlgorithmType = "sorting" | "binary-search" | "recursion" | "graph";

export function AlgorithmVisualization() {
  const navigate = useNavigate();
  const [activeAlgorithm, setActiveAlgorithm] = useState<AlgorithmType>("sorting");
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setStep((prev) => (prev + 1) % 10);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="h-screen w-screen bg-[#020617] text-[#e5e7eb] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-[#111827] border-b border-[#1f2937] flex items-center px-4 gap-4">
        <button
          onClick={() => navigate("/ide")}
          className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 bg-gradient-to-br from-[#22c55e] to-[#3b82f6] rounded-lg flex items-center justify-center">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            >
              ⚡
            </motion.div>
          </div>
          <span className="font-semibold text-lg">Algorithm Visualization</span>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#ef4444]/20 transition-all flex items-center justify-center group"
        >
          <LogOut className="w-4 h-4 text-[#9ca3af] group-hover:text-[#ef4444]" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Algorithm Selection */}
        <div className="w-64 bg-[#111827] border-r border-[#1f2937] p-4">
          <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">
            Select Algorithm
          </h3>
          <div className="space-y-2">
            {[
              { id: "sorting", name: "Bubble Sort", icon: "📊" },
              { id: "binary-search", name: "Binary Search", icon: "🔍" },
              { id: "recursion", name: "Fibonacci Recursion", icon: "🌲" },
              { id: "graph", name: "Graph Traversal", icon: "🕸️" },
            ].map((algo) => (
              <button
                key={algo.id}
                onClick={() => {
                  setActiveAlgorithm(algo.id as AlgorithmType);
                  setStep(0);
                  setIsPlaying(false);
                }}
                className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                  activeAlgorithm === algo.id
                    ? "bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e]"
                    : "bg-[#1f2937] border border-[#374151] text-[#e5e7eb] hover:bg-[#374151]"
                }`}
              >
                <span className="text-xl">{algo.icon}</span>
                <span className="font-medium text-sm">{algo.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col">
          {/* Controls */}
          <div className="h-16 bg-[#111827] border-b border-[#1f2937] flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStep(0);
                setIsPlaying(false);
              }}
              className="w-10 h-10 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] transition-colors flex items-center justify-center shadow-lg shadow-[#22c55e]/30"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep((prev) => (prev + 1) % 10)}
              className="w-10 h-10 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-colors flex items-center justify-center"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Visualization Canvas */}
          <div className="flex-1 p-8">
            <AnimatePresence mode="wait">
              {activeAlgorithm === "sorting" && <SortingVisualization key="sorting" step={step} />}
              {activeAlgorithm === "binary-search" && <BinarySearchVisualization key="binary" step={step} />}
              {activeAlgorithm === "recursion" && <RecursionVisualization key="recursion" step={step} />}
              {activeAlgorithm === "graph" && <GraphVisualization key="graph" step={step} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortingVisualization({ step }: { step: number }) {
  const values = [64, 34, 25, 12, 22, 11, 90, 88, 45, 50];
  const activeIndex = step % values.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex items-end justify-center gap-2"
    >
      {values.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{
            height: `${(value / 90) * 100}%`,
            backgroundColor: index === activeIndex ? "#22c55e" : index < activeIndex ? "#3b82f6" : "#374151",
          }}
          className="w-12 rounded-t-lg relative"
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#9ca3af]">
            {value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function BinarySearchVisualization({ step }: { step: number }) {
  const values = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const target = 11;
  const searchIndex = Math.min(step, values.length - 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center gap-8"
    >
      <div className="text-center mb-4">
        <p className="text-sm text-[#9ca3af] mb-2">Searching for: <span className="text-[#22c55e] font-bold">{target}</span></p>
        <p className="text-xs text-[#6b7280]">Step {step + 1}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {values.map((value, index) => (
          <motion.div
            key={index}
            animate={{
              scale: index === searchIndex ? 1.2 : 1,
              backgroundColor:
                value === target && index === searchIndex
                  ? "#22c55e"
                  : index === searchIndex
                  ? "#3b82f6"
                  : "#374151",
            }}
            className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-white"
          >
            {value}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RecursionVisualization({ step }: { step: number }) {
  const depth = Math.min(step, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center"
    >
      <div className="text-center mb-8">
        <p className="text-sm text-[#9ca3af] mb-2">Fibonacci Recursion Tree</p>
        <p className="text-xs text-[#6b7280]">Depth: {depth}</p>
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: depth }).map((_, level) => (
          <motion.div
            key={level}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: level * 0.2 }}
            className="flex items-center justify-center gap-4"
          >
            {Array.from({ length: Math.pow(2, level) }).map((_, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center text-white font-bold text-sm"
              >
                F({level})
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function GraphVisualization({ step }: { step: number }) {
  const nodes = [
    { id: 1, x: 50, y: 50 },
    { id: 2, x: 150, y: 50 },
    { id: 3, x: 100, y: 150 },
    { id: 4, x: 200, y: 150 },
    { id: 5, x: 50, y: 250 },
  ];

  const visitedNodes = nodes.slice(0, Math.min(step + 1, nodes.length));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex items-center justify-center"
    >
      <svg width="300" height="300" className="border border-[#1f2937] rounded-lg bg-[#111827]">
        {/* Edges */}
        <line x1="50" y1="50" x2="150" y2="50" stroke="#374151" strokeWidth="2" />
        <line x1="50" y1="50" x2="100" y2="150" stroke="#374151" strokeWidth="2" />
        <line x1="150" y1="50" x2="200" y2="150" stroke="#374151" strokeWidth="2" />
        <line x1="100" y1="150" x2="50" y2="250" stroke="#374151" strokeWidth="2" />

        {/* Nodes */}
        {nodes.map((node, index) => {
          const isVisited = index < visitedNodes.length;
          return (
            <motion.circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r="20"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                fill: isVisited ? "#22c55e" : "#374151",
              }}
              transition={{ delay: index * 0.3 }}
            />
          );
        })}

        {/* Labels */}
        {nodes.map((node) => (
          <text
            key={`label-${node.id}`}
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dy=".3em"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {node.id}
          </text>
        ))}
      </svg>
    </motion.div>
  );
}