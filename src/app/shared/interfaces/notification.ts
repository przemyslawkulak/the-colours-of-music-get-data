// TODO check if not change interface

export interface NotificationOptions {
  closeButton: boolean;
  progressBar: boolean;
  timeOut: number;
  extendedTimeOut: number;
  enableHtml: boolean;
  tapToDismiss: boolean;
}

export enum NotificationType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success',
}
