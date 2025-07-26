import { Database, Brain, Target, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricsData {
  energyUsage: number;
  temperature: number;
  humidity: number;
  securityStatus: string;
  devicesOnline: number;
  costToday: number;
  solarGeneration: number;
  waterUsage: number;
  airQuality: number;
  internetSpeed: number;
}

interface MetricsGridProps {
  data: MetricsData;
}

export default function MetricsGrid({ data }: MetricsGridProps) {
  const metrics = [
    {
      title: "Total Records",
      value: "1.2M",
      change: "+12.5%",
      changeType: "positive",
      icon: Database,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Models",
      value: "8",
      change: "2 new",
      changeType: "positive",
      icon: Brain,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Accuracy",
      value: "94.2%",
      change: "-0.3%",
      changeType: "negative",
      icon: Target,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Processing",
      value: "15min",
      change: "-5min",
      changeType: "positive",
      icon: Clock,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const getChangeIcon = (type: string) => {
    if (type === "positive") return <TrendingUp className="w-3 h-3" />;
    if (type === "negative") return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getChangeColor = (type: string) => {
    if (type === "positive") return "text-green-600";
    if (type === "negative") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="bg-white p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{metric.title}</p>
              <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
              <p className={`text-xs flex items-center mt-1 ${getChangeColor(metric.changeType)}`}>
                {getChangeIcon(metric.changeType)}
                <span className="ml-1">{metric.change}</span>
              </p>
            </div>
            <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
              <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
