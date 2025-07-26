import { X, Brain, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export default function NotificationPanel({ isOpen, onClose, notifications }: NotificationPanelProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Brain className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-l-4 border-green-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500";
      case "error":
        return "bg-red-50 border-l-4 border-red-500";
      default:
        return "bg-blue-50 border-l-4 border-blue-500";
    }
  };

  const getNotificationTextColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "warning":
        return "text-yellow-800";
      case "error":
        return "text-red-800";
      default:
        return "text-blue-800";
    }
  };

  const getNotificationSubTextColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const defaultNotifications: Notification[] = [
    {
      id: "1",
      title: "Model Training Complete",
      message: "Customer segmentation model achieved 94.2% accuracy",
      type: "success",
      timestamp: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    },
    {
      id: "2",
      title: "Data Sync Complete",
      message: "Latest customer data imported successfully",
      type: "info",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    },
    {
      id: "3",
      title: "Low Data Quality Alert",
      message: "Recent data batch has missing values in 12% of records",
      type: "warning",
      timestamp: new Date(Date.now() - 60 * 60000), // 1 hour ago
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto h-full pb-20">
        {displayNotifications.map((notification, index) => (
          <div
            key={`${notification.id}-${index}`}
            className={`p-4 rounded ${getNotificationBg(notification.type)} animate-in slide-in-from-right-4 duration-300`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`font-medium ${getNotificationTextColor(notification.type)}`}>
                  {notification.title}
                </p>
                <p className={`text-sm mt-1 ${getNotificationSubTextColor(notification.type)}`}>
                  {notification.message}
                </p>
                <p className={`text-xs mt-2 ${getNotificationSubTextColor(notification.type)}`}>
                  {formatTime(notification.timestamp)}
                </p>
              </div>
              {getNotificationIcon(notification.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
