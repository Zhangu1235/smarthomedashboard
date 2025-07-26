import { useState } from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MoodOption {
  emoji: string;
  label: string;
  value: number;
  color: string;
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(4);
  const [note, setNote] = useState("");

  const moodOptions: MoodOption[] = [
    { emoji: "😢", label: "Terrible", value: 1, color: "text-red-500" },
    { emoji: "😔", label: "Poor", value: 2, color: "text-orange-500" },
    { emoji: "😐", label: "Okay", value: 3, color: "text-yellow-500" },
    { emoji: "😊", label: "Good", value: 4, color: "text-blue-500" },
    { emoji: "😄", label: "Great", value: 5, color: "text-green-500" },
  ];

  const getMoodBorderColor = (value: number) => {
    if (selectedMood === value) {
      const mood = moodOptions.find((m) => m.value === value);
      return mood?.value === 4 ? "border-blue-300 bg-blue-50" : "border-slate-200";
    }
    return "border-slate-200";
  };

  const getMoodHoverColor = (value: number) => {
    const mood = moodOptions.find((m) => m.value === value);
    switch (mood?.value) {
      case 1:
        return "hover:bg-red-50 hover:border-red-300";
      case 2:
        return "hover:bg-orange-50 hover:border-orange-300";
      case 3:
        return "hover:bg-yellow-50 hover:border-yellow-300";
      case 4:
        return "hover:bg-blue-50 hover:border-blue-300";
      case 5:
        return "hover:bg-green-50 hover:border-green-300";
      default:
        return "hover:bg-slate-50";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm">
          <History className="w-4 h-4 text-slate-600" />
        </Button>
      </div>

      <p className="text-sm text-slate-600 mb-4">How are you feeling about your work today?</p>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`aspect-square p-3 border rounded-lg text-center transition-all duration-200 hover:scale-105 ${getMoodBorderColor(
              mood.value
            )} ${getMoodHoverColor(mood.value)}`}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div
              className={`text-xs mt-1 ${
                selectedMood === mood.value && mood.value === 4 ? "text-blue-600 font-medium" : "text-slate-500"
              }`}
            >
              {mood.label}
            </div>
          </button>
        ))}
      </div>

      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note about your day..."
        className="mb-4 resize-none"
        rows={2}
      />

      <div className="flex items-center justify-between text-sm">
        <span className="text-green-600">7-day average: 😊 Good</span>
        <Button variant="link" className="text-blue-600 p-0 h-auto">
          View history
        </Button>
      </div>
    </div>
  );
}
