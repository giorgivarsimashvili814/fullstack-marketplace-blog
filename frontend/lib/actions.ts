"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-up`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    }
  );

  if (resp.status === 201) redirect("/auth/sign-in");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if(!token) return null

  const resp = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/current-user`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  const user = await resp.json();
  return user;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { path: "/", maxAge: 0 });
  revalidatePath("/");
}
