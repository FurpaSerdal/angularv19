import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseApiService } from "../shared/base-api.service";

@Injectable({
  providedIn: 'root'
})


export class VirmansTransaction extends BaseApiService {

getvirmans(taskId: number, schedule: string):Observable<any> {
  return this.get(`liste/${taskId}/${schedule}`);
}
createVirmans(taskId: number, payload: any):Observable<any> {
  return this.post(`/ekle/${taskId}`, payload);
}
detailsVirmans(taskId: number, seri: string, sira: number):Observable<any> {
  return this.get(`/ayrinti/${taskId}/${seri}/${sira}`);
}


}