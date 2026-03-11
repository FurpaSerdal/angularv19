import { Injectable } from "@angular/core";
import { BaseApiService } from "../shared/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StoreExpenseReceiptService extends BaseApiService{

    listReceipts(taskId: number, schedule: string):Observable<any[]> {
        return this.get(`liste/${taskId}/${schedule}`);
    }

    createReceipt(taskId: number, payload: any): Observable<any> {
        return this.post(`ekle/${taskId}`, payload);
    }



}