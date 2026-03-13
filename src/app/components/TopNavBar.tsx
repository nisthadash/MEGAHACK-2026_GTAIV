import { Play, Sparkles, Cpu, Settings, BarChart3, Eye, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

interface TopNavBarProps {
  onRunCode: () => void;
  onExplainCode: () => void;
  onAIAnalyze: () => void;
}

export function TopNavBar({ onRunCode, onExplainCode, onAIAnalyze }: TopNavBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to login
    navigate("/login");
  };

  return (
    <div className="h-14 bg-[#111827] border-b border-[#1f2937] flex items-center px-4 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/ide")}>
        <div className="w-8 h-8 bg-gradient-to-br from-[#22c55e] to-[#3b82f6] rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg">ExplainMyCode</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-1">
        <ActionButton
          icon={<Play className="w-4 h-4" />}
          label="Run Code"
          onClick={onRunCode}
          variant="success"
        />
        <ActionButton
          icon={<Sparkles className="w-4 h-4" />}
          label="Explain Code"
          onClick={onExplainCode}
          variant="primary"
        />
        <ActionButton
          icon={<Cpu className="w-4 h-4" />}
          label="AI Analyze"
          onClick={onAIAnalyze}
          variant="secondary"
        />
        <ActionButton
          icon={<Eye className="w-4 h-4" />}
          label="Visualize"
          onClick={() => navigate("/visualize")}
          variant="accent"
        />
        <ActionButton
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analysis"
          onClick={() => navigate("/analysis")}
          variant="accent"
        />
      </div>

      {/* Settings & Logout */}
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-all flex items-center justify-center hover:shadow-lg hover:shadow-[#3b82f6]/20">
          <Settings className="w-4 h-4 text-[#9ca3af]" />
        </button>
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#ef4444]/20 transition-all flex items-center justify-center group"
        >
          <LogOut className="w-4 h-4 text-[#9ca3af] group-hover:text-[#ef4444]" />
        </button>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: "success" | "primary" | "secondary" | "accent";
}

function ActionButton({ icon, label, onClick, variant }: ActionButtonProps) {
  const variantStyles = {
    success: "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 hover:shadow-[#22c55e]/30",
    primary: "bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20 hover:shadow-[#3b82f6]/30",
    secondary: "bg-[#8b5cf6]/10 text-[#8b5cf6] hover:bg-[#8b5cf6]/20 hover:shadow-[#8b5cf6]/30",
    accent: "bg-[#1f2937] text-[#9ca3af] hover:bg-[#374151] hover:text-[#e5e7eb] hover:shadow-[#3b82f6]/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 h-9 rounded-lg font-medium text-sm flex items-center gap-2 transition-all hover:shadow-lg ${variantStyles[variant]}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}