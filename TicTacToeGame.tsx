import { useTicTacToe } from "@/hooks/useTicTacToe";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TicTacToeGame() {
  const { board, currentPlayer, gameStatus, makeMove, resetGame, playerStats } = useTicTacToe();

  const getGameStatusMessage = () => {
    switch (gameStatus) {
      case "playing":
        return currentPlayer === "X" ? "Your turn!" : "AI's turn...";
      case "won":
        return currentPlayer === "X" ? "You won! 🎉" : "AI wins! 🤖";
      case "draw":
        return "It's a draw! 🤝";
      default:
        return "Let's play!";
    }
  };

  const getGameStatusColor = () => {
    switch (gameStatus) {
      case "won":
        return currentPlayer === "X" ? "text-green-600" : "text-red-600";
      case "draw":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={resetGame}>
          <RotateCcw className="w-4 h-4 text-slate-600" />
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">
            You: <span className="font-semibold text-blue-600">X</span>
          </span>
          <span className="text-slate-600">
            AI: <span className="font-semibold text-red-600">O</span>
          </span>
        </div>
        <p className={`text-sm font-medium ${getGameStatusColor()}`}>{getGameStatusMessage()}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          return (
            <button
              key={index}
              onClick={() => makeMove(row, col)}
              disabled={cell !== "" || gameStatus !== "playing" || currentPlayer !== "X"}
              className="aspect-square bg-slate-50 border-2 border-slate-200 rounded-lg text-2xl font-bold transition-all duration-200 hover:bg-slate-100 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className={cell === "X" ? "text-blue-600" : "text-red-600"}>{cell}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Games won: {playerStats.wins}</span>
        <span>AI wins: {playerStats.aiWins}</span>
      </div>
    </div>
  );
}
