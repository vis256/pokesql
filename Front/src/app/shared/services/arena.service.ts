import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Arena } from '../models/Arena';
import { ArenaMember } from '../models/ArenaMember';
import { ArenaRegion } from '../models/ArenaRegion';
import { Region } from '../models/Region';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ArenaService {
  constructor(
    private http : HttpClient,
    private token : TokenService,
    private user : UserService
  ) { }

  public getAllArenas() : Observable<Arena[]> {
    return this.http.get('/api/arenas') as Observable<Arena[]>
  }

  public addNewArena( ar : ArenaRegion ) {
    return this.http.post('/api/arenas/new', ar, {headers : this.token.AuthHeaders});
  }

  public getArenaMember( id : number ) : Observable<ArenaMember> {
    return this.http.get(`/api/arena_members/${id}`) as Observable<ArenaMember>;
  }

  public getMemberships() : Observable<ArenaMember[]> {
    return this.http.get(`/api/users/${this.user.user?.login}/memberships`) as Observable<ArenaMember[]>;
  }

  public getArenaMembers(arena : string) : Observable<ArenaMember[]> {
    return this.http.get(`/api/arenas/${arena}/members`) as Observable<ArenaMember[]>;
  }

  public getArenaRegion(arena : string) : Observable<Region> {
    return this.http.get(`/api/arenas/${arena}/region`) as Observable<Region>;
  }

  public getRegionData( name : string ) : Observable<Region> {
    return this.http.get(`/api/regions/${name}`) as Observable<Region>
  }

  public getAllRegions() : Observable<Region[]> {
    return this.http.get('/api/regions') as Observable<Region[]>;
  }

  public joinArena(arena : string) {
    const ad : ArenaMember = {
      usr: this.user.user?.login,
      arena
    }
    return this.http.post(`/api/users/${this.user.user.login}/memberships/new`, ad, {headers: this.token.AuthHeaders});
  }
}
