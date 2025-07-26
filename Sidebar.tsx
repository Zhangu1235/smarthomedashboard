import { cn } from "@/lib/utils";
import { Home, BarChart3, Database, Brain, CheckSquare, Smile, Gamepad2, Camera } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: Database, label: "Data Sources" },
    { icon: Brain, label: "ML Models" },
    { icon: CheckSquare, label: "Task Manager" },
    { icon: Smile, label: "Mood Tracker" },
    { icon: Gamepad2, label: "Tic-Tac-Toe" },
    { icon: Camera, label: "Security Cameras" },
  ];

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:shadow-none border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">DataInsight Pro</h2>
            <p className="text-sm text-slate-500">Analytics Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
              item.active
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-slate-600 hover:bg-slate-100"
            )}
            onClick={onClose}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Analyst User</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
