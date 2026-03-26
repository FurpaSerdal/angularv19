import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  protected readonly apiUrl = environment.apiurl;

  constructor(protected http: HttpClient) {}

  protected get<T>(url: string, headers?: any) {
    return this.http.get<T>(`${this.apiUrl}/${url}`, { headers });
  }

  protected post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.apiUrl}/${url}`, body);
  }
}

