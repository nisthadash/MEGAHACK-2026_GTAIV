import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Cpu, Zap, CheckCircle2, AlertTriangle, Code2, LogOut, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface AnalysisResult {
  total_lines: number;
  functions: number;
  loops: number;
  conditions: number;
  complexity_score: number;
  quality_score: number;
  language_detected: string;
}

// Persist latest code from the IDE via localStorage
const CODE_KEY = "emc_last_code";

export function saveCodeSnapshot(code: string) {
  if (code.trim()) localStorage.setItem(CODE_KEY, code);
}

function getCodeSnapshot(): string {
  return localStorage.getItem(CODE_KEY) ?? "";
}

export function AIAnalysisDashboard() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const code = getCodeSnapshot();

  const runAnalysis = async () => {
    const src = getCodeSnapshot();
    if (!src.trim()) {
      setError("No code to analyze. Write some code in the IDE first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: src }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Analysis failed");
      }
      const data: AnalysisResult = await res.json();
      setAnalysis(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run on mount if there's code available
  useEffect(() => {
    if (code.trim()) runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const qualityData = analysis ? [{ name: "Quality", value: Math.round(analysis.quality_score), fill: "#22c55e" }] : [];

  const complexityData = analysis
    ? [
        { name: "Functions", complexity: analysis.functions },
        { name: "Loops", complexity: analysis.loops },
        { name: "Conditions", complexity: analysis.conditions },
        { name: "Complexity", complexity: Math.round(analysis.complexity_score / 10) },
      ]
    : [];

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
          {analysis && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-medium">
              {analysis.language_detected}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runAnalysis}
          disabled={loading || !code.trim()}
          className="flex items-center gap-2 px-3 h-9 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-sm font-medium hover:bg-[#22c55e]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {loading ? "Analyzing…" : "Re-analyze"}
        </motion.button>

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
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {loading && !analysis && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <Loader2 className="w-10 h-10 text-[#22c55e] animate-spin" />
                <p className="text-[#9ca3af]">Analyzing your code…</p>
              </motion.div>
            )}

            {/* Error state */}
            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <AlertTriangle className="w-10 h-10 text-[#f59e0b]" />
                <p className="text-[#e5e7eb] font-medium">{error}</p>
                <button
                  onClick={() => navigate("/ide")}
                  className="px-4 py-2 rounded-lg bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors"
                >
                  Go to IDE
                </button>
              </motion.div>
            )}

            {/* Results */}
            {analysis && !loading && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <MetricCard
                    icon={<Code2 className="w-5 h-5" />}
                    title="Total Lines"
                    value={String(analysis.total_lines)}
                    change="lines of code"
                    positive
                  />
                  <MetricCard
                    icon={<Cpu className="w-5 h-5" />}
                    title="Functions"
                    value={String(analysis.functions)}
                    change={`${analysis.loops} loops`}
                    positive
                  />
                  <MetricCard
                    icon={<Zap className="w-5 h-5" />}
                    title="Complexity"
                    value={`${Math.round(analysis.complexity_score)}%`}
                    change={analysis.complexity_score < 40 ? "Low" : analysis.complexity_score < 70 ? "Medium" : "High"}
                    positive={analysis.complexity_score < 70}
                  />
                  <MetricCard
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    title="Code Quality"
                    value={`${Math.round(analysis.quality_score)}%`}
                    change={analysis.quality_score >= 80 ? "Excellent" : analysis.quality_score >= 60 ? "Good" : "Needs Work"}
                    positive={analysis.quality_score >= 60}
                  />
                </div>

                {/* Main Analysis Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Code Summary */}
                  <AnalysisCard title="Code Summary">
                    <div className="space-y-4">
                      <SummaryItem label="Language" value={analysis.language_detected} icon="🔍" />
                      <SummaryItem label="Total Lines" value={`${analysis.total_lines} lines`} icon="📄" />
                      <SummaryItem label="Functions" value={`${analysis.functions} defined`} icon="⚙️" />
                      <SummaryItem label="Conditions" value={`${analysis.conditions} branches`} icon="🌿" />
                      <SummaryItem
                        label="Documentation"
                        value={analysis.quality_score >= 70 ? "Adequate" : "Needs Improvement"}
                        icon="📝"
                        warning={analysis.quality_score < 70}
                      />
                    </div>
                  </AnalysisCard>

                  {/* Complexity Analysis */}
                  <AnalysisCard title="Complexity Breakdown">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#9ca3af]">Cyclomatic Complexity</span>
                          <span className={`text-sm font-semibold ${analysis.complexity_score < 40 ? "text-[#22c55e]" : analysis.complexity_score < 70 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                            {Math.round(analysis.complexity_score)}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.complexity_score}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full ${analysis.complexity_score < 40 ? "bg-[#22c55e]" : analysis.complexity_score < 70 ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#9ca3af]">Quality Score</span>
                          <span className="text-sm font-semibold text-[#3b82f6]">{Math.round(analysis.quality_score)}%</span>
                        </div>
                        <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysis.quality_score}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="h-full bg-[#3b82f6]"
                          />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[#1f2937]">
                        <ResponsiveContainer width="100%" height={150}>
                          <BarChart data={complexityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
                            <YAxis stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#e5e7eb" }}
                              cursor={false}
                            />
                            <Bar dataKey="complexity" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                              {complexityData.map((entry, index) => (
                                <Cell key={`bar-cell-${entry.name}-${index}`} fill={index % 2 === 0 ? "#22c55e" : "#3b82f6"} />
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
                          <RadialBar background dataKey="value" cornerRadius={10} isAnimationActive={false} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-4xl font-bold text-[#22c55e]">{Math.round(analysis.quality_score)}%</div>
                        <div className="text-sm text-[#9ca3af]">
                          {analysis.quality_score >= 80 ? "Excellent" : analysis.quality_score >= 60 ? "Good" : "Needs Work"}
                        </div>
                      </div>
                    </div>
                  </AnalysisCard>

                  {/* Tips */}
                  <AnalysisCard title="Improvement Tips">
                    <div className="space-y-3">
                      {analysis.complexity_score > 50 && (
                        <OptimizationItem type="performance" title="High cyclomatic complexity detected"
                          description="Consider breaking large functions into smaller, focused ones." priority="high" />
                      )}
                      {analysis.functions === 0 && (
                        <OptimizationItem type="readability" title="No functions detected"
                          description="Encapsulate logic in functions for better reusability and readability." priority="medium" />
                      )}
                      {analysis.quality_score < 70 && (
                        <OptimizationItem type="readability" title="Add docstrings / comments"
                          description="Documentation improves maintainability and code quality score." priority="low" />
                      )}
                      {analysis.loops > 5 && (
                        <OptimizationItem type="performance" title="Many loop structures"
                          description="Consider vectorized operations or built-in functions where applicable." priority="medium" />
                      )}
                      {analysis.quality_score >= 80 && analysis.complexity_score < 50 && (
                        <div className="p-3 rounded-lg bg-[#14532d]/20 border border-[#22c55e]/30 text-[#4ade80] text-sm">
                          ✅ Your code looks clean and well-structured! Keep it up.
                        </div>
                      )}
                    </div>
                  </AnalysisCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, change, positive }: {
  icon: React.ReactNode; title: string; value: string; change: string; positive: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-[#1f2937] rounded-lg p-4 hover:border-[#22c55e] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">{icon}</div>
        <span className="text-sm text-[#9ca3af]">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-[#e5e7eb]">{value}</span>
        <span className={`text-xs ${positive ? "text-[#22c55e]" : "text-[#f59e0b]"}`}>{change}</span>
      </div>
    </motion.div>
  );
}

function AnalysisCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-[#1f2937] rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

function SummaryItem({ label, value, icon, warning }: { label: string; value: string; icon: string; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#1f2937] rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-[#9ca3af]">{label}</span>
      </div>
      <span className={`text-sm font-medium ${warning ? "text-[#f59e0b]" : "text-[#e5e7eb]"}`}>{value}</span>
    </div>
  );
}

function OptimizationItem({ type, title, description, priority }: {
  type: string; title: string; description: string; priority: "high" | "medium" | "low";
}) {
  const priorityColors = { high: "text-[#ef4444]", medium: "text-[#f59e0b]", low: "text-[#3b82f6]" };
  const typeIcons: Record<string, string> = { performance: "⚡", readability: "📖", "best-practice": "✨", security: "🔒" };
  return (
    <div className="flex gap-4 p-4 bg-[#1f2937] rounded-lg hover:bg-[#374151] transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-xl">
        {typeIcons[type] ?? "💡"}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-[#e5e7eb]">{title}</span>
          <span className={`text-xs uppercase font-semibold ${priorityColors[priority]}`}>{priority}</span>
        </div>
        <p className="text-xs text-[#9ca3af]">{description}</p>
      </div>
      <AlertTriangle className={`w-4 h-4 ${priorityColors[priority]}`} />
    </div>
  );
}