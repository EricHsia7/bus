type NotificationResponseCode = 200 | 400 | 401 | 404 | 500;

interface NotificationResponseCancel {
  result: string;
  code: NotificationResponseCode;
  method: 'cancel';
}

interface NotificationResponseRegister {
  result: string;
  code: NotificationResponseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

interface NotificationResponseSchedule {
  result: string;
  code: NotificationResponseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

interface NotificationResponseRotate {
  result: string;
  code: NotificationResponseCode;
  method: 'rotate';
  secret: string | 'null';
}

interface NotificationResponseReschedule {
  result: string;
  code: NotificationResponseCode;
  method: 'reschedule';
}

export type NotificationResponse = NotificationResponseCancel | NotificationResponseRegister | NotificationResponseSchedule | NotificationResponseRotate | NotificationResponseReschedule;

export async function makeNotificationRequest(method: NotificationResponse['method'], url: string | false, body: object | false): Promise<NotificationResponse | false> {
  try {
    if (url === false || body === false) {
      return false;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'omit'
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
          return json as NotificationResponseCancel;
          break;
        case 'register':
          return json as NotificationResponseRegister;
          break;
        case 'schedule':
          return json as NotificationResponseSchedule;
          break;
        case 'rotate':
          return json as NotificationResponseRotate;
          break;
        case 'reschedule':
          return json as NotificationResponseReschedule;
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
