export default {
  async fetch(request, env, ctx) {
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
  }
};
