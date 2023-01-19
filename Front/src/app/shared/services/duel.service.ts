import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArenaMember } from '../models/ArenaMember';
import { Duel } from '../models/Duel';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DuelService {
  constructor(
    private http : HttpClient,
    private token : TokenService,
    private user : UserService
  ) { }

  public getDuels(am : ArenaMember) : Observable<Duel[]> {
    return this.http.get(`/api/users/${am.id!}/duels`) as Observable<Duel[]>;
  }

  public addDuel(duel : Duel) {
    return this.http.post(`/api/duels/new`, duel, {headers : this.token.AuthHeaders});
  }

  public getMyDuels(am : ArenaMember) {
    return this.http.get(`/api/users/${am.id!}/duels`).pipe(
      map((data : any) => {
        let newData : any = [];
        for (const duel of data) {
          console.log({duel});
        }
        // TODO: Format data so we have fields like 'won' : boolean, enemyid: number, enemypokemon: number
        return newData;
      })
    )
  }
}
