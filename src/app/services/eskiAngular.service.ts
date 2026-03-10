import { HttpClient,HttpHeaders,HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environment";
import { BanknoteMovements,BanknoteMovementsCT,BanknoteTrack,BanknoteTrackCT,Cashier,CashRegisterDetails,CashRegistryDetail,GiftCheckMovements,GiftCheckMovementsCT,PaymentTypes,SummariesCT,SummariesDetailsCT,SummariesReportCT,SummaryForAdd } from "../models/eskiAngular";
import { MeService } from "./meservice.service";

@Injectable({
  providedIn: 'root'
})

export class  EskiAngularService {
      private apiPath = environment.eskipath;
      private warehouseNo:number = 0;
 
 
    constructor(private http: HttpClient ,private meservice:MeService)
    { 
            this.warehouseNo = Number(this.meservice.getUserSignal()()?.subeNo) || 0;
            
    }

 private getHeaders(): HttpHeaders {
    const token = this.meservice.getUserSignal()()?.eskiApiLogin || '';
    console.log('Kullanıcı tokenı:', token); // Token'ı konsola yazdırarak kontrol edin

    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
  }
   GetCashRegistryDetails():Observable<CashRegistryDetail[]>{
        return this.http.get<CashRegistryDetail[]>(this.apiPath+"Summaries/GetCashRegistries?branchNo=" +this.warehouseNo,{
          headers:this.getHeaders()
        });
      }
      GetCashRegistryDetailByWarehouse(warehouseNo?:number):Observable<CashRegistryDetail[]>{
        return this.http.get<CashRegistryDetail[]>(this.apiPath+"Summaries/GetCashRegistries?branchNo=" +(warehouseNo || this.warehouseNo),{
          headers:this.getHeaders() 
        });
      }
      GetCashRegisterDetail(cashNo:number):Observable<CashRegisterDetails>{
        return this.http.get<CashRegisterDetails>(this.apiPath+"Summaries/GetCashRegisterDetail?cashNo=" +cashNo,{
          headers:this.getHeaders()
        });
      }
      GetCashier(filterString:string):Observable<Cashier[]>{
        return this.http.get<Cashier[]>(this.apiPath+"Summaries/GetCashiersByFilter?filterString=" +filterString,{
          headers:this.getHeaders()
        });
      }
      GetPaymentTypesByBanks(cashRegisterNo:string):Observable<PaymentTypes[]>{
        return this.http.get<PaymentTypes[]>(this.apiPath+"Summaries/GetPaymentTypesByBanks?cashRegisterNo=" + cashRegisterNo,{
          headers:this.getHeaders()
        });
      }
      GetPaymentTypesByFoodChecks():Observable<PaymentTypes[]>{
        return this.http.get<PaymentTypes[]>(this.apiPath+"Summaries/GetPaymentTypesByFoodChecks",{
          headers:this.getHeaders()
        });
      }
      GetPaymentTypesByOnlineSales():Observable<PaymentTypes[]>{
        return this.http.get<PaymentTypes[]>(this.apiPath+"Summaries/GetPaymentTypesByOnlineSales",{
          headers:this.getHeaders()
        });
      }
      GetPaymentTypesByStoreExpenses():Observable<PaymentTypes[]>{
        return this.http.get<PaymentTypes[]>(this.apiPath+"Summaries/GetPaymentTypesByStoreExpenses",{
          headers:this.getHeaders()
        });
      }
      GetPaymentTypesByExpenseCompass():Observable<PaymentTypes[]>{
        return this.http.get<PaymentTypes[]>(this.apiPath+"Summaries/GetPaymentTypesByExpenseCompass",{
          headers:this.getHeaders()
        });
      }
      GetGiftCheckTypes():Observable<GiftCheckMovements[]>{
        return this.http.get<GiftCheckMovements[]>(this.apiPath+"Summaries/GetGiftCheckTypes",{
          headers:this.getHeaders()
        });
      }
      GetBanknoteTypes():Observable<BanknoteMovements[]>{
        return this.http.get<BanknoteMovements[]>(this.apiPath+"Summaries/GetBanknoteTypes",{
          headers:this.getHeaders()
        });
      }
      GetZReportTotalValue(documentSerie:string,warehouseNo:number,zNo:number,cashNo:number): Observable<HttpResponse<number>>{
        return this.http.get<number>(this.apiPath+"Summaries/GetZReportTotalValue?documentSerie="+documentSerie
        + "&warehouseNo=" + warehouseNo
        + "&zNo=" + zNo
        + "&cashNo=" + cashNo,{
          headers:this.getHeaders(),
          observe:"response"
        });
      }
      GetTotalAmountForBanknoteTrack(dateToGet:string):Observable<number>{
        return this.http.get<number>(this.apiPath+"Summaries/GetTotalAmountForBanknoteTrack?dateToGet=" + dateToGet,
        {
          headers:this.getHeaders()
        });
      } 
      AddSummary(summaries:SummaryForAdd[]) {
        console.log(summaries);
        this.http
          .post(this.apiPath + "Summaries/AddSummary",summaries,
            {
             headers: this.getHeaders(),
             responseType: "text",
             observe:"response"
            })
            .subscribe(response => {
              if(response.status == 201)
                 Swal.fire({
                  title: response.body + " İcmal Başarıyla Kaydedildi.",
                  icon:"success"})
              else
                 Swal.fire({
                  title: "İcmal Kaydedilirken Hata Oluştu.",
                  icon:"error"});
            });
      }
      AddBanknoteTrack(banknoteTrack : BanknoteTrack){
        this.http 
          .post(this.apiPath + "Summaries/AddBanknoteTrack", banknoteTrack,
          {
            headers: this.getHeaders(),
            responseType: "text",
            observe:"response"
          })
          .subscribe(response => {
            if(response.status == 201){
                Swal.fire({
                  title: response.body + " Tarihli Nakit Takip Formu Eklendi.",
                  icon:"success",
                  position:"center",
                  confirmButtonText:"Tamam",
                  showConfirmButton:true,
                  focusConfirm:true,
                  allowEnterKey:false,
                  allowOutsideClick:false,
                  heightAuto:true,
                });
            }
            else if(response.status == 200){
              Swal.fire({
                title: "Seçilen Tarihte Kaydedilen\nNakit Takip Formu\nZaten Var.",
                icon:"error",
                position:"center",
                confirmButtonText:"Tamam",
                showConfirmButton:true,
                focusConfirm:true,
                allowEnterKey:false,
                allowOutsideClick:false,
                heightAuto:true,
              });
            }
          });
      }
      GetBanknoteTracks(dateToGet:string){
        return this.http.get<BanknoteTrackCT[]>(this.apiPath+"Summaries/GetBanknoteTracks?dateToGet=" + dateToGet,
        {
          headers:this.getHeaders()
        });
      }
      GetSummariesReport(dateToGet:string){
        return this.http.get<SummariesReportCT[]>(this.apiPath+"Summaries/GetSummariesReport?dateToGet=" + dateToGet,
        {
          headers:this.getHeaders()
        });
      }
      GetSummaries(dateToGet:string){
        return this.http.get<SummariesCT[]>(this.apiPath+"Summaries/GetSummaries?dateToGet=" + dateToGet,
        {
          headers:this.getHeaders()
        });
      }
      GetSummariesDetails(documentSerie:string, documentOrderNo:number){
        return this.http.get<SummariesDetailsCT[]>(
          this.apiPath +
          "Summaries/GetSummariesDetails?documentSerie=" +
            documentSerie +
            "&documentOrderNo=" +
            documentOrderNo,
            {
              headers:this.getHeaders()
            });
      }
      GetBanknoteMovementDetails(documentSerie:string, documentOrderNo:number){
        return this.http.get<BanknoteMovementsCT[]>(
          this.apiPath +
          "Summaries/GetBanknoteMovementDetails?documentSerie=" +
            documentSerie +
            "&documentOrderNo=" +
            documentOrderNo,
            {
              headers:this.getHeaders()
            });
      }
      GetGiftCheckMovemntDetails(documentSerie:string, documentOrderNo:number){
        return this.http.get<GiftCheckMovementsCT[]>(
          this.apiPath +
          "Summaries/GetGiftCheckMovementDetails?documentSerie=" +
            documentSerie +
            "&documentOrderNo=" +
            documentOrderNo,
            {
              headers:this.getHeaders()
            });
      }
      GetCashierAndManager(cashierCode:number, managerCode:number){
        return this.http.get<Cashier[]>(
          this.apiPath +
          "Summaries/GetCashierAndManager?cashierCode=" +
            cashierCode +
            "&managerCode=" +
            managerCode,
            {
              headers:this.getHeaders()
            });
      }
      // UpdateBanknoteMovements(banknoteMovementsForUpdate:banknoteMovementsForUpdate){
      //   this.http.post(
      //     this.apiPath +
      //     "Summaries/UpdateBanknoteMovements",banknoteMovementsForUpdate,
      //       {
      //         headers:this.httpHeaders,
      //         responseType:"text",
      //         observe:"response"
      //       }).subscribe(response => {
      //         if(response.status == 201){
      //           Swal.fire({
      //             title: response.body+" Başarılı Güncellendi.",
      //             text:"Banknot Hareketleri",
      //             type:"success",
      //             position:"center",
      //             confirmButtonText:"Tamam",
      //             showConfirmButton:true,
      //             focusConfirm:true,
      //             allowEnterKey:false,
      //             allowOutsideClick:false,
      //             heightAuto:true
      //           });
      //         }
      //         else if(response.status == 200){
      //           Swal.fire({
      //             title: response.body+" Güncellenirken Hata Oluştu.",
      //             type:"error",
      //             position:"center",
      //             confirmButtonText:"Tamam",
      //             showConfirmButton:true,
      //             focusConfirm:true,
      //             allowEnterKey:false,
      //             allowOutsideClick:false,
      //             heightAuto:true
      //           });
      //         }
      //       });
      // }

      // UpdateSummaryDetails(summaryDetailsForUpdate:summaryDetailsForUpdate){
      //    this.http.post(
      //     this.apiPath +
      //     "Summaries/UpdateSummaryDetails",summaryDetailsForUpdate,
      //       {
      //         headers:this.httpHeaders,
      //         responseType:"text",
      //         observe:"response"
      //       }).subscribe(response => {
      //         if(response.status == 201){
      //           Swal.fire({
      //             title: response.body+" Başarılı Güncellendi.",
      //             text:"İcmal Detayları",
      //             type:"success",
      //             position:"center",
      //             confirmButtonText:"Tamam",
      //             showConfirmButton:true,
      //             focusConfirm:true,
      //             allowEnterKey:false,
      //             allowOutsideClick:false,
      //             heightAuto:true
      //           });
      //         }
      //         else if(response.status == 200){
      //           Swal.fire({
      //             title: response.body+" Güncellenirken Hata Oluştu.",
      //             type:"error",
      //             position:"center",
      //             confirmButtonText:"Tamam",
      //             showConfirmButton:true,
      //             focusConfirm:true,
      //             allowEnterKey:false,
      //             allowOutsideClick:false,
      //             heightAuto:true
      //           });
      //         }
      //       });
      // }
      
      DeleteSummary(summary:SummariesCT) {
       return this.http.post(this.apiPath + "Summaries/DeleteSummary", summary,
        {
          headers:this.getHeaders(),
          responseType:"text",
          observe:"response"
        });
      }
      //GetCashRegisteryDetails
      GetCashRegisteryDetails(){
        return this.http.get<CashRegisterDetails[]>(
          this.apiPath +
          "Summaries/GetCashRegisteryDetails",
            {
              headers:this.getHeaders()
            });
      }

}