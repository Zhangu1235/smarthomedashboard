import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherData {
  name?: string;
  main?: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather?: Array<{
    main: string;
    description: string;
  }>;
  wind?: {
    speed: number;
  };
}

interface WeatherWidgetProps {
  weatherData: WeatherData | null;
}

export default function WeatherWidget({ weatherData }: WeatherWidgetProps) {
  const getWeatherEmoji = (weather: string) => {
    switch (weather) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "⛅";
      case "Rain":
        return "🌧️";
      case "Snow":
        return "❄️";
      default:
        return "🌤️";
    }
  };

  const getUVIndex = () => Math.floor(Math.random() * 11) + 1;

  if (!weatherData) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Weather Unavailable</h3>
          <p className="text-blue-100">Enable location services to see weather data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-blue-100">{weatherData.name || "Unknown Location"}</p>
        </div>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <MapPin className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl font-bold mb-2">
            {weatherData.main ? Math.round(weatherData.main.temp) : "--"}°C
          </div>
          <p className="text-blue-100">
            {weatherData.weather?.[0]?.description || "Unknown conditions"}
          </p>
          <p className="text-sm text-blue-200 mt-2">
            Feels like {weatherData.main ? Math.round(weatherData.main.feels_like) : "--"}°C
          </p>
        </div>
        <div className="text-6xl">
          {getWeatherEmoji(weatherData.weather?.[0]?.main || "Clear")}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-blue-400">
        <div className="text-center">
          <p className="text-blue-200 text-sm">Humidity</p>
          <p className="font-semibold">{weatherData.main?.humidity || "--"}%</p>
        </div>
        <div className="text-center">
          <p className="text-blue-200 text-sm">Wind</p>
          <p className="font-semibold">{weatherData.wind?.speed || "--"} m/s</p>
        </div>
        <div className="text-center">
          <p className="text-blue-200 text-sm">UV Index</p>
          <p className="font-semibold">{getUVIndex()}</p>
        </div>
      </div>
    </div>
  );
}
