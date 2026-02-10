import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dosya-gonderimi',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dosya-gonderimi.component.html',
  styleUrls: ['./dosya-gonderimi.component.css']  // styleUrl -> styleUrls
})
export class DosyaGonderimiComponent {
}
