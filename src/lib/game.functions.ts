import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

type ScoresTable = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};

type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      scores: {
        Row: ScoresTable;
        Insert: { player_name: string; score: number };
        Update: never;
        Relationships: never[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

function createPublishableClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const saveScoreInput = z.object({
  playerName: z.string().min(1).max(20),
  score: z.number().int().min(0),
});

const saveScoreInput = z.object({
  playerName: z.string().min(1).max(20),
  score: z.number().int().min(0),
});

export const saveScore = createServerFn({ method: "POST" })
  .validator((data: { playerName: string; score: number }) => saveScoreInput.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublishableClient();
    const { error } = await supabase
      .from("scores")
      .insert({ player_name: data.playerName.trim(), score: data.score });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });

export const getTopScores = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublishableClient();
  const { data, error } = await supabase
    .from("scores")
    .select("player_name, score, created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
});
