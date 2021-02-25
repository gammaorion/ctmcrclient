import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../models/session.model';

const baseUrl = 'http://localhost:8092/api/sessions';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  getByTournament(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/bytournament/${id}`);
  }

  getByPlayer(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/byplayer/${id}`);
  }

  getOne(id: any): Observable<Session> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
};
