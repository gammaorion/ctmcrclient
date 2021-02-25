import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TournamentPlayer } from '../models/tournament-player.model';

const baseUrl = 'http://localhost:8092/api/tournamentplayers';

@Injectable({
  providedIn: 'root'
})
export class TournamentPlayerService {
  constructor(private http: HttpClient) { }

  getForTournament(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/bytournament/${id}`);
  }

  getForPlayer(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/byplayer/${id}`);
  }

  getPlayersForTournament(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/playersfortournament/${id}`);
  }

  getOne(tournamentId: any, playerId: any): Observable<TournamentPlayer> {
    return this.http.get(`${baseUrl}/${tournamentId}/${playerId}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  bulkCreate(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/bulk`, data);
  }

  deleteForTournament(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/bytournament/${id}`);
  }

  delete(tournamentId: any, playerId: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${tournamentId}/${playerId}`);
  }
}
