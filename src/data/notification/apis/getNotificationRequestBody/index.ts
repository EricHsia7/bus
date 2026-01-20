import { sha512 } from '../../../../tools/index';
import { NotificationClientID, NotificationResponse, NotificationSecret } from '../../index';
import { getNotificationToken } from '../getNotificationToken/index';

export function getNotificationRequestBody(method: NotificationResponse['method'], parameters: Array<any>): object | false {
  switch (method) {
    case 'cancel':
      if (NotificationClientID === '' || NotificationSecret === '' || parameters.length !== 1) {
        return false;
      } else {
        return {
          client_id: NotificationClientID,
          token: getNotificationToken(NotificationClientID, NotificationSecret, { schedule_id: parameters[0] }),
          schedule_id: parameters[0]
        };
      }
      break;
    case 'register':
      if (parameters.length !== 1) {
        return false;
      } else {
        const currentDate = new Date();
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        return {
          hash: sha512(`${sha512(parameters[0])}${currentDate.getTime()}`)
        };
      }
      break;
    case 'schedule':
      if (NotificationClientID === '' || NotificationSecret === '' || parameters.length !== 9) {
        return false;
      } else {
        return {
          client_id: NotificationClientID,
          token: getNotificationToken(NotificationClientID, NotificationSecret, { stop_id: parameters[0], location_name: parameters[1], route_id: parameters[2], route_name: parameters[3], direction: parameters[4], estimate_time: parameters[5], time_formatting_mode: parameters[6], time_offset: parameters[7], scheduled_time: parameters[8] }),
          stop_id: parameters[0],
          location_name: parameters[1],
          route_id: parameters[2],
          route_name: parameters[3],
          direction: parameters[4],
          estimate_time: parameters[5],
          time_formatting_mode: parameters[6],
          time_offset: parameters[7],
          scheduled_time: parameters[8]
        };
      }
      break;
    case 'rotate':
      if (NotificationClientID === '' || NotificationSecret === '' || parameters.length !== 0) {
        return false;
      } else {
        return {
          client_id: NotificationClientID,
          token: getNotificationToken(NotificationClientID, NotificationSecret, {})
        };
      }
      break;
    case 'reschedule':
      if (NotificationClientID === '' || NotificationSecret === '' || parameters.length !== 3) {
        return false;
      } else {
        return {
          client_id: NotificationClientID,
          token: getNotificationToken(NotificationClientID, NotificationSecret, { schedule_id: parameters[0], estimate_time: parameters[1], scheduled_time: parameters[2] }),
          schedule_id: parameters[0],
          estimate_time: parameters[1],
          scheduled_time: parameters[2]
        };
      }
      break;
    default:
      return false;
      break;
  }
}
