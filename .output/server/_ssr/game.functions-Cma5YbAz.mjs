import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-cBacO3Md2.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as objectType, r as stringType, t as numberType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/game.functions-Cma5YbAz.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function createPublishableClient() {
	const url = processModule.env["SUPABASE_URL"];
	const key = processModule.env["SUPABASE_PUBLISHABLE_KEY"];
	return createClient(url, key, {
		auth: { persistSession: false },
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
			headers.set("apikey", key);
			return fetch(input, {
				...init,
				headers
			});
		} }
	});
}
var saveScoreInput = objectType({
	playerName: stringType().min(1).max(20),
	score: numberType().int().min(0)
});
var saveScore_createServerFn_handler = createServerRpc({
	id: "e91345551373fb92ff854dabc575923814711a7efefb94cbbcaf691774827b57",
	name: "saveScore",
	filename: "src/lib/game.functions.ts"
}, (opts) => saveScore.__executeServer(opts));
var saveScore = createServerFn({ method: "POST" }).validator((data) => saveScoreInput.parse(data)).handler(saveScore_createServerFn_handler, async ({ data }) => {
	const { error } = await createPublishableClient().from("scores").insert({
		player_name: data.playerName.trim(),
		score: data.score
	});
	if (error) throw new Error(error.message);
	return { success: true };
});
var getTopScores_createServerFn_handler = createServerRpc({
	id: "5d381809dd0bbf8ad37ccfeec641d4c1e0107faf22be59ef252eecd85bb1d194",
	name: "getTopScores",
	filename: "src/lib/game.functions.ts"
}, (opts) => getTopScores.__executeServer(opts));
var getTopScores = createServerFn({ method: "GET" }).handler(getTopScores_createServerFn_handler, async () => {
	const { data, error } = await createPublishableClient().from("scores").select("player_name, score, created_at").order("score", { ascending: false }).order("created_at", { ascending: true }).limit(10);
	if (error) throw new Error(error.message);
	return data ?? [];
});
//#endregion
export { getTopScores_createServerFn_handler, saveScore_createServerFn_handler };
