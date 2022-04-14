import supabase from '$lib/db';
import { getCookies } from '$lib/auth/helper';
import { parse } from 'cookie-es';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const { locals, request, url} = event;

	console.log('########################### request begin');
	console.log(url.toString());

	const cookiesHeader = request?.headers.get('cookie');
	let token;
	let user;
	let setCookies;

	if (cookiesHeader) {
		const cookies = parse(cookiesHeader);
		token = cookies.access_token;

		if (!token && cookies.refresh_token) {
			console.log('No access token provided. Refreshing ...');
			const { data, error } = await supabase.auth.api.refreshAccessToken(cookies.refresh_token);

			if (error) {
				console.error('Could not refresh access token', error);
				setCookies = getCookies(null);
			} else {
				token = data.access_token;
				setCookies = getCookies(data);
			}
		}
	}

	if (token) {
		const { user: tokenUser, error } = await supabase.auth.api.getUser(token);

		if (error) {
			console.error('Could not get user with access token', error);
		} else {
			user = tokenUser;
			console.log('Logged in as user', user);
		}
	}

	supabase.auth.setAuth(token);

	locals.token = token || undefined;
	locals.user = user || false;

	const response = await resolve(event);

	if (setCookies?.length) {
		setCookies.forEach((cookie) => response.headers.append('set-cookie', cookie));
	}

	console.log('########################### request end');
	return response;
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession = async (event) => event.locals;
