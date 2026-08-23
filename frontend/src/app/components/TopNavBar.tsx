import { Play, Sparkles, Settings, BarChart3, Eye, LogOut, User, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { getUser, clearAuth } from "../auth";

interface TopNavBarProps {
  onRunCode: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { value: "python", label: "Python", icon: "🐍" },
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "c", label: "C", icon: "🔧" },
  { value: "java", label: "Java", icon: "☕" },
];

export function TopNavBar({ onRunCode, language, onLanguageChange }: TopNavBarProps) {
  const navigate = useNavigate();
  const user = getUser();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const currentLang = LANGUAGES.find((l) => l.value === language) ?? LANGUAGES[0];

  return (
    <div className="h-14 bg-[#111827] border-b border-[#1f2937] flex items-center px-4 gap-4 relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/ide")}>
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

        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 h-9 rounded-lg bg-[#1f2937] border border-[#374151] hover:border-[#3b82f6]/50 text-sm text-[#e5e7eb] flex items-center gap-2 transition-all"
          >
            <span>{currentLang.icon}</span>
            <span className="font-medium">{currentLang.label}</span>
            <ChevronRight className={`w-3.5 h-3.5 text-[#9ca3af] transition-transform ${showLangMenu ? "rotate-90" : ""}`} />
          </motion.button>

          {showLangMenu && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-11 left-0 bg-[#1f2937] border border-[#374151] rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    onLanguageChange(lang.value);
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-[#374151] ${
                    lang.value === language ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#e5e7eb]"
                  }`}
                >
                  <span>{lang.icon}</span>
                  {lang.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* User Bar & Settings */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* User Profile Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-3 h-9 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-all border border-[#374151] hover:border-[#3b82f6]/30"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm text-[#e5e7eb] max-w-[100px] truncate">
            {user?.username ?? "User"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
        </motion.button>

        <button className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-all flex items-center justify-center hover:shadow-lg hover:shadow-[#3b82f6]/20">
          <Settings className="w-4 h-4 text-[#9ca3af]" />
        </button>
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-lg bg-[#1f2937] hover:bg-[#ef4444]/20 transition-all flex items-center justify-center group"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-[#9ca3af] group-hover:text-[#ef4444]" />
        </button>
      </div>

      {/* Close lang menu on outside click */}
      {showLangMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
      )}
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