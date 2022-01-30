import { parse as cookieParse } from 'cookie-es';
import supabase from '$lib/db';
import { getDeletedCookies, validateRedirect } from '$lib/auth/helper';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
	const cookies = cookieParse(request.headers.get('cookie')) || '';

	const body = await request.formData();
	let redirect = body.get('redirect')?.toString() || '/';

	if (!validateRedirect(redirect)) {
		redirect = '/';
	}

	if (cookies.access_token) {
		await supabase.auth.signOut(cookies.access_token);
	}

	return {
		status: 302,
		body: 'success',
		headers: {
			'set-cookie': getDeletedCookies(),
			location: redirect || '/'
		}
	};
};
