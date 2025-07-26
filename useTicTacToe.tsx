import { useState, useCallback, useEffect } from "react";

type Player = "X" | "O" | "";
type Board = Player[];
type GameStatus = "playing" | "won" | "draw";

interface PlayerStats {
  wins: number;
  aiWins: number;
  draws: number;
}

export function useTicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    wins: 12,
    aiWins: 8,
    draws: 3,
  });

  const checkWinner = useCallback((board: Board): Player => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return "";
  }, []);

  const checkDraw = useCallback((board: Board): boolean => {
    return board.every((cell) => cell !== "") && !checkWinner(board);
  }, [checkWinner]);

  const getAIMove = useCallback((board: Board): number => {
    // Simple AI strategy: try to win, then block, then take center/corners
    const availableMoves = board.map((cell, index) => cell === "" ? index : -1).filter(index => index !== -1);
    
    // Try to win
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = "O";
      if (checkWinner(testBoard) === "O") {
        return move;
      }
    }

    // Try to block player win
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = "X";
      if (checkWinner(testBoard) === "X") {
        return move;
      }
    }

    // Take center if available
    if (board[4] === "") return 4;

    // Take corners
    const corners = [0, 2, 6, 8].filter(index => board[index] === "");
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, [checkWinner]);

  const makeMove = useCallback((row: number, col: number) => {
    const index = row * 3 + col;
    
    if (board[index] !== "" || gameStatus !== "playing" || currentPlayer !== "X") {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameStatus("won");
      setCurrentPlayer("X");
      setPlayerStats(prev => ({ ...prev, wins: prev.wins + 1 }));
      return;
    }

    if (checkDraw(newBoard)) {
      setGameStatus("draw");
      setPlayerStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setCurrentPlayer("O");
  }, [board, gameStatus, currentPlayer, checkWinner, checkDraw]);

  // AI move effect
  useEffect(() => {
    if (currentPlayer === "O" && gameStatus === "playing") {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = "O";
          setBoard(newBoard);

          const winner = checkWinner(newBoard);
          if (winner) {
            setGameStatus("won");
            setCurrentPlayer("O");
            setPlayerStats(prev => ({ ...prev, aiWins: prev.aiWins + 1 }));
            return;
          }

          if (checkDraw(newBoard)) {
            setGameStatus("draw");
            setPlayerStats(prev => ({ ...prev, draws: prev.draws + 1 }));
            return;
          }

          setCurrentPlayer("X");
        }
      }, 1000); // AI thinks for 1 second

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameStatus, board, getAIMove, checkWinner, checkDraw]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setGameStatus("playing");
  }, []);

  return {
    board,
    currentPlayer,
    gameStatus,
    playerStats,
    makeMove,
    resetGame,
  };
}
