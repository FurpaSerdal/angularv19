import { CommonModule } from '@angular/common';
import { AfterViewInit,Component,computed,OnInit,signal,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginator,MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatTable,MatTableDataSource,MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PurchaseInvoicesService } from '../../../../services/invoices/purchase-invoices.service';
import { MeService } from '../../../../services/meservice.service';

export interface Fatura {
  cha_uid: string;
  cha_tarihi: string;
  cha_evrak_tip: number;
  cha_tip: number;
  cha_cinsi: number;
  irsaliyeNo: string;
  eFaturaNushaDamgasi: string;
  cha_kod: string;
  cha_evrakno_seri: string;
  cha_evrakno_sira: number;
  cha_belge_no: string;
  islendi: boolean;
  yazdirildi: boolean;
  taslaktir: boolean;
  cha_create_date: string;
  cha_lastup_date: string;
  kalemler: any; // Eğer detaylıysa ayrı model yapılabilir
  vkntckn: string;
  eFaturaUnvani: string;
  cari_kod: string;
}

@Component({
  selector: 'app-incoming-invoice',
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule
  ],  templateUrl: './incoming-invoice.html',
  styleUrls: ['./incoming-invoice.css'],
})
export class IncomingInvoice implements OnInit, AfterViewInit{


  // Signal tanımlamaları
  aramaKelimesi = signal<string>('');
  baslangicTarihi = signal<string>('');
  bitisTarihi = signal<string>('');
  yukleniyor = signal<boolean>(true);
  qrIrsaliyeNo = signal<string>('');
  yedeklenmisFaturalar = signal<Fatura[]>([]);
  filtrelenmisFaturalar = signal<Fatura[]>([]);
  yazdirildi = signal<number>(2);

  // Tablo sütunları
  displayedColumns: string[] = [
    'cha_belge_no',
    'eFaturaUnvani',
    'cha_tarihi',
    'gonderilme_tarihi',
    'irsaliyeNo',
    'vkntckn',
    'yazdirildi',
    'actions'
  ];
;
  // ViewChild'ler
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;


  // Tablo veri kaynağı
dataSourceFiltreli = new MatTableDataSource<Fatura>([]);

  constructor(
    private meService: MeService,
    private purchaseInvoicesService: PurchaseInvoicesService,
  ) { }
   user = computed(() => this.meService.userSignal());
   gorev = computed(() => this.meService.selectedGorev());


  ngOnInit(): void {
    console.log('Kullanıcı Bilgisi:', this.user());
    console.log('Seçili Görev:', this.gorev());
    // Başlangıçta bugünün tarihini ayarla
    const bugun = new Date();
    this.baslangicTarihi.set(this.formatTarih(bugun));
    this.bitisTarihi.set(this.formatTarih(bugun));

    // Faturaları yükle
    this.faturagetir();
  }

  ngAfterViewInit(): void {
    // Paginator ve sıralama ayarlarını yap
    this.dataSourceFiltreli.paginator = this.paginator;
    this.dataSourceFiltreli.sort = this.sort;
    this.ozelSiralamaAyarla();
  }

  private ozelSiralamaAyarla(): void {
    this.dataSourceFiltreli.sortingDataAccessor = (item: any, property: string): string | number => {
      switch (property) {
        case 'invoiceTotal':
          // Sayısal değerler için sıralama
          const tutar = parseFloat(item.invoiceTotal.toString());
          return isNaN(tutar) ? 0 : tutar;

        case 'cha_tarihi':
        case 'gonderilme_tarihi':
          // Tarih sıralama için özel işlem
          const tarihDegeri = item[property as keyof any];
          if (tarihDegeri === null || tarihDegeri === undefined) {
            return 0;
          }
          
          // Sadece string veya number tipindeki tarihleri işle
          if (typeof tarihDegeri === 'string' || typeof tarihDegeri === 'number') {
            const tarih = new Date(tarihDegeri);
            return isNaN(tarih.getTime()) ? 0 : tarih.getTime();
          }
          return 0;

        default:
          // Diğer tüm alanlar için string sıralama
          const deger = item[property as keyof any];
          if (deger === null || deger === undefined) {
            return '';
          }
          return deger.toString();
      }
    };
  }

  // Tarih formatlama fonksiyonu
  private formatTarih(tarih: Date): string {
    return tarih.toISOString().split('T')[0];
  }

  // Faturaları getirme fonksiyonu
  faturagetir(): void {
    this.dataSourceFiltreli.data=[]
    this.yukleniyor.set(true);
    const zamanAraligi = this.zamanAraliginiOlustur();

    this.purchaseInvoicesService.getInvoices(this.gorev()?.id ?? 0, zamanAraligi).subscribe({
      next: (data:Fatura[]) => {
        console.log('Faturalar:', data);
        this.dataSourceFiltreli.data = data ;
        this.yedeklenmisFaturalar.set(data);
        this.yukleniyor.set(false);
      },
      error: (_error) => {
        this.hataGoster('Faturalar getirilirken hata oluştu');
        this.yukleniyor.set(false);
      }
    });
  }

  // Fatura arama fonksiyonu
async faturaAra(): Promise<void> {
  try {
    this.yukleniyor.set(true);

    const zamanAraligi = this.zamanAraliginiOlustur();
    const faturalar = await this.purchaseInvoicesService.getInvoices(this.gorev()?.id ?? 0, zamanAraligi).toPromise();
    const gelenFaturalar = faturalar ?? [];

    this.filtrelenmisFaturalar.set(gelenFaturalar); // ✅ Arama sonucu set edilir
    this.yazdirildiFiltrele();                     // ✅ Sadece arama sonucuna filtre uygulanır
  } catch (error) {
    this.filtrelenmisFaturalar.set([]);
    this.dataSourceFiltreli.data = [];
    this.hataGoster('Fatura aranırken bir hata oluştu');
  } finally {
    this.yukleniyor.set(false);
  }
}
yazdirildiFiltrele(): void {
  const filtreSecenegi = this.yazdirildi(); // 0: Yazdırılmayan, 1: Yazdırılan, 2: Tümü
  const tumFaturalar = this.filtrelenmisFaturalar(); // ✅ Arama sonucu veya ilk gelen veriler

  if (filtreSecenegi === 2) {
    this.dataSourceFiltreli.data = tumFaturalar;
  } else {
    const filtreSonucu = tumFaturalar.filter(fatura => {
      const yazdirilmis = fatura.yazdirildi === true
      return filtreSecenegi === 1 ? yazdirilmis : !yazdirilmis;
    });

    this.dataSourceFiltreli.data = filtreSonucu;
  }
}
  // Zaman aralığı oluşturma fonksiyonu
  private zamanAraliginiOlustur(): string {
    return `aralik-${this.baslangicTarihi()}-${this.bitisTarihi()}`;
  }

  // Filtreleri sıfırlama fonksiyonu
  filtreyiSifirla(): void {
    this.aramaKelimesi.set('');
    this.qrIrsaliyeNo.set('');

    const yedekVeri = this.yedeklenmisFaturalar();
    this.dataSourceFiltreli.data = yedekVeri.length > 0 ? yedekVeri : [];
    this.filtrelenmisFaturalar.set([]);

    this.yukleniyor.set(false);
  }
  

  // Hata gösterme fonksiyonu
  private hataGoster(mesaj: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: mesaj,
      confirmButtonText: 'Tamam'
    });
  }

  // Uyumsoft ile eşitleme fonksiyonu
  // uyumsoftEsitle(): void {
  //   Swal.fire({
  //     title: 'Uyumsoft ile Eşitleniyor...',
  //     didOpen: () => Swal.showLoading(),
  //     allowOutsideClick: false,
  //     showConfirmButton: false,
  //   });

  //   this.faturaServis.uyumsoftesitle().subscribe({
  //     next: (res) => {
  //       Swal.close();
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Başarılı!',
  //         html: `Eşitleme işlemi tamamlandı.<br>Hata mesajı: ${res.basarili}`,
  //         timer: 4000,
  //         showConfirmButton: false
  //       });
  //       this.faturagetir(); // Listeyi yenile
  //     },
  //     error: (err) => {
  //       Swal.close();
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Hata!',
  //         text: 'Eşitleme sırasında bir hata oluştu.',
  //         confirmButtonText: 'Tamam'
  //       });
  //     }
  //   });
  // }

// async faturabul(): Promise<void> {
//   // QR kodun tamamı bu sinyalde varsayalım
//   const qrMetni = this.qrIrsaliyeNo();

//   // QR'dan irsaliye noyu çıkar
//   const irsaliyeNo = this.irsaliyeNoCikar(qrMetni);

//   if (!irsaliyeNo) {
//     alert('Geçerli bir irsaliye no bulunamadı.');
//     return;
//   }

//   // Sadece irsaliye no inputta görünsün diye sinyali güncelle
//   this.qrIrsaliyeNo.set(irsaliyeNo);

//   try {
//     this.dataSourceFiltreli.data = [];
//     this.yukleniyor.set(true);
//     const zamanAraligi = this.zamanAraliginiOlustur();
//     const aramaKelimesi = irsaliyeNo;

//     const faturalar = await firstValueFrom(
//       this.faturaServis.faturalariAra(zamanAraligi, aramaKelimesi)
//     );

//     this.dataSourceFiltreli.data = faturalar;
//   } catch (hata) {
//     this.dataSourceFiltreli.data = [];
//     this.hataGoster('Fatura aranırken bir hata oluştu');
//   } finally {
//     this.yukleniyor.set(false);
//   }
// }

// irsaliyeNoCikar(qrMetni: string): string | null {
//   const regex = /İnoİŞİ([^İö]+)İöİ/;
//   const eslesme = qrMetni.match(regex);
//   if (eslesme && eslesme[1]) {
//     return eslesme[1].trim();
//   }
//   return null;
// }
//   // PDF indirme fonksiyonu
//   pdfindir(id: string): void {
//     this.faturaServis.PDFIndir(id).subscribe({
//       next: (pdfUrl) => {
//         this.dialog.open(PdfComponent, {
//           width: '50vw',
//           height: '80vh',
//           data: { url: pdfUrl }
//         });
//       },
//       error: (error) => {
//         this.hataGoster('PDF indirilirken hata oluştu');
//       }
//     });
//   }

// xlmgoruntule(belgeid: string) {
//   this.faturaServis.htlmgetir(belgeid).subscribe(res => {
//     const html = res;
//     this.faturaServis.printHtml(html);
//     console.log(html);
//   });
// }

// async yazdir(belgeid: string): Promise<void> {
//   try {
//     // Önce PDF yazdırma işlemi
// this.faturaServis.htlmgetir(belgeid).subscribe({
//   next: (html) => {
//     this.faturaServis.printHtml(html);
//   },
//   error: (err) => {
//     console.error('HTML getirilemedi:', err);
//   }
// });
//     // PDF yazdırma başarılı olduysa, veritabanında işaretle
//     const dto: yazdiridi = {
//       EFaturaId: belgeid,
//       Yazdirildi: true,
//       Islendi: false
//     };
 
//     await firstValueFrom(this.faturaServis.yazdirildi(dto));
//  // Signal'den sil

//  this.dataSourceFiltreli.data = this.dataSourceFiltreli.data.filter(f => f.cha_uid !== belgeid);



//   } catch (error) {
//     this.hataGoster(error instanceof Error ? error.message : 'Yazdırma işlemi başarısız.');
//   }

  
// }

//   // Blob'dan PDF yazdırma fonksiyonu
//   printPdfFromBlob(url: string): void {
//     const token = sessionStorage.getItem('authToken');
//     if (!token) { 
//       this.hataGoster('Oturum bilgisi bulunamadı');
//       return;
//     }

//     fetch(url, {
//       headers: { 'Authorization': `Bearer ${token}` }
//     })
//       .then(response => {
//         if (!response.ok) throw new Error('PDF indirilemedi');
//         return response.blob();
//       })
//       .then(blob => {
//         if (blob.type !== 'application/pdf') {
//           throw new Error('Dosya PDF formatında değil');
//         }

//         const blobUrl = URL.createObjectURL(blob);
//         const iframe = document.createElement('iframe');

//         iframe.style.position = 'fixed';
//         iframe.style.right = '10px';
//         iframe.style.bottom = '10px';
//         iframe.style.width = '600px';
//         iframe.style.height = '800px';
//         iframe.style.border = '1px solid black';

//         iframe.src = blobUrl;
//         document.body.appendChild(iframe);

//         iframe.onload = () => {
//           setTimeout(() => {
//             iframe.contentWindow?.focus();
//             iframe.contentWindow?.print();
//             document.body.removeChild(iframe);
//             URL.revokeObjectURL(blobUrl);
//           }, 500);
//         };
//       })
//       .catch(err => this.hataGoster('Yazdırma hatası: ' + err.message));
//   }
}