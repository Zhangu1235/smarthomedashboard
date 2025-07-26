import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  preview_url: string;
  image?: string;
}

// Using Internet Archive's collection of free music
const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Chill Ambient",
    artist: "Free Music Archive",
    duration: 180,
    preview_url: "https://archive.org/download/jamendo-014717/01.mp3",
    image: "https://via.placeholder.com/300x300/667eea/ffffff?text=🎵"
  },
  {
    id: "2", 
    title: "Lo-Fi Study",
    artist: "Creative Commons",
    duration: 210,
    preview_url: "https://archive.org/download/jamendo-014717/02.mp3",
    image: "https://via.placeholder.com/300x300/764ba2/ffffff?text=🎧"
  },
  {
    id: "3",
    title: "Upbeat Energy",
    artist: "Public Domain",
    duration: 195,
    preview_url: "https://archive.org/download/jamendo-014717/03.mp3", 
    image: "https://via.placeholder.com/300x300/f093fb/ffffff?text=⚡"
  }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(sampleTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [playlist] = useState<Track[]>(sampleTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleNext = () => {
    let nextIndex;
    if (isShuffleOn) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setCurrentTime(0);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setCurrentTime(0);
    
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * currentTrack.duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / currentTrack.duration) * 100 || 0;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-lg text-white">
      <audio ref={audioRef} src={currentTrack.preview_url} preload="metadata" />
      
      {/* Current Track Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <Volume2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{currentTrack.title}</h4>
          <p className="text-white/70 text-xs truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleSeek}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/70 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShuffle}
            className={`text-white hover:bg-white/10 ${isShuffleOn ? 'bg-white/20' : ''}`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRepeat}
            className={`text-white hover:bg-white/10 ${repeatMode !== 'off' ? 'bg-white/20' : ''}`}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="text-white hover:bg-white/10"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="text-white hover:bg-white/10 bg-white/20"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="text-white hover:bg-white/10"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-white hover:bg-white/10"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <VolumeX className="w-4 h-4 text-white/70" />
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1"
        />
        <Volume2 className="w-4 h-4 text-white/70" />
      </div>
    </div>
  );
}