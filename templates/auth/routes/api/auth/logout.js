import supabase from '$lib/db';
import { updateAuthCookies, validateRedirect } from '$lib/auth/helper';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const get = async (event) => {
	const { request } = event;
	const redirect = request.url?.searchParams?.get('redirect');

	return handleLogOut(event, redirect);
};

/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async (event) => {
	const { request } = event;

	const body = await request.formData();
	const redirect = body.get('redirect')?.toString() || '/';

	return handleLogOut(event, redirect);
};

const handleLogOut = async (event, redirect) => {
	const { locals } = event;

	if (!validateRedirect(redirect)) {
		redirect = '/';
	}

	if (locals.token) {
		await supabase.auth.signOut(locals.token);
	}

	const response = {
		status: 302,
		body: {
			event: 'SIGNED_OUT'
		},
		headers: {
			location: redirect || '/'
		}
	};

	updateAuthCookies(response);
	return response;
};
