
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent {
  safePdfUrl: SafeResourceUrl = '';
  pdfBlobUrl: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<PdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.loadPdf(data.url);
  }

  loadPdf(url: string): void {
    // Blob URL'ni doğrudan kullan
    this.pdfBlobUrl = url;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  printPdf() {
  const iframe: HTMLIFrameElement | null = document.querySelector('iframe');
  if (iframe && iframe.contentWindow) {
    
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  } else {
    console.error('Yazdırılacak PDF bulunamadı.');
  }
}
indirPdf() {

  if (!this.pdfBlobUrl) {
    console.error('PDF URL bulunamadı.');
    return;
  }


  const link = document.createElement('a');
  link.href = this.pdfBlobUrl;
  link.download = 'belge.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
