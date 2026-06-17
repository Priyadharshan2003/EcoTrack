"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLeaderboard() {
  const supabase = await createClient();

  // Get top individuals by points
  const { data: topUsers, error: usersError } = await supabase
    .from("profiles")
    .select("id, email, points")
    .order("points", { ascending: false })
    .limit(10);

  if (usersError) {
    console.error("Error fetching leaderboard:", usersError);
    return { topUsers: [], totalPoints: 0 };
  }

  // Get corporate total points (sum of all points)
  const { data: sumData, error: sumError } = await supabase
    .from("profiles")
    .select("points");

  let totalPoints = 0;
  if (!sumError && sumData) {
    totalPoints = sumData.reduce((acc, curr) => acc + (curr.points || 0), 0);
  }

  return { topUsers, totalPoints };
}
