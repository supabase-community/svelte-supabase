import { toExpressRequest, toExpressResponse } from '$lib/auth/expressify';
import supabase from '$lib/db';

/**
 * @param {string} path
 * @param {'signIn' | 'signUp'} method
 * @return {import('@sveltejs/kit').RequestHandler}
 */
export const createHandler =
	(path, method) =>
	async ({ request }) => {
		const body = await request.formData();
		const email = body.get('email').toString();
		const password = body.get('password').toString();
		const redirect = body.get('redirect').toString() || '/';

		const { session, error } = await supabase.auth[method]({ email, password });

		if (!validateRedirect(redirect)) {
			return getErrorResponse('invalid redirect', '/', path);
		}

		if (error) {
			return getErrorResponse(error.message, redirect, path);
		}

		const response = getSuccessResponse(session, redirect);
		updateAuthCookie(request, response);
		return response;
	};

/**
 * @param {string} redirect
 * @return {boolean}
 */
export const validateRedirect = (redirect) => /^\/\w?/.test(redirect);

/**
 * @param {URL} url
 * @return {string} the path to use for redirect through /auth endpoints and pages
 */
export const getRelativePath = (url) =>
	url.pathname.startsWith('/auth/')
		? url.searchParams.get('redirect')
		: url.toString().substring(url.origin.length);

/**
 * @param {Request} request
 * @param {import('@sveltejs/kit').EndpointOutput} response
 */
export const updateAuthCookie = async (request, response) => {
	const expressResponse = await toExpressResponse(response);
	const expressRequest = toExpressRequest(request);
	expressRequest.body = expressResponse.body;
	supabase.auth.api.setAuthCookie(expressRequest, expressResponse);
	const cookies = expressResponse.getHeader('set-cookie');
	let cookie = Array.isArray(cookies) ? cookies.find((c) => c.startsWith('sb:token=')) : cookies;

	if (cookie) {
		cookie = cookie.replace('HttpOnly;', '');
	}

	response.headers['set-cookie'] = cookie;
};

/**
 * @param {string} error
 * @param {string} redirect
 * @param {string} path
 * @return {import('@sveltejs/kit').EndpointOutput}
 */
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

/**
 * @param {import('@supabase/gotrue-js').Session} session
 * @param {string} redirect
 * @return {import('@sveltejs/kit').EndpointOutput}
 */
const getSuccessResponse = (session, redirect) => ({
	status: 302,
	body: {
		event: 'SIGNED_IN',
		session
	},
	headers: {
		location: redirect || '/'
	}
});
