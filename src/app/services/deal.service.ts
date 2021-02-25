import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deal } from '../models/deal.model';

const baseUrl = 'http://localhost:8092/api/deals';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  getBySession(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/bysession/${id}`);
  }

  getFullBySession(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/fullbysession/${id}`);
  }

  getOne(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
};
