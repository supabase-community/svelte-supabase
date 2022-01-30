import supabase from '$lib/db';
import { updateAuthCookie, validateRedirect } from '$lib/auth/helper';

/** @type {import('@sveltejs/kit').RequestHandler} */
export const post = async (event) => {
	const { request, locals } = event;

	const body = await request.formData();
	let redirect = body.get('redirect')?.toString() || '/';

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

	updateAuthCookie(request, response);
	return response;
};
