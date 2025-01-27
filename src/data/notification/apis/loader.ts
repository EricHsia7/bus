type NResponseCode = 200 | 400 | 401 | 404 | 500;

interface NResponseCancel {
  result: string;
  code: NResponseCode;
  method: 'cancel';
}

interface NResponseRegister {
  result: string;
  code: NResponseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

interface NResponseSchedule {
  result: string;
  code: NResponseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

interface NResponseRotate {
  result: string;
  code: NResponseCode;
  method: 'rotate';
  secret: string | 'null';
}

interface NResponseReschedule {
  result: string;
  code: NResponseCode;
  method: 'reschedule';
}

export type NResponse = NResponseCancel | NResponseRegister | NResponseSchedule | NResponseRotate | NResponseReschedule;

export async function makeNotificationRequest(method: NResponse['method'], url: string | false, body: object | false): Promise<NResponse | false> {
  try {
    if (url === false || body === false) {
      return false;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    // Send the request
    const response = await fetch(url, requestOptions);

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
      switch (method) {
        case 'cancel':
          return json as NResponseCancel;
          break;
        case 'register':
          return json as NResponseRegister;
          break;
        case 'schedule':
          return json as NResponseSchedule;
          break;
        case 'rotate':
          return json as NResponseRotate;
          break;
        case 'reschedule':
          return json as NResponseReschedule;
          break;
        default:
          return false;
          break;
      }
    } catch (jsonError) {
      console.error('Failed to parse JSON response', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    // Catch and log errors
    console.error('Error making request:', error);
    return false;
  }
}
