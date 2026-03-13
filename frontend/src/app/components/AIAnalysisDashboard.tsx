import { ArrowLeft, TrendingUp, Cpu, Zap, CheckCircle2, AlertTriangle, Code2, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export function AIAnalysisDashboard() {
  const navigate = useNavigate();

  const qualityData = [
    { name: "Quality", value: 87, fill: "#22c55e" },
  ];

  const complexityData = [
    { name: "Functions", complexity: 8 },
    { name: "Loops", complexity: 12 },
    { name: "Conditions", complexity: 6 },
    { name: "Recursion", complexity: 4 },
  ];

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
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg">AI Analysis Dashboard</span>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#ef4444]/20 transition-all flex items-center justify-center group"
        >
          <LogOut className="w-4 h-4 text-[#9ca3af] group-hover:text-[#ef4444]" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon={<Code2 className="w-5 h-5" />}
              title="Total Lines"
              value="127"
              change="+12%"
              positive
            />
            <MetricCard
              icon={<Cpu className="w-5 h-5" />}
              title="Functions"
              value="8"
              change="+2"
              positive
            />
            <MetricCard
              icon={<Zap className="w-5 h-5" />}
              title="Algorithms"
              value="3"
              change="Detected"
              positive
            />
            <MetricCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              title="Code Quality"
              value="87%"
              change="Excellent"
              positive
            />
          </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Code Summary */}
            <AnalysisCard title="Code Summary">
              <div className="space-y-4">
                <SummaryItem
                  label="Primary Language"
                  value="Python 3.9"
                  icon="🐍"
                />
                <SummaryItem
                  label="Code Style"
                  value="PEP 8 Compliant"
                  icon="✅"
                />
                <SummaryItem
                  label="Documentation"
                  value="Needs Improvement"
                  icon="📝"
                  warning
                />
              </div>
            </AnalysisCard>

            {/* Detected Algorithms */}
            <AnalysisCard title="Detected Algorithms">
              <div className="space-y-3">
                <AlgorithmItem
                  name="Binary Search"
                  complexity="O(log n)"
                  type="Divide & Conquer"
                />
                <AlgorithmItem
                  name="Bubble Sort"
                  complexity="O(n²)"
                  type="Sorting"
                />
                <AlgorithmItem
                  name="Linear Search"
                  complexity="O(n)"
                  type="Sequential"
                />
              </div>
            </AnalysisCard>

            {/* Time & Space Complexity */}
            <AnalysisCard title="Complexity Analysis">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#9ca3af]">Time Complexity</span>
                    <span className="text-sm font-semibold text-[#22c55e]">O(log n)</span>
                  </div>
                  <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "25%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-[#22c55e]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#9ca3af]">Space Complexity</span>
                    <span className="text-sm font-semibold text-[#3b82f6]">O(1)</span>
                  </div>
                  <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "10%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-[#3b82f6]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1f2937]">
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={complexityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280" 
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#e5e7eb",
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="complexity" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                        {complexityData.map((entry, index) => (
                          <Cell
                            key={`bar-cell-${entry.name}-${index}`}
                            fill={index % 2 === 0 ? "#22c55e" : "#3b82f6"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </AnalysisCard>

            {/* Code Quality Score */}
            <AnalysisCard title="Code Quality Score">
              <div className="flex items-center justify-center h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={qualityData}
                    startAngle={90}
                    endAngle={-270}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      isAnimationActive={false}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                {/* Text overlay outside SVG to avoid key conflicts */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-4xl font-bold text-[#22c55e]">87%</div>
                  <div className="text-sm text-[#9ca3af]">Excellent</div>
                </div>
              </div>
            </AnalysisCard>
          </div>

          {/* Optimization Suggestions */}
          <AnalysisCard title="Optimization Suggestions">
            <div className="space-y-3">
              <OptimizationItem
                type="performance"
                title="Use mid = left + (right - left) // 2"
                description="Prevent integer overflow for large arrays"
                priority="medium"
              />
              <OptimizationItem
                type="readability"
                title="Add docstrings to functions"
                description="Improve code documentation for better maintainability"
                priority="low"
              />
              <OptimizationItem
                type="best-practice"
                title="Add type hints"
                description="Use Python type annotations for better code clarity"
                priority="low"
              />
              <OptimizationItem
                type="security"
                title="Input validation recommended"
                description="Add checks to ensure array is sorted before binary search"
                priority="high"
              />
            </div>
          </AnalysisCard>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 hover:border-[#22c55e] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
          {icon}
        </div>
        <span className="text-sm text-[#9ca3af]">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-[#e5e7eb]">{value}</span>
        <span className={`text-xs ${positive ? "text-[#22c55e]" : "text-[#9ca3af]"}`}>
          {change}
        </span>
      </div>
    </motion.div>
  );
}

function AnalysisCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-[#1f2937] rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

function SummaryItem({
  label,
  value,
  icon,
  warning,
}: {
  label: string;
  value: string;
  icon: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#1f2937] rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-[#9ca3af]">{label}</span>
      </div>
      <span className={`text-sm font-medium ${warning ? "text-[#f59e0b]" : "text-[#e5e7eb]"}`}>
        {value}
      </span>
    </div>
  );
}

function AlgorithmItem({
  name,
  complexity,
  type,
}: {
  name: string;
  complexity: string;
  type: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#1f2937] rounded-lg hover:bg-[#374151] transition-colors">
      <div>
        <div className="font-medium text-sm text-[#e5e7eb] mb-1">{name}</div>
        <div className="text-xs text-[#6b7280]">{type}</div>
      </div>
      <div className="px-3 py-1 bg-[#22c55e]/10 rounded-full">
        <span className="text-xs font-mono text-[#22c55e]">{complexity}</span>
      </div>
    </div>
  );
}

function OptimizationItem({
  type,
  title,
  description,
  priority,
}: {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}) {
  const priorityColors = {
    high: "text-[#ef4444]",
    medium: "text-[#f59e0b]",
    low: "text-[#3b82f6]",
  };

  const typeIcons = {
    performance: "⚡",
    readability: "📖",
    "best-practice": "✨",
    security: "🔒",
  };

  return (
    <div className="flex gap-4 p-4 bg-[#1f2937] rounded-lg hover:bg-[#374151] transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-xl">
        {typeIcons[type as keyof typeof typeIcons]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-[#e5e7eb]">{title}</span>
          <span className={`text-xs uppercase font-semibold ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
        <p className="text-xs text-[#9ca3af]">{description}</p>
      </div>
      <AlertTriangle className={`w-4 h-4 ${priorityColors[priority]}`} />
    </div>
  );
}