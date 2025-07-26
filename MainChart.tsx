import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-in slide-in-from-bottom-4 duration-600">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Data Trends Analysis</h3>
          <p className="text-sm text-slate-600">Last 30 days performance metrics</p>
        </div>
        <div className="flex space-x-2 mt-3 sm:mt-0">
          <Button variant="secondary" size="sm" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            7D
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600">
            30D
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600">
            90D
          </Button>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="h-64 rounded-lg border-2 border-dashed border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Interactive Chart Component</p>
          <p className="text-sm text-slate-400">Real-time analytics visualization</p>
        </div>
      </div>
    </div>
  );
}
