export async function requestNotificationAPI(url: string): Promise<object | false> {
  try {
    // Send the request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Log additional details for debugging
      const errorText = await response.text();
      console.error('API request failed', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return false;
    }

    // Attempt to parse the JSON response
    try {
      const text = await response.text();
      const json = JSON.parse(text);
      return json;
    } catch (jsonError) {
      console.error('Failed to parse JSON response', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    // Catch and log errors
    console.error('Error scheduling message:', error);
    return false;
  }
}
