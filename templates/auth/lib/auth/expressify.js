import {parse as cookieParse} from 'cookie-es';

/**
 * @typedef {{
 *    method: string,
 *    headers: Record<string, string | string[]>,
 *    cookies: Record<string, string | string[]>,
 * }} ExpressRequestLike
 */

/**
 * @typedef {{
 *    body: Object,
 *    getHeader: (header: string) => string | string[],
 *    setHeader: (header: string, value: string | string[]) => void,
 *    status: (_) => {json: (_) => void },
 * }} ExpressResponseLike
 */

/**
 * Converts a SvelteKit request to a Express compatible request.
 * Supabase expects the cookies to be parsed.
 * @param {Request} req
 * @returns {ExpressRequestLike}
 */
export const toExpressRequest = (req) => {
  const cookies = req.headers.get('cookie') || '';
  return {
    method: req.method,
    headers: headersToObject(req.headers),
    cookies: cookieParse(Array.isArray(cookies) ? cookies.join('') : cookies)
  };
}

/**
 * @param {Headers | Record<string, string | string[]>} headers
 * @return {Record<string, string | string[]>}
 */
const headersToObject = (headers) => {
  if (headers instanceof Headers) {
    /** @type {Record<string, string | string[]>} */
    const result = {};
    for (const pair of headers.entries()) {
      result[pair[0]] = pair[1];
    }

    return result;
  }

  return Object.assign({}, headers);
}

/**
 * Converts a SvelteKit response into an Express compatible response.
 * @param {Response | import('@sveltejs/kit').EndpointOutput} resp
 * @returns {Promise<ExpressResponseLike>}
 */
export const toExpressResponse = async (resp) => {
  const headers = headersToObject(resp.headers);
  return {
    body: resp instanceof Response ? await resp.json(): resp.body,
    getHeader: (header) => headers[header.toLowerCase()],
    setHeader: (header, value) => headers[header.toLowerCase()] = value,
    status: (_) => ({ json: (_) => {} })
  };
}
