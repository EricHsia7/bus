export type NotificationResponseCode = 200 | 400 | 401 | 404 | 500;

export interface NotificationResponseObjectCancel {
  result: string;
  code: NotificationResponseCode;
  method: 'cancel';
}

export interface NotificationResponseObjectRegister {
  result: string;
  code: NotificationResponseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

export interface NotificationResponseObjectSchedule {
  result: string;
  code: NotificationResponseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

export interface NotificationResponseObjectUpdate {
  result: string;
  code: NotificationResponseCode;
  method: 'update';
}

export type NotificationResponseObject = NotificationResponseObjectCancel | NotificationResponseObjectRegister | NotificationResponseObjectSchedule | NotificationResponseObjectUpdate;
