// app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error loading profile:", error);
    return (
      <main className="p-8">
        <h1>Error loading profile data</h1>
        <p>Please try again later.</p>
        <form action="/auth/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1>Home</h1>
      <p>Welcome, **{profile?.full_name || profile?.username || session.user.email}**!</p>

      <form action="/auth/logout" method="post" className="mt-8">
        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Logout
        </button>
      </form>
    </main>
  );
}
