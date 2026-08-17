import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { E as isRedirect, g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-cBacO3Md2.mjs";
import { n as objectType, r as stringType, t as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C7ica1yy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var saveScoreInput = objectType({
	playerName: stringType().min(1).max(20),
	score: numberType().int().min(0)
});
var saveScore = createServerFn({ method: "POST" }).validator((data) => saveScoreInput.parse(data)).handler(createSsrRpc("e91345551373fb92ff854dabc575923814711a7efefb94cbbcaf691774827b57"));
var getTopScores = createServerFn({ method: "GET" }).handler(createSsrRpc("5d381809dd0bbf8ad37ccfeec641d4c1e0107faf22be59ef252eecd85bb1d194"));
var GAME_DURATION = 30;
var SPAWN_INTERVAL = 1e3;
var TARGET_LIFETIME = 800;
function Index() {
	const queryClient = useQueryClient();
	const [score, setScore] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(GAME_DURATION);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [gameOver, setGameOver] = (0, import_react.useState)(false);
	const [targets, setTargets] = (0, import_react.useState)([]);
	const [playerName, setPlayerName] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const nextIdRef = (0, import_react.useRef)(1);
	const fetchTopScores = useServerFn(getTopScores);
	const submitScore = useServerFn(saveScore);
	const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
		queryKey: ["scores"],
		queryFn: () => fetchTopScores()
	});
	const startGame = (0, import_react.useCallback)(() => {
		setScore(0);
		setTimeLeft(GAME_DURATION);
		setIsPlaying(true);
		setGameOver(false);
		setTargets([]);
		setSubmitted(false);
		setPlayerName("");
		nextIdRef.current = 1;
	}, []);
	const endGame = (0, import_react.useCallback)(() => {
		setIsPlaying(false);
		setGameOver(true);
		setTargets([]);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isPlaying) return;
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					endGame();
					return 0;
				}
				return prev - 1;
			});
		}, 1e3);
		return () => clearInterval(timer);
	}, [isPlaying, endGame]);
	(0, import_react.useEffect)(() => {
		if (!isPlaying) return;
		const spawner = setInterval(() => {
			const id = nextIdRef.current++;
			const top = Math.random() * 80;
			const left = Math.random() * 80;
			setTargets((prev) => [...prev, {
				id,
				top,
				left
			}]);
			setTimeout(() => {
				setTargets((prev) => prev.filter((t) => t.id !== id));
			}, TARGET_LIFETIME);
		}, SPAWN_INTERVAL);
		return () => clearInterval(spawner);
	}, [isPlaying]);
	const handleTargetClick = (0, import_react.useCallback)((id) => {
		setScore((prev) => prev + 1);
		setTargets((prev) => prev.filter((t) => t.id !== id));
	}, []);
	const handleSubmitScore = (0, import_react.useCallback)(async () => {
		if (!playerName.trim() || score === 0) return;
		try {
			await submitScore({ data: {
				playerName: playerName.trim(),
				score
			} });
			setSubmitted(true);
			await queryClient.invalidateQueries({ queryKey: ["scores"] });
		} catch (error) {
			console.error("Failed to submit score:", error);
		}
	}, [
		playerName,
		score,
		submitScore,
		queryClient
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-game-bg px-4 py-8 font-game text-game-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-6 text-center text-xl font-normal tracking-tight text-game-fg",
					children: "REFLEX GAME"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full border-2 border-game-border bg-game-bg p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["TIME LEFT: ", timeLeft] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SCORE: ", score] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/5] w-full overflow-hidden bg-game-bg",
							children: [
								!isPlaying && !gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "absolute inset-0 flex items-center justify-center text-center text-xs leading-relaxed",
									children: "CLICK FAST!"
								}),
								gameOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 flex flex-col items-center justify-center gap-4 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs leading-relaxed",
										children: [
											"GAME OVER!",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"SCORE: ",
											score
										]
									}), !submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex w-3/4 flex-col gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: playerName,
											onChange: (e) => setPlayerName(e.target.value),
											placeholder: "YOUR NAME",
											maxLength: 20,
											className: "border-2 border-game-border bg-game-bg p-2 text-center text-xs placeholder:text-game-fg/50 focus:outline-none"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleSubmitScore,
											disabled: !playerName.trim(),
											className: "border-2 border-game-border bg-game-bg p-2 text-xs uppercase transition-colors hover:bg-game-fg hover:text-game-bg disabled:opacity-50",
											children: "SUBMIT SCORE"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-game-primary",
										children: "SCORE SAVED!"
									})]
								}),
								targets.map((target) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleTargetClick(target.id),
									className: "absolute h-10 w-10 rounded-full bg-game-primary shadow-[0_0_6px_var(--color-game-primary)]",
									style: {
										top: `${target.top}%`,
										left: `${target.left}%`
									},
									"aria-label": "Target"
								}, target.id))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: startGame,
							className: "mt-4 w-full border-2 border-game-border bg-game-bg p-3 text-xs uppercase transition-colors hover:bg-game-fg hover:text-game-bg",
							children: isPlaying ? "PLAYING..." : "START"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 w-full border-2 border-game-border bg-game-bg p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-center text-xs uppercase",
						children: "Leaderboard"
					}), leaderboardLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs",
						children: "Loading..."
					}) : leaderboard.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs",
						children: "No scores yet. Be the first!"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-2",
						children: leaderboard.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								index + 1,
								". ",
								entry.player_name
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.score })]
						}, `${entry.player_name}-${entry.score}-${index}`))
					})]
				})
			]
		})
	});
}
//#endregion
export { Index as component };
