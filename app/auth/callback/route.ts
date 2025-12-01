import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    // create the server Supabase client
    const supabase = await createClient();

    // exchange the code for the session token
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // redirects the user to the protected page
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // if there is an error or missing code, redirect to the error or login page
  return NextResponse.redirect(`${origin}/auth/error`);
}
