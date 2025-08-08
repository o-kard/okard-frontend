import { User } from "../types/user";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user`;

export async function createUser(user: Omit<User, "id">): Promise<boolean> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  return res.ok;
}
