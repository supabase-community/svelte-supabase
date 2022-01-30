import supabase from '$lib/db';

/** @type {(path: string, method: 'signIn' | 'signUp') => import('@sveltejs/kit').RequestHandler} */
export const createHandler = (path, method) =>
	async ({ request }) => {
		const body = await request.formData();
		const email = body.get('email');
		const password = body.get('password');
		const redirect = body.get('redirect') || '/';

		const { session, error } = await supabase.auth[method]({ email, password });

		if (!validateRedirect(redirect)) {
			return getErrorResponse('invalid redirect', '/', path);
		}

		if (error) {
			return getErrorResponse(error.message, redirect, path);
		}

		return getSuccessResponse(session, redirect);
	};


/** @type {(redirect: string) => boolean} */
export const validateRedirect = (redirect) => /^\/\w?/.test(redirect);

const getErrorResponse = (error, redirect, path) => {
	const params = new URLSearchParams();
	params.set('error', error);
	params.set('redirect', redirect);

	return {
		status: 302,
		body: 'error',
		headers: {
			location: `${path}?${params.toString()}`
		}
	};
};

const getSuccessResponse = (session, redirect) => ({
	status: 302,
	body: 'success',
	headers: {
		'set-cookie': getCookies(session),
		location: redirect || '/'
	}
});

/** @type {(session: import('@supabase/gotrue-js').Session) => string[]} */
export const getCookies = (session) => {
	const cookieOptions = `Path=/;Secure;SameSite=Strict;Expires=${new Date(
		session.expires_at * 1000
	).toUTCString()};`;

	return [
		`access_token=${session.access_token};${cookieOptions}`,
		`expires_at=${session.expires_at};${cookieOptions}`,
		`refresh_token=${session.refresh_token};${cookieOptions}`
	];
};

/** @type {(session: import('@supabase/gotrue-js').Session) => string[]} */
export const getDeletedCookies = () => {
	const cookieOptions = `Path=/;Secure;SameSite=Strict;Expires=${new Date(0).toUTCString()};`;

	return [
		`access_token=deleted;${cookieOptions}`,
		`expires_at=deleted;HttpOnly;${cookieOptions}`,
		`refresh_token=deleted;HttpOnly;${cookieOptions}`
	];
};
