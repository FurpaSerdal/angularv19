import { DestroyRef, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export abstract class BaseComponent {

  protected destroyRef = inject(DestroyRef);
  protected toastr = inject(ToastrService);

  yukleniyor = signal(false);

  protected startLoading() {
    this.yukleniyor.set(true);
  }

  protected stopLoading() {
    this.yukleniyor.set(false);
  }

  protected error(message = 'Bir hata oluştu') {
    this.toastr.error(message, 'Hata');
  }
}
