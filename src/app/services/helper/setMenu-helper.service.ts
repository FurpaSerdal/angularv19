import { Injectable } from "@angular/core";
import { User } from "../../models/user";


@Injectable({
  providedIn: 'root'
})
export class SetMenuHelperService {


  constructor() {
      
  }
newmenu: User[] = [
  {
    adSoyad: "Deneme Kullanıcısı",
    sube: "Çamlıca Şube",
    subeNo: 109,
    menuler: [
      {
        id: 1,
        isim: "Sevk İşlemleri",
        altMenuler: [
          {
            id: 1,
            isim: "Toptan Faturalı Sevkler",
            gorevler: [
              { id: 37, isim: "Alınan Siparişler" },
              { id: 38, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 2,
            isim: "Perakende Faturalı Sevkler",
            gorevler: [
              { id: 39, isim: "Alınan Siparişler" },
              { id: 40, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 3,
            isim: "Değer Farkı Faturalı Sevkler",
            gorevler: [
              { id: 41, isim: "Alınan Siparişler" },
              { id: 42, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 19,
            isim: "Toptan Sevkler",
            gorevler : [
              { id: 64, isim: "Alınan Siparişler" },
              { id: 65, isim: "Sevk İrsaliyeleri" },
              { id: 66, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 20,
            isim: "Perakende Sevkler",
            gorevler: [
              { id: 67, isim: "Alınan Siparişler" },
              { id: 68, isim: "Sevk İrsaliyeleri" },
              { id: 69, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 22,
            isim: "Depo Dağıtım Sevkleri",
            gorevler: [
              { id: 73, isim: "Alınan Depo Siparişleri" },
              { id: 74, isim: "Sevk İrsaliyeleri" }
            ]
          },
          {
            id: 24,
            isim: "Depolar Arası Sevkler",
            gorevler: [
              { id: 77, isim: "Alınan Depo Siparişleri" },
              { id: 78, isim: "Sevk İrsaliyeleri" }
            ]
          }
        ]
      },
      {
        id: 2,
        isim: "Mal Kabul İşlemleri",
        altMenuler: [
          {
            id: 4,
            isim: "Toptan Faturalı Mal Kabuller",
            gorevler: [
              { id: 43, isim: "Verilen Siparişler" },
              { id: 44, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 5,
            isim: "Perakende Faturalı Mal Kabuller",
            gorevler: [
              { id: 45, isim: "Verilen Siparişler" },
              { id: 46, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 6,
            isim: "Değer Farkı Faturalı Mal Kabuller",
            gorevler: [
              { id: 47, isim: "Verilen Siparişler" },
              { id: 48, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 7,
            isim: "Halden Alış Faturalı Mal Kabuller",
            gorevler: [
              { id: 49, isim: "Verilen Siparişler" },
              { id: 50, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 21,
            isim: "Toptan Mal Kabuller",
            gorevler: [
              { id: 70, isim: "Verilen Siparişler" },
              { id: 71, isim: "Mal Kabul İrsaliyeleri" },
              { id: 72, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 23,
            isim: "Depo Dağıtım Mal Kabulleri",
            gorevler: [
              { id: 75, isim: "Verilen Depo Siparişleri" },
              { id: 76, isim: "Mal Kabul İrsaliyeleri" }
            ]
          },
          {
            id: 25,
            isim: "Depolar Arası Mal Kabuller",
            gorevler: [
              { id: 79, isim: "Verilen Depo Siparişleri" },
              { id: 80, isim: "Mal Kabul İrsaliyeleri" }
            ]
          }
        ]
      },
      {
        id: 6,
        isim: "Kasa İşlemleri",
        altMenuler: [ {
          id: 100,
          isim: "Dosya Gönderimi",
          gorevler: [
            { id: 101, isim: "Dosya Yükle" }
          ]
        },
        {
          id: 102,
          isim: "Etiket Basımı",
          gorevler: [
            { id: 103, isim: "Etiket Yazdır" }
          ]
        },
        {
          id: 104,
          isim: "İcmal İşlemleri",
          gorevler: [
            { id: 105, isim: "İcmal Dökümü" },
            { id: 106, isim: "İcmal Ekle" }
          ]
        },
        {
          id: 107,
          isim: "Künye Etiket Basımı",
          gorevler: [
            { id: 108, isim: "Künye Etiket Yazdır" }
          ]
        },
        {
          id: 109,
          isim: "Mağaza Gider İşlemleri",
          gorevler: [
            { id: 110, isim: "Mağaza Gider Fişi" }
          ]
        },
        {
          id: 111,
          isim: "Kasa Hareketleri",
          gorevler: [
            { id: 112, isim: "Günlük Kasa Raporu" }
          ]
        }]
      }
      // Diğer menüler de aynı formatta eklenebilir
    ]
  }
];

getNewMenu(): User[] {
  return this.newmenu;
}

updateMenu2(data: User): User {

  // Orijinali bozmamak istersen:
  const cloned = structuredClone(data);

  cloned.menuler.forEach(m => {

    if (m.id === 6 && m.isim === "Kasa İşlemleri") {

      m.altMenuler = [
        {
          id: 100,
          isim: "Dosya Gönderimi",
          gorevler: [
            { id: 101, isim: "Dosya Yükle" }
          ]
        },
        {
          id: 102,
          isim: "Etiket Basımı",
          gorevler: [
            { id: 103, isim: "Etiket Yazdır" }
          ]
        },
        {
          id: 104,
          isim: "İcmal İşlemleri",
          gorevler: [
            { id: 105, isim: "İcmal Dökümü" },
            { id: 106, isim: "İcmal Ekle" }
          ]
        },
        {
          id: 107,
          isim: "Künye Etiket Basımı",
          gorevler: [
            { id: 108, isim: "Künye Etiket Yazdır" }
          ]
        },
        {
          id: 109,
          isim: "Mağaza Gider İşlemleri",
          gorevler: [
            { id: 110, isim: "Mağaza Gider Fişi" }
          ]
        },
        {
          id: 111,
          isim: "Kasa Hareketleri",
          gorevler: [
            { id: 112, isim: "Günlük Kasa Raporu" }
          ]
        }
      ];
    }

  });

  return cloned;
}





}