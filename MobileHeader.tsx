import { Menu, Bell } from "lucide-react";

interface MobileHeaderProps {
  onMenuToggle: () => void;
  onNotificationToggle: () => void;
  notificationCount: number;
}

export default function MobileHeader({
  onMenuToggle,
  onNotificationToggle,
  notificationCount,
}: MobileHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-slate-100">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">DataInsight Pro</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onNotificationToggle}
          className="p-2 rounded-lg hover:bg-slate-100 relative"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">A</span>
        </div>
      </div>
    </header>
  );
}
