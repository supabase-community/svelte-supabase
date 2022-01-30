import {toExpressRequest} from '$lib/auth/expressify';
import supabase from '$lib/db';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const { locals, request } = event;

	const expressRequest = toExpressRequest(request);
	const { user } = await supabase.auth.api.getUserByCookie(expressRequest);

	locals.token = expressRequest.cookies['sb:token'] || undefined;
	locals.user = user || false;

	if (locals.token) {
		supabase.auth.setAuth(locals.token);
	}

	return resolve(event);
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession = async (request) => request.locals;
