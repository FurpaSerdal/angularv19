import { ChangeDetectionStrategy,Component,signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IdleService } from './services/helper/idle.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('gunceltemplate');

    constructor(private auth: AuthService, private idle: IdleService) {
        this.auth.initializeAuthTimer();
        void this.idle;

    }

}

