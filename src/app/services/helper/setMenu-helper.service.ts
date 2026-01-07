import { inject } from "@angular/core";
import { Menu, User } from "../../models/user";

export class SetMenuHelperService {

newmenu: User[] = [
  {
    isim: "Serdal",
    soyIsim: "Özsoy",
    depoNo: 109,
    depoIsmi: "Çamlıca",
    menuler: [
      {
        id: 1,
        isim: "Sevk İşlemleri",
        altMenuler: [
          {
            id: 1,
            isim: "Toptan Faturalı Sevkler",
            evrakMenuleri: [
              { kimlik: 37, isim: "Alınan Siparişler" },
              { kimlik: 38, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 2,
            isim: "Perakende Faturalı Sevkler",
            evrakMenuleri: [
              { kimlik: 39, isim: "Alınan Siparişler" },
              { kimlik: 40, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 3,
            isim: "Değer Farkı Faturalı Sevkler",
            evrakMenuleri: [
              { kimlik: 41, isim: "Alınan Siparişler" },
              { kimlik: 42, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 19,
            isim: "Toptan Sevkler",
            evrakMenuleri: [
              { kimlik: 64, isim: "Alınan Siparişler" },
              { kimlik: 65, isim: "Sevk İrsaliyeleri" },
              { kimlik: 66, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 20,
            isim: "Perakende Sevkler",
            evrakMenuleri: [
              { kimlik: 67, isim: "Alınan Siparişler" },
              { kimlik: 68, isim: "Sevk İrsaliyeleri" },
              { kimlik: 69, isim: "Satış Faturaları" }
            ]
          },
          {
            id: 22,
            isim: "Depo Dağıtım Sevkleri",
            evrakMenuleri: [
              { kimlik: 73, isim: "Alınan Depo Siparişleri" },
              { kimlik: 74, isim: "Sevk İrsaliyeleri" }
            ]
          },
          {
            id: 24,
            isim: "Depolar Arası Sevkler",
            evrakMenuleri: [
              { kimlik: 77, isim: "Alınan Depo Siparişleri" },
              { kimlik: 78, isim: "Sevk İrsaliyeleri" }
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
            evrakMenuleri: [
              { kimlik: 43, isim: "Verilen Siparişler" },
              { kimlik: 44, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 5,
            isim: "Perakende Faturalı Mal Kabuller",
            evrakMenuleri: [
              { kimlik: 45, isim: "Verilen Siparişler" },
              { kimlik: 46, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 6,
            isim: "Değer Farkı Faturalı Mal Kabuller",
            evrakMenuleri: [
              { kimlik: 47, isim: "Verilen Siparişler" },
              { kimlik: 48, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 7,
            isim: "Halden Alış Faturalı Mal Kabuller",
            evrakMenuleri: [
              { kimlik: 49, isim: "Verilen Siparişler" },
              { kimlik: 50, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 21,
            isim: "Toptan Mal Kabuller",
            evrakMenuleri: [
              { kimlik: 70, isim: "Verilen Siparişler" },
              { kimlik: 71, isim: "Mal Kabul İrsaliyeleri" },
              { kimlik: 72, isim: "Alış Faturaları" }
            ]
          },
          {
            id: 23,
            isim: "Depo Dağıtım Mal Kabulleri",
            evrakMenuleri: [
              { kimlik: 75, isim: "Verilen Depo Siparişleri" },
              { kimlik: 76, isim: "Mal Kabul İrsaliyeleri" }
            ]
          },
          {
            id: 25,
            isim: "Depolar Arası Mal Kabuller",
            evrakMenuleri: [
              { kimlik: 79, isim: "Verilen Depo Siparişleri" },
              { kimlik: 80, isim: "Mal Kabul İrsaliyeleri" }
            ]
          }
        ]
      }
      // Diğer menüler de aynı formatta eklenebilir
    ]
  }
];

getNewMenu(): User[] {
  return this.newmenu;
}
}