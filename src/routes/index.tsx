import { useEffect, useState, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { saveScore, getTopScores } from "@/lib/game.functions";

interface Target {
  id: number;
  top: number;
  left: number;
}

const GAME_DURATION = 30;
const SPAWN_INTERVAL = 1000;
const TARGET_LIFETIME = 800;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reflex Game - Test Your Reaction Speed" },
      {
        name: "description",
        content:
          "A fast-paced clicking game. Click the green targets as fast as you can before time runs out!",
      },
      { property: "og:title", content: "Reflex Game" },
      {
        property: "og:description",
        content: "Click the green targets as fast as you can before time runs out!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nextIdRef = useRef(1);

  const fetchTopScores = useServerFn(getTopScores);
  const submitScore = useServerFn(saveScore);

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ["scores"],
    queryFn: () => fetchTopScores(),
  });

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setGameOver(false);
    setTargets([]);
    setSubmitted(false);
    setPlayerName("");
    nextIdRef.current = 1;
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    setTargets([]);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, endGame]);

  useEffect(() => {
    if (!isPlaying) return;

    const spawner = setInterval(() => {
      const id = nextIdRef.current++;
      const top = Math.random() * 80;
      const left = Math.random() * 80;
      setTargets((prev) => [...prev, { id, top, left }]);

      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== id));
      }, TARGET_LIFETIME);
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawner);
  }, [isPlaying]);

  const handleTargetClick = useCallback((id: number) => {
    setScore((prev) => prev + 1);
    setTargets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmitScore = useCallback(async () => {
    if (!playerName.trim() || score === 0) return;
    try {
      await submitScore({ data: { playerName: playerName.trim(), score } });
      setSubmitted(true);
      await queryClient.invalidateQueries({ queryKey: ["scores"] });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  }, [playerName, score, submitScore, queryClient]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-game-bg px-4 py-8 font-game text-game-fg">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-xl font-normal tracking-tight text-game-fg">
          REFLEX GAME
        </h1>

        <div className="w-full border-2 border-game-border bg-game-bg p-5">
          <div className="mb-4 flex justify-between text-xs">
            <span>TIME LEFT: {timeLeft}</span>
            <span>SCORE: {score}</span>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden bg-game-bg">
            {!isPlaying && !gameOver && (
              <p className="absolute inset-0 flex items-center justify-center text-center text-xs leading-relaxed">
                CLICK FAST!
              </p>
            )}
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-xs leading-relaxed">
                  GAME OVER!
                  <br />
                  SCORE: {score}
                </p>
                {!submitted ? (
                  <div className="flex w-3/4 flex-col gap-2">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="YOUR NAME"
                      maxLength={20}
                      className="border-2 border-game-border bg-game-bg p-2 text-center text-xs placeholder:text-game-fg/50 focus:outline-none"
                    />
                    <button
                      onClick={handleSubmitScore}
                      disabled={!playerName.trim()}
                      className="border-2 border-game-border bg-game-bg p-2 text-xs uppercase transition-colors hover:bg-game-fg hover:text-game-bg disabled:opacity-50"
                    >
                      SUBMIT SCORE
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-game-primary">SCORE SAVED!</p>
                )}
              </div>
            )}
            {targets.map((target) => (
              <button
                key={target.id}
                onClick={() => handleTargetClick(target.id)}
                className="absolute h-10 w-10 rounded-full bg-game-primary shadow-[0_0_6px_var(--color-game-primary)]"
                style={{ top: `${target.top}%`, left: `${target.left}%` }}
                aria-label="Target"
              />
            ))}
          </div>

          <button
            onClick={startGame}
            className="mt-4 w-full border-2 border-game-border bg-game-bg p-3 text-xs uppercase transition-colors hover:bg-game-fg hover:text-game-bg"
          >
            {isPlaying ? "PLAYING..." : "START"}
          </button>
        </div>

        <div className="mt-8 w-full border-2 border-game-border bg-game-bg p-4">
          <h2 className="mb-3 text-center text-xs uppercase">Leaderboard</h2>
          {leaderboardLoading ? (
            <p className="text-center text-xs">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-xs">No scores yet. Be the first!</p>
          ) : (
            <ol className="space-y-2">
              {leaderboard.map((entry, index) => (
                <li
                  key={`${entry.player_name}-${entry.score}-${index}`}
                  className="flex justify-between text-xs"
                >
                  <span>
                    {index + 1}. {entry.player_name}
                  </span>
                  <span>{entry.score}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
