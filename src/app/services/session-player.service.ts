import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionPlayer } from '../models/session-player.model';

const baseUrl = 'http://localhost:8092/api/sessionplayers';

@Injectable({
  providedIn: 'root'
})
export class SessionPlayerService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  getBySession(sessionId: any): Observable<any> {
    return this.http.get(`${baseUrl}/bysession/${sessionId}`);
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
}
