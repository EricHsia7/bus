import { NotificationClientID, NotificationSecret, NScheduleFrontend, saveNotificationSchedule } from '../../index';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest } from '../loader';
import { rotateNotificationSecret } from '../rotateNotificationSecret/index';

export async function scheduleNotification(stop_id: NScheduleFrontend['stop_id'], location_name: NScheduleFrontend['location_name'], route_id: NScheduleFrontend['route_id'], route_name: NScheduleFrontend['route_name'], direction: NScheduleFrontend['direction'], estimate_time: NScheduleFrontend['estimate_time'], time_formatting_mode: NScheduleFrontend['time_formatting_mode'], scheduled_time: string | number | Date): Promise<string | false> {
  if (NotificationClientID === '' || NotificationSecret === '' || stop_id === undefined || location_name === undefined || route_id === undefined || route_name === undefined || direction === undefined || estimate_time === undefined || !(typeof time_formatting_mode === 'number') || scheduled_time === undefined) {
    return false;
  }
  let processed_schedule_time = new Date();
  switch (typeof scheduled_time) {
    case 'string':
      processed_schedule_time = new Date(scheduled_time);
      break;
    case 'number':
      processed_schedule_time = new Date(scheduled_time);
      break;
    default:
      if (scheduled_time instanceof Date) {
        processed_schedule_time = scheduled_time;
      } else {
        return false;
      }
      break;
  }
  const url = getNotificationAPIURL('schedule');
  const requestBody = getNotificationRequestBody('schedule', [stop_id, location_name, route_id, route_name, direction, estimate_time, time_formatting_mode, processed_schedule_time.toISOString()]);
  const response = await makeNotificationRequest('schedule', url, requestBody);
  if (response === false) {
    return false;
  } else {
    if (response.code === 200 && response.method === 'schedule') {
      if (Math.random() > 0.8) {
        await rotateNotificationSecret();
      }
      saveNotificationSchedule(response.schedule_id, stop_id, location_name, route_id, route_name, direction, estimate_time, processed_schedule_time.getTime());
      return response.schedule_id;
    } else {
      return false;
    }
  }
}
