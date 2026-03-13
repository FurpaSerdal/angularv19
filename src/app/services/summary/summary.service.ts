import { Injectable } from "@angular/core";
import { BaseApiService } from "../shared/base-api.service";
import { BanknoteMovementsCT, Cashier, CashRegisterDetails, GiftCheckMovementsCT, SummariesCT, SummariesDetailsCT } from "../../models/eskiAngular";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SummaryService extends BaseApiService {
// IcmalDokumComponent'ten gelen talepleri karşılamak için gerekli API çağrılarını burada tanımlayabilirsiniz.
    GetSummaries(taskid: number, dateToGet: string):Observable<SummariesCT[]> {
        return this.http.get<SummariesCT[]>(this.apiUrl  + "/icmal/"+ taskid + "/icmaller/"+ dateToGet);
    }


         // detay ıcın gerekli API çağrıları
          GetSummariesDetails(id:number, documentSerie:string, documentOrderNo:number){
             return this.http.get<SummariesDetailsCT[]>(
               `${this.apiUrl}/Icmal/${id}/icmal-detaylari/${documentSerie}/${documentOrderNo}`,
              );
           }
           GetBanknoteMovementDetails(id:number, documentSerie:string, documentOrderNo:number){
             return this.http.get<BanknoteMovementsCT[]>(
               `${this.apiUrl}/Icmal/${id}/nakit-hareket-detayi/${documentSerie}/${documentOrderNo}`,
               );
           }
           GetGiftCheckMovemntDetails(id:number, documentSerie:string, documentOrderNo:number){
             return this.http.get<GiftCheckMovementsCT[]>(
               `${this.apiUrl}/Icmal/${id}/hediye-ceki-hareket-detaylari/${documentSerie}/${documentOrderNo}`,
               );
           }
           GetCashierAndManager(id:number, cashierCode:number, managerCode:number){
             return this.http.get<Cashier[]>(
               `${this.apiUrl}/Icmal/${id}/kasiyer-ve-mudur/${cashierCode}/${managerCode}`,
             );
           }
   //GetCashRegisteryDetails
      GetCashRegisteryDetails(id:number, cashNo:number){
        return this.http.get<CashRegisterDetails>(
          `${this.apiUrl}/Icmal/${id}/kasa-kayit-detayi/${cashNo}`,
          );
      }

        GetZReportTotalValue(id:number, documentSerie:string,warehouseNo:number,zNo:number,cashNo:number): Observable<number>{
        return this.http.get<number>(`${this.apiUrl}/Icmal/${id}/z-raporu-toplam-deger/${documentSerie}/${warehouseNo}/${zNo}/${cashNo}`);
      }

      GetBranchDetail(subeNo:number): Observable<unknown>{
        return this.http.get<unknown>(`${this.apiUrl}/Subeler/ayrinti/${subeNo}`);
      }
      

}