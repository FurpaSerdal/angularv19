import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { API_PATHS } from '../shared/api-paths';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShipmentNotesService extends BaseApiService {

  // firmalara sevk işlemleri
  getCompanyShipments(taskId: number, schedule: string):Observable<any> {
    return this.get(`${API_PATHS.SHIPMENTS}/${taskId}/firmalara/sevkler/${schedule}`);
  }
  createCompanyShipment(taskId: number, payload: any):Observable<any> {
    return this.post(`${API_PATHS.SHIPMENTS}/${taskId}/firmalara/sevket`, payload);
  }

    detailsCompanyShipment(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`${API_PATHS.SHIPMENTS}/${taskId}/firmalara/sevk/${seri}/${sira}`);
  }

  
  // subelere sevk işlemleri
  getBranchShipments(taskId: number, schedule: string):Observable<any> {
    return this.get(`${API_PATHS.SHIPMENTS}/${taskId}/subelere/sevkler/${schedule}`);
  }

  detailsBranchShipment(taskId: number, seri: string, sira: number):Observable<any> {
    return this.get(`${API_PATHS.SHIPMENTS}/${taskId}/subelere/sevk/${seri}/${sira}`);
  }


  createBranchShipment(taskId: number, payload: any):Observable<any> {
    return this.post(`${API_PATHS.SHIPMENTS}/${taskId}/subelere/sevket`, payload);
  }
}
