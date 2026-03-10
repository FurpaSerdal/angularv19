import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environment.prod";

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
    private readonly apiUrl = environment.apiurl; // API temel URL'si

    constructor(private http: HttpClient) {
        
    }

 scaleFile(TaskId: number) {  
    return this.http.get(`${this.apiUrl}/DosyaGonder/${TaskId}/TeraziDosyasi`);
  }
  productFile(TaskId: number) {
    return this.http.get(`${this.apiUrl}/DosyaGonder/${TaskId}/UrunDosyasi`);
  }
 cashierFile(TaskId: number) {
    return this.http.get(`${this.apiUrl}/DosyaGonder/${TaskId}/KasiyerDosyasi`);
  }
  promotionFile(TaskId: number) {
    return this.http.get(`${this.apiUrl}/DosyaGonder/${TaskId}/PromosyonDosyasi`);
  }
  customerFile(TaskId: number) {
    return this.http.get(`${this.apiUrl}/DosyaGonder/${TaskId}/MusteriDosyasi`);
  }

}