import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Video, VideoOff, Maximize2, Settings, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import WidgetContainer from "@/components/dashboard/WidgetContainer";

interface CameraConfig {
  id: number;
  name: string;
  location: string;
  type: "security" | "indoor" | "outdoor" | "personal";
  facing: "user" | "environment";
}

const cameraConfigs: CameraConfig[] = [
  { id: 1, name: "Front Door", location: "Entrance", type: "security", facing: "environment" },
  { id: 2, name: "Living Room", location: "Main Floor", type: "indoor", facing: "user" },
  { id: 3, name: "Backyard", location: "Garden", type: "outdoor", facing: "environment" },
  { id: 4, name: "Personal Camera", location: "Your Device", type: "personal", facing: "user" },
];

export default function CameraWidget() {
  const [selectedCamera, setSelectedCamera] = useState<number>(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoQuality, setVideoQuality] = useState<"hd" | "sd">("hd");
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentCamera = cameraConfigs.find(cam => cam.id === selectedCamera) || cameraConfigs[0];

  const requestCameraPermission = useCallback(async () => {
    try {
      // Only request personal camera permission, others are simulated
      if (currentCamera.type !== "personal") {
        // Simulate mock security cameras
        setIsStreaming(true);
        return;
      }

      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission("denied");
        throw new Error("Camera API not supported");
      }

      const constraints = {
        video: {
          facingMode: currentCamera.facing === "user" ? "user" : "environment",
          width: videoQuality === "hd" ? { ideal: 1280, min: 640 } : { ideal: 640, min: 320 },
          height: videoQuality === "hd" ? { ideal: 720, min: 480 } : { ideal: 480, min: 240 },
          frameRate: { ideal: 30, max: 60 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraPermission("granted");
      setIsStreaming(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error: any) {
      setCameraPermission("denied");
      setIsStreaming(false);
      console.error("Camera access error:", error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError') {
        console.error("Camera permission denied by user");
      } else if (error.name === 'NotFoundError') {
        console.error("No camera device found");
      } else if (error.name === 'NotReadableError') {
        console.error("Camera is already in use");
      }
    }
  }, [currentCamera.facing, currentCamera.type, videoQuality]);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleStream = async () => {
    if (isStreaming) {
      stopStream();
    } else {
      await requestCameraPermission();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getCameraIcon = (type: string) => {
    switch (type) {
      case "security":
        return "🔒";
      case "outdoor":
        return "🌳";
      case "indoor":
        return "🏠";
      default:
        return "📹";
    }
  };

  const getCameraStatusBg = (type: string) => {
    switch (type) {
      case "security":
        return "bg-red-100 text-red-700";
      case "outdoor":
        return "bg-green-100 text-green-700";
      case "indoor":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-black/80 text-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCameraIcon(currentCamera.type)}</span>
            <div>
              <h2 className="text-lg font-semibold">{currentCamera.name}</h2>
              <p className="text-sm text-gray-300">{currentCamera.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleStream} className="text-white">
              {isStreaming ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white">
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-black">
          {isStreaming && cameraPermission === "granted" ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl mb-2">Camera Feed</p>
              <p className="text-gray-400">
                {cameraPermission === "denied" 
                  ? "Camera access denied. Please enable camera permissions." 
                  : "Click the video button to start streaming"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const getPermissionAlert = () => {
    if (currentCamera.type === "personal" && cameraPermission === "denied") {
      return (
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Camera access denied. Please enable camera permissions in your browser settings to use the personal camera.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (currentCamera.type === "personal" && cameraPermission === "prompt") {
      return (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This camera requires permission to access your device. Click start to allow camera access.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <WidgetContainer 
      title="Security Cameras" 
      allowResize={true}
      className="min-h-[400px]"
    >
      {getPermissionAlert()}

      {/* Camera Selection */}
      <div className="mb-4">
        <Select value={selectedCamera.toString()} onValueChange={(value) => setSelectedCamera(parseInt(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            {cameraConfigs.map((camera) => (
              <SelectItem key={camera.id} value={camera.id.toString()}>
                <div className="flex items-center space-x-2">
                  <span>{getCameraIcon(camera.type)}</span>
                  <span>{camera.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Video Feed */}
      <div className="relative mb-4 bg-slate-100 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {isStreaming && cameraPermission === "granted" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 font-medium">{currentCamera.name}</p>
              <p className="text-sm text-slate-500 mb-3">{currentCamera.location}</p>
              {cameraPermission === "denied" ? (
                <p className="text-xs text-red-600">Camera access denied</p>
              ) : (
                <p className="text-xs text-slate-400">Click start to begin streaming</p>
              )}
            </div>
          </div>
        )}
        
        {/* Camera Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs ${getCameraStatusBg(currentCamera.type)}`}>
          {isStreaming ? "LIVE" : "OFFLINE"}
        </div>

        {/* Stream Controls */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <Button size="sm" onClick={toggleStream} className="bg-black/70 hover:bg-black/80 text-white">
            {isStreaming ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Camera Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-slate-600">Quality: {videoQuality.toUpperCase()}</span>
          <span className="text-slate-600">
            Status: {isStreaming ? (
              <span className="text-green-600 font-medium">Active</span>
            ) : (
              <span className="text-slate-500">Inactive</span>
            )}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600">{Math.floor(Math.random() * 50) + 10} viewers</span>
        </div>
      </div>
    </WidgetContainer>
  );
}