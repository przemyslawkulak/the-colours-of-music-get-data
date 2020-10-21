// TODO - check if needed EscapeHtmlService, NotificationService, LoaderService

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// import { EscapeHtmlService } from '@services/escape-html.service';
// import { NotificationService } from '@services/notification.service';
// import { LoaderService } from '@core/services/loader.service';

import { NotificationOptions, NotificationType } from '@interfaces/notification';
import { ErrorResponse, ErrorResponseType } from '@interfaces/error';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseApiUrl: string = '/api/v1/';
  private readonly defaultOptions: any = {
    withCredentials: true,
  };

  private readonly notificationOptions: NotificationOptions;
  private readonly ErrorResponseType = ErrorResponseType;
  private readonly NotificationType = NotificationType;

  constructor(private httpClient: HttpClient) // private escapeHtmlService: EscapeHtmlService,
  // private loaderService: LoaderService,
  // private notificationService: NotificationService
  {
    // this.notificationOptions = notificationService.notificationOptions;
  }

  get(url: string, params?: HttpParams | { [param: string]: any }): Observable<any> {
    const options = Object.assign({}, this.defaultOptions);

    if (params) {
      options.params = params;
    }

    return this.httpClient.get(this.baseApiUrl + url, options).pipe(
      catchError((error) => {
        this.onError(error.error);
        return throwError(error);
      })
    );
  }

  post(url: string, data: any, options?: any): Observable<any> {
    options = options ? Object.assign({}, this.defaultOptions, options) : this.defaultOptions;

    return this.httpClient.post(this.baseApiUrl + url, data, options).pipe(
      catchError((error) => {
        this.onError(error.error);
        return throwError(error);
      })
    );
  }

  patch(url: string, data: any, options?: any): Observable<any> {
    options = options ? Object.assign({}, this.defaultOptions, options) : this.defaultOptions;

    return this.httpClient.patch(this.baseApiUrl + url, data, options).pipe(
      catchError((error) => {
        this.onError(error.error);
        return throwError(error);
      })
    );
  }

  put(url: string, data: any): Observable<any> {
    return this.httpClient.put(this.baseApiUrl + url, data, this.defaultOptions).pipe(
      catchError((error) => {
        this.onError(error.error);
        return throwError(error);
      })
    );
  }

  delete(url: string): Observable<any> {
    return this.httpClient.delete(this.baseApiUrl + url, this.defaultOptions).pipe(
      catchError((error) => {
        this.onError(error.error);
        return throwError(error);
      })
    );
  }

  private onError(error: ErrorResponse) {
    // this.loaderService.finish();

    // Przemek: handling lowercase and uppercase in error object
    error = Object.keys(error).reduce(function (accum, key) {
      accum[key.toLowerCase()] = error[key];
      return accum;
    }, {});

    if (!error) {
      return;
    }

    this.notifyUser(error);

    if (error.reload) {
      // DESTROY SESSSION AFTER 3 SECONDS
      // keep it for a small period of time so user can see the message
      //   setTimeout(() => {
      //     this.rootService.rootScope.$broadcast('destroySession');
      //   }, 3000);
    }
  }

  private notifyUser(response: ErrorResponse) {
    // we apply escapeHtml to each element separately,
    // and do not use notificationOptions.escapeHtml = false,
    // because we need multiline toastr message
    let errorMessage = response.summary
      ? // ? this.escapeHtmlService.escapeHtml(response.summary)
        this.checkMessages(response)
      : `We're having trouble accessing PortLog Fixtures services. Please check your network connectivity. If this doesn't help, please follow up with our support team.`;

    if (response.messages && response.messages.length) {
      const listItems = response.messages.reduce((acc, message) => {
        // acc += `<li class=\"toastr-link\">${this.escapeHtmlService.escapeHtml(message.value)}</li>`;
        return acc;
      }, '');

      errorMessage += `<ul>${listItems}</ul>`;
    }

    let notificationType: string;

    switch (response.type) {
      case this.ErrorResponseType.Validation:
        notificationType = this.NotificationType.Warning;
        break;
      case this.ErrorResponseType.Info:
        notificationType = this.NotificationType.Info;
        break;
      default:
        notificationType = this.NotificationType.Error;
    }

    // this.notificationService[notificationType](
    //   errorMessage,
    //   this.escapeHtmlService.escapeHtml(response.title),
    //   this.notificationOptions
    // );
  }

  checkMessages(res: ErrorResponse) {
    return res.messages ? '' : res.summary;
  }
}
