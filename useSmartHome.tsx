import { useState, useEffect, useCallback } from "react";

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

interface RealTimeData {
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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
}

export function useSmartHome() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    energyUsage: 1.4,
    temperature: 22,
    humidity: 65,
    securityStatus: "Armed",
    devicesOnline: 12,
    costToday: 45.6,
    solarGeneration: 1.8,
    waterUsage: 150,
    airQuality: 85,
    internetSpeed: 75,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const addNotification = useCallback((title: string, message: string, type: Notification["type"] = "info") => {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep only last 10
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      addNotification("Location Error", "Geolocation is not supported by this browser", "error");
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      setLocationPermission("granted");
      await fetchWeather(position.coords.latitude, position.coords.longitude);
      addNotification("Location Access", "Location permission granted successfully", "success");
      return true;
    } catch (error: any) {
      setLocationPermission("denied");
      let errorMessage = "Unable to get location";
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = "Location access denied by user";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "Location information unavailable";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "Location request timed out";
      }

      addNotification("Location Error", errorMessage, "error");
      
      // Fallback to default location (London)
      await fetchWeather(51.5074, -0.1278);
      return false;
    }
  }, [addNotification]);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      // Try to use environment variables for API key
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY || process.env.WEATHER_API_KEY || "demo_key";
      
      if (apiKey === "demo_key") {
        // Use mock data when no API key is available
        const mockData: WeatherData = {
          name: lat > 50 ? "Northern City" : lat > 40 ? "Temperate City" : "Southern City",
          main: {
            temp: Math.round(Math.random() * 15 + (lat > 50 ? 5 : lat > 40 ? 15 : 25)),
            feels_like: Math.round(Math.random() * 15 + (lat > 50 ? 3 : lat > 40 ? 13 : 23)),
            humidity: Math.round(Math.random() * 40 + 40),
            pressure: Math.round(Math.random() * 50 + 1000),
          },
          weather: [
            {
              main: ["Clear", "Clouds", "Rain", "Snow"][Math.floor(Math.random() * 4)],
              description: "based on your location",
            },
          ],
          wind: {
            speed: Math.round(Math.random() * 10 + 2),
          },
        };
        setWeatherData(mockData);
        addNotification("Weather Updated", `Weather data loaded for ${mockData.name}`, "info");
        return;
      }

      // Use real API when key is available
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        addNotification("Weather Updated", `Weather data loaded for ${data.name}`, "success");
      } else {
        throw new Error("Weather API failed");
      }
    } catch (error) {
      // Fallback to mock data on error
      const mockData: WeatherData = {
        name: "Your Location",
        main: {
          temp: 22,
          feels_like: 24,
          humidity: 60,
          pressure: 1013,
        },
        weather: [
          {
            main: "Clear",
            description: "clear sky",
          },
        ],
        wind: {
          speed: 5,
        },
      };
      setWeatherData(mockData);
      addNotification("Weather Error", "Using fallback weather data", "warning");
    }
  }, [addNotification]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        energyUsage: Math.max(0.5, prev.energyUsage + (Math.random() - 0.5) * 0.2),
        temperature: Math.max(15, Math.min(30, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        devicesOnline: Math.max(8, Math.min(15, prev.devicesOnline + Math.floor((Math.random() - 0.5) * 2))),
        airQuality: Math.max(20, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 10)),
        internetSpeed: Math.max(10, Math.min(100, prev.internetSpeed + (Math.random() - 0.5) * 10)),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize location and weather on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    weatherData,
    realTimeData,
    notifications,
    locationPermission,
    requestLocation,
    addNotification,
  };
}
