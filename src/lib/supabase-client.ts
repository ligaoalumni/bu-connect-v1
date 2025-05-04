"use client";

import { createBrowserClient as createSupaClient } from "@supabase/ssr";

export function createBrowserClient() {
	return createSupaClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
