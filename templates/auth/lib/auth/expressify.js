import {parse as cookieParse} from 'cookie-es';

/**
 * Converts a SvelteKit request to a Express compatible request.
 * Supabase expects the cookies to be parsed.
 * @param {import('@sveltejs/kit).End} req
 * @returns Express.Request
 */
export function toExpressRequest(req) {
  return {
    method: req.method,
    headers: headersToObject(req.headers),
    cookies: cookieParse((req.headers instanceof Headers
      ? req.headers.get('cookie')
      : req.headers.cookie ) || '')
  };
}

/**
 * @param {headers: Headers | Record<string|string>}
 * @return {Record<string, string>}
 */
const headersToObject = (headers) => {
  if (headers instanceof Headers) {
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
 * @param {Response | import('@sveltejs/kit).EndpointOutput} resp
 * @returns Express.Response
 */
export async function toExpressResponse(resp) {
  const headers = headersToObject(resp.headers);
  return {
    body: resp instanceof Response ? await resp.json(): resp.body,
    getHeader: (header) => headers[header.toLowerCase()],
    setHeader: (header, value) => headers[header.toLowerCase()] = value,
    status: (_) => ({ json: (_) => {} })
  };
}
