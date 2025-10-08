const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`;

export async function fetchDashboardSummary(clerkId: string) {
  const res = await fetch(`${API_URL}/summary?clerk_id=${clerkId}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function fetchDashboardPosts(
  clerkId: string,
  limit = 10,
  offset = 0
) {
  const res = await fetch(
    `${API_URL}/posts?clerk_id=${clerkId}&limit=${limit}&offset=${offset}`
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function fetchPaymentStats(clerkId: string) {
  const res = await fetch(`${API_URL}/payments?clerk_id=${clerkId}`);
  if (!res.ok) throw new Error("Failed to fetch payment stats");
  return res.json();
}

export async function fetchInvestorCountries(clerkId: string) {
  const res = await fetch(
    `${API_URL}/investors-by-country?clerk_id=${clerkId}`
  );
  if (!res.ok) throw new Error("Failed to fetch investor countries");
  return res.json();
}

export async function fetchTrendingPosts(clerkId: string, day?: string) {
  const url = `${API_URL}/posts/trending?clerk_id=${clerkId}${
    day ? `&day=${day}` : ""
  }`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch trending posts");
  return res.json();
}