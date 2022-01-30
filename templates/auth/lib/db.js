import { parse as cookieParse } from 'cookie-es';
import { createClient } from '@supabase/supabase-js';
import '$lib/auth/cookie-change';
import { browser } from '$app/env';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// This is what allows us to make requests from the client JS
if (browser) {
	const update = () => {
		const cookies = cookieParse(document.cookie);
    supabase.auth.setAuth(cookies['sb:token']);
	};

	document.addEventListener('cookiechange', update);
	update();
}

export default supabase;
