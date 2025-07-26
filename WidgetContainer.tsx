import { useState } from "react";
import { Maximize2, Minimize2, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WidgetContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  allowResize?: boolean;
  allowMinimize?: boolean;
  allowClose?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  onSizeChange?: (size: "sm" | "md" | "lg" | "xl") => void;
  onMinimize?: () => void;
  onClose?: () => void;
}

export default function WidgetContainer({
  title,
  children,
  className,
  allowResize = true,
  allowMinimize = false,
  allowClose = false,
  size = "md",
  onSizeChange,
  onMinimize,
  onClose,
}: WidgetContainerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSize, setCurrentSize] = useState(size);

  const handleResize = () => {
    if (!allowResize || !onSizeChange) return;
    
    const sizes = ["sm", "md", "lg", "xl"] as const;
    const currentIndex = sizes.indexOf(currentSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    
    setCurrentSize(nextSize);
    onSizeChange(nextSize);
  };

  const handleMinimize = () => {
    if (!allowMinimize) return;
    
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  const handleClose = () => {
    if (!allowClose) return;
    onClose?.();
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "col-span-1 row-span-1";
      case "md":  
        return "col-span-1 md:col-span-1 lg:col-span-1";
      case "lg":
        return "col-span-1 md:col-span-2 lg:col-span-2";
      case "xl":
        return "col-span-1 md:col-span-2 lg:col-span-3";
      default:
        return "col-span-1";
    }
  };

  if (isMinimized) {
    return (
      <div className={cn(
        "bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700",
        "col-span-1 row-span-1 min-h-[60px]",
        className
      )}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
            {title}
          </h3>
          <div className="flex items-center space-x-1">
            {allowMinimize && (
              <Button variant="ghost" size="sm" onClick={handleMinimize} className="h-6 w-6 p-0">
                <Maximize2 className="h-3 w-3" />
              </Button>
            )}
            {allowClose && (
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700",
      "transition-all duration-300 hover:shadow-md hover:-translate-y-1",
      "flex flex-col overflow-hidden",
      getSizeClasses(currentSize),
      className
    )}>
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 pb-2 border-b border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate">
          {title}
        </h3>
        <div className="flex items-center space-x-1">
          {allowResize && (
            <Button variant="ghost" size="sm" onClick={handleResize} className="h-8 w-8 p-0">
              <Settings className="h-4 w-4 text-slate-500" />
            </Button>
          )}
          {allowMinimize && (
            <Button variant="ghost" size="sm" onClick={handleMinimize} className="h-8 w-8 p-0">
              <Minimize2 className="h-4 w-4 text-slate-500" />
            </Button>
          )}
          {allowClose && (
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 p-4 pt-2 overflow-auto">
        {children}
      </div>
    </div>
  );
}