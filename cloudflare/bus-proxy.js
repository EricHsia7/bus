export default {
  async fetch(request, env, ctx) {
    const allowedDomain = 'https://erichsia7.github.io';

    // Get the 'Referer' header from the incoming request
    const referer = request.headers.get('referer');

    // Check if the 'Referer' matches the allowed domain
    if (referer && referer.startsWith(allowedDomain)) {
      // Extract the URL of the request made to the worker
      const url = new URL(request.url);

      // Get query parameters from the original request
      const params = new URLSearchParams(url.search);

      // Extract the query parameters
      const apiUrl = params.get('url');
      const _ = params.get('_');

      // Forward the modified request to the API
      const response = await fetch(`${apiUrl}?_=${_}`, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : null
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    } else {
      return new Response('access denied');
    }
  }
};
