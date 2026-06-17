import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  ComparisonResult,
  MatchDetail,
  MatchView,
  TeamProfile,
  TeamProfileView,
} from './models';

/** Cliente HTTP tipado contra la API @rtm/api. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  listTeams(): Observable<TeamProfile[]> {
    return this.http.get<TeamProfile[]>(`${this.base}/teams`);
  }

  getTeam(id: string): Observable<TeamProfileView> {
    return this.http.get<TeamProfileView>(`${this.base}/teams/${id}`);
  }

  upcomingMatches(limit = 10): Observable<MatchView[]> {
    return this.http.get<MatchView[]>(`${this.base}/matches/upcoming`, { params: { limit } });
  }

  finishedMatches(limit = 10): Observable<MatchView[]> {
    return this.http.get<MatchView[]>(`${this.base}/matches/finished`, { params: { limit } });
  }

  matchDetail(id: string): Observable<MatchDetail> {
    return this.http.get<MatchDetail>(`${this.base}/matches/${id}`);
  }

  compare(home: string, away: string): Observable<ComparisonResult> {
    return this.http.get<ComparisonResult>(`${this.base}/analysis/compare`, {
      params: { home, away },
    });
  }
}
