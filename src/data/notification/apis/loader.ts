/**
 * 0: success;
 * 1: invalid client id;
 * 2: invalid schedule id;
 * 3: client not found;
 * 4: schedule not found;
 * 5: authentication failure;
 * 6: schedule time error
 */
type NotificationResponseCode = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

export interface NotificationResponseMap {
  cancel: NotificationResponseCancel;
  register: NotificationResponseRegister;
  schedule: NotificationResponseSchedule;
  rotate: NotificationResponseRotate;
  reschedule: NotificationResponseReschedule;
}

export async function makeNotificationRequest<M extends keyof NotificationResponseMap>(method: M, url: string | false, body: object | false): Promise<NotificationResponseMap[M] | false> {
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
      const json = JSON.parse(text) as NotificationResponseMap[M];
      if (method === json.method) {
        return json;
      } else {
        return false;
      }
    } catch (jsonError) {
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    // Catch and log errors
    console.error('Error making request:', error);
    return false;
  }
}
