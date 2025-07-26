import { useState, useEffect } from "react";
import { Bluetooth, BluetoothConnected, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Extend Navigator interface for Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
      getAvailability(): Promise<boolean>;
    };
  }
  
  interface RequestDeviceOptions {
    acceptAllDevices?: boolean;
    filters?: BluetoothLEScanFilter[];
    optionalServices?: BluetoothServiceUUID[];
  }
  
  interface BluetoothLEScanFilter {
    name?: string;
    namePrefix?: string;
    services?: BluetoothServiceUUID[];
  }
  
  type BluetoothServiceUUID = string | number;
}

interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  paired: boolean;
  deviceClass?: string;
  rssi?: number;
}

export default function BluetoothControl() {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [bluetoothSupported, setBluetoothSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Web Bluetooth API is supported
    setBluetoothSupported('bluetooth' in navigator);
    
    // Initialize with mock devices for demo
    setDevices([
      {
        id: "1",
        name: "AirPods Pro",
        connected: true,
        paired: true,
        deviceClass: "audio",
        rssi: -45
      },
      {
        id: "2", 
        name: "Wireless Mouse",
        connected: false,
        paired: true,
        deviceClass: "input",
        rssi: -65
      },
      {
        id: "3",
        name: "Smart Speaker",
        connected: false,
        paired: false,
        deviceClass: "audio",
        rssi: -72
      }
    ]);
  }, []);

  const toggleBluetooth = async () => {
    try {
      setError(null);
      
      if (!bluetoothSupported) {
        setError("Bluetooth not supported in this browser");
        return;
      }

      if (isBluetoothEnabled) {
        // Disable Bluetooth
        setIsBluetoothEnabled(false);
        setDevices(prev => prev.map(device => ({ ...device, connected: false })));
      } else {
        // Enable Bluetooth
        setIsBluetoothEnabled(true);
        // Request Bluetooth access if available
        try {
          if (navigator.bluetooth) {
            await navigator.bluetooth.requestDevice({
              acceptAllDevices: true,
              optionalServices: ['battery_service', 'device_information']
            });
          }
        } catch (bluetoothError) {
          console.log("Bluetooth access not granted, using mock mode");
        }
      }
    } catch (error) {
      console.error('Bluetooth error:', error);
      setError(error instanceof Error ? error.message : 'Bluetooth operation failed');
    }
  };

  const scanForDevices = async () => {
    if (!isBluetoothEnabled) return;

    setIsScanning(true);
    setError(null);

    try {
      // In a real implementation, this would scan for actual devices
      // For demo purposes, we'll simulate finding new devices
      setTimeout(() => {
        const newDevice: BluetoothDevice = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Device ${devices.length + 1}`,
          connected: false,
          paired: false,
          deviceClass: "unknown",
          rssi: Math.floor(Math.random() * 40) - 80
        };
        
        setDevices(prev => [...prev, newDevice]);
        setIsScanning(false);
      }, 2000);
    } catch (error) {
      console.error('Scan error:', error);
      setError(error instanceof Error ? error.message : 'Scan failed');
      setIsScanning(false);
    }
  };

  const connectDevice = async (deviceId: string) => {
    try {
      setError(null);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: !device.connected, paired: true }
          : device
      ));
    } catch (error) {
      console.error('Connection error:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const getDeviceIcon = (deviceClass?: string) => {
    switch (deviceClass) {
      case 'audio':
        return '🎧';
      case 'input':
        return '🖱️';
      case 'phone':
        return '📱';
      default:
        return '📟';
    }
  };

  const getSignalStrength = (rssi?: number) => {
    if (!rssi) return 0;
    if (rssi > -50) return 3;
    if (rssi > -60) return 2;
    if (rssi > -70) return 1;
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* Bluetooth Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${isBluetoothEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            {isBluetoothEnabled ? <BluetoothConnected className="w-5 h-5" /> : <Bluetooth className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-sm">Bluetooth</h4>
            <p className="text-xs text-slate-500">
              {isBluetoothEnabled ? 'On' : 'Off'}
            </p>
          </div>
        </div>
        <Switch
          checked={isBluetoothEnabled}
          onCheckedChange={toggleBluetooth}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isBluetoothEnabled && (
        <>
          {/* Scan Button */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scanForDevices}
              disabled={isScanning}
              className="flex-1"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Scan for Devices
                </>
              )}
            </Button>
          </div>

          {/* Device List */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-slate-700">Available Devices</h5>
            {devices.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No devices found</p>
            ) : (
              devices.map((device) => (
                <Card key={device.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getDeviceIcon(device.deviceClass)}</span>
                      <div>
                        <h6 className="font-medium text-sm">{device.name}</h6>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <span>{device.connected ? 'Connected' : device.paired ? 'Paired' : 'Available'}</span>
                          {device.rssi && (
                            <div className="flex space-x-0.5">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-2 rounded-sm ${
                                    i < getSignalStrength(device.rssi) 
                                      ? 'bg-green-500' 
                                      : 'bg-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={device.connected ? "default" : "outline"}
                      size="sm"
                      onClick={() => connectDevice(device.id)}
                    >
                      {device.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {!bluetoothSupported && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-600 text-sm">
            Web Bluetooth API not supported in this browser. Some features may be limited.
          </p>
        </div>
      )}
    </div>
  );
}