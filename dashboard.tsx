import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSmartHome } from "@/hooks/useSmartHome";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileHeader from "@/components/dashboard/MobileHeader";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import MainChart from "@/components/dashboard/MainChart";
import ChatbotPanel from "@/components/dashboard/ChatbotPanel";
import TodoManager from "@/components/dashboard/TodoManager";
import MoodTracker from "@/components/dashboard/MoodTracker";
import TicTacToeGame from "@/components/dashboard/TicTacToeGame";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import QuoteWidget from "@/components/dashboard/QuoteWidget";
import CameraWidget from "@/components/dashboard/CameraWidget";
import MusicPlayer from "@/components/dashboard/MusicPlayer";
import BluetoothControl from "@/components/dashboard/BluetoothControl";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import WidgetContainer from "@/components/dashboard/WidgetContainer";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { notifications, weatherData, realTimeData } = useSmartHome();

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNotificationToggle = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          onMenuToggle={handleMobileMenuToggle}
          onNotificationToggle={handleNotificationToggle}
          notificationCount={notifications.length}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Desktop Header */}
        {!isMobile && (
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Smart Home Dashboard</h1>
              <p className="text-slate-600">Control your smart home and multimedia devices</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                New Analysis
              </button>
              <button
                className="p-2 rounded-lg hover:bg-slate-100 relative"
                onClick={handleNotificationToggle}
              >
                <i className="fas fa-bell text-slate-600"></i>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
            </div>
          </header>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Professional Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
            {/* Key Metrics - Full Width */}
            <div className="col-span-full">
              <WidgetContainer title="Key Performance Metrics" allowResize={false}>
                <MetricsGrid data={realTimeData} />
              </WidgetContainer>
            </div>

            {/* Main Chart - Large Widget */}
            <div className="col-span-full lg:col-span-2 xl:col-span-3">
              <WidgetContainer title="Data Trends Analysis" allowResize={true} size="xl">
                <MainChart />
              </WidgetContainer>
            </div>

            {/* AI Chatbot */}
            <div className="col-span-full lg:col-span-1 xl:col-span-1">
              <ChatbotPanel />
            </div>

            {/* Secondary Features Grid */}
            <WidgetContainer title="Task Manager" allowResize={true}>
              <TodoManager />
            </WidgetContainer>

            <WidgetContainer title="Daily Check-in" allowResize={true}>
              <MoodTracker />
            </WidgetContainer>

            <WidgetContainer title="Tic-Tac-Toe Game" allowResize={true}>
              <TicTacToeGame />
            </WidgetContainer>

            {/* Weather Widget */}
            <WidgetContainer title="Weather & Location" allowResize={true}>
              <WeatherWidget weatherData={weatherData} />
            </WidgetContainer>

            {/* Quote Widget */}
            <WidgetContainer title="Daily Inspiration" allowResize={true}>
              <QuoteWidget />
            </WidgetContainer>

            {/* Camera Widget */}
            <CameraWidget />

            {/* Music Player Widget */}
            <WidgetContainer title="Music Player" allowResize={true}>
              <MusicPlayer />
            </WidgetContainer>

            {/* Bluetooth Control Widget */}
            <WidgetContainer title="Bluetooth Devices" allowResize={true}>
              <BluetoothControl />
            </WidgetContainer>
          </div>
        </div>
      </main>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}
