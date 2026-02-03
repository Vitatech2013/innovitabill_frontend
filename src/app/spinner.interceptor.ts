import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BusinessService } from './Services/business.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private businessService: BusinessService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log('API START'); // 👈 debug

    this.businessService.showSpinner();

    return next.handle(req).pipe(
      finalize(() => {
        console.log('API END'); // 👈 debug
        this.businessService.hideSpinner();
      })
    );
  }
}
