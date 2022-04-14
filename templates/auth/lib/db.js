import { parse as cookieParse } from 'cookie-es';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	/** @type {string} */
	import.meta.env.VITE_SUPABASE_URL.toString(),
	/** @type {string} */
	import.meta.env.VITE_SUPABASE_ANON_KEY.toString()
);

export default supabase;
