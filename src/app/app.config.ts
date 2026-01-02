import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes , withHashLocation()),
    provideHttpClient(),
    provideAnimations(),

    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        toastClass: 'ngx-toastr custom-toast', 
        titleClass: 'toast-title',
        messageClass: 'toast-message',
       closeButton: true,
        progressBar: true,
        newestOnTop: true,
      })
    ),
  ],
};



