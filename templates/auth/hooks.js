import { parse as cookieParse } from 'cookie-es';
import { getCookies, getDeletedCookies } from '$lib/auth/helper';
import supabase from '$lib/db';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const cookies = cookieParse(event.request.headers.get('cookie') || '');
	const { access_token, refresh_token, expires_at } = cookies;

	let modifyResponse;

	if (event.locals.user && refresh_token && expires_at && hasExpired(expires_at)) {
		modifyResponse = await attemptRefresh(event, refresh_token);
	} else if (access_token) {
		const { user, error } = await supabase.auth.api.getUser(access_token);
		if (error) {
			modifyResponse = await attemptRefresh(event, refresh_token);
		} else {
			event.locals.user = user || false;
		}
	}

	return modifyResponse ? modifyResponse(resolve(event)) : resolve(event);
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession = async (request) => request.locals;

const hasExpired = (expireStr) =>
	parseInt(expireStr || '0', 10) * 1000 < Date.now();

const attemptRefresh = async (event, refreshToken) => {
	const { user, session, error } = await supabase.auth.signIn({ refreshToken });

	if (error) {
		return onRefreshError(event);
	}

	if (user) {
		return onRefreshUser(event, user, session);
	}

	if (session?.access_token) {
		const { user, error } = await supabase.auth.api.getUser(session.access_token);

		if (error) {
			return onRefreshError(event);
		}

		return onRefreshUser(event, user, session);
	}
};

const onRefreshError = (event) => {
	// TODO: deleting all cookies isn't _quite_ the same as deleting auth cookies
	event.request.headers.delete('cookie');
	event.locals.user = false;
	supabase.auth.setAuth(null);
	return handleRefreshErrorResponse;
};

const onRefreshUser = (event, user, session) => {
	event.request.headers.set('cookie', getCookies(session).join(''));
	event.locals.user = user || false;
	return getHandleRefreshSuccessResponse(session);
};

const handleRefreshErrorResponse = (value) => {
	const modify = (response) => {
		response.headers.set('set-cookie', getDeletedCookies().join(''));
		return response;
	};

	return value instanceof Promise ? value.then(modify) : modify(value);
};

const getHandleRefreshSuccessResponse = (session) =>
	(value) => {
		const modify = (response) => {
			response.headers.set('set-cookie', getCookies(session).join(''));
			return response;
		};

		return value instanceof Promise ? value.then(modify) : modify(value);
	};
