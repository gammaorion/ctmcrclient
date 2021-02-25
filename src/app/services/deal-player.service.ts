import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DealPlayer } from '../models/deal-player.model';

const baseUrl = 'http://localhost:8092/api/dealplayers';

@Injectable({
  providedIn: 'root'
})
export class DealPlayerService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  getByDeal(dealId: any): Observable<any> {
    return this.http.get(`${baseUrl}/bydeal/${dealId}`);
  }

  getOne(dealId: any, playerId: any): Observable<any> {
    return this.http.get(`${baseUrl}/${dealId}/${playerId}`);
  }

  update(dealId: any, playerId: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${dealId}/${playerId}`, data);
  }

  delete(dealId: any, playerId: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${dealId}/${playerId}`);
  }
}
