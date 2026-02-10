import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';
import { EkleResponseDto } from '../../models/ekleModels';
import { DetayResponse } from '../../models/detay';

@Injectable({ providedIn: 'root' })
export class ShipmentNotesService extends BaseApiService {

  // firmalara sevk işlemleri
  getCompanyShipments(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }
  createCompanyShipment(taskId: number, payload: any):Observable<any> {
    return this.post(`ekle/${taskId}`, payload);
  }

    detailsCompanyShipment(taskId: number, seri: string, sira: number):Observable<DetayResponse> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }

  
  // subelere sevk işlemleri
  getBranchShipments(taskId: number, schedule: string):Observable<any> {
    return this.get(`liste/${taskId}/${schedule}`);
  }

  detailsBranchShipment(taskId: number, seri: string, sira: number):Observable<DetayResponse> {
    return this.get(`ayrinti/${taskId}/${seri}/${sira}`);
  }


  createBranchShipment(taskId: number, payload: any):Observable<EkleResponseDto> {
    return this.post(`ekle/${taskId}`, payload);
  }
}
