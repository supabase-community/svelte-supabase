import {toExpressRequest, toExpressResponse} from '$lib/auth/expressify';
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

		const response = getSuccessResponse(session, redirect);
		updateAuthCookie(request, response);
		return response;
	};


/** @type {(redirect: string) => boolean} */
export const validateRedirect = (redirect) => /^\/\w?/.test(redirect);

export const updateAuthCookie = async (request, response) => {
	const expressResponse = await toExpressResponse(response);
	const expressRequest = toExpressRequest(request);
	expressRequest.body = expressResponse.body;
	supabase.auth.api.setAuthCookie(expressRequest, expressResponse)
	response.headers['set-cookie'] = expressResponse.getHeader('set-cookie');
};

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
	body: {
		event: 'SIGNED_IN',
		session,
	},
	headers: {
		location: redirect || '/'
	}
});
