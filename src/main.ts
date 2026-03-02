import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environment';

// Production'da console.log'u devre dışı bırak
if (environment.production) {
  window.console.log = () => {};
  window.console.debug = () => {};
  window.console.info = () => {};
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
