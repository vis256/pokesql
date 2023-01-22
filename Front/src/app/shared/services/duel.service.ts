import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArenaMember } from '../models/ArenaMember';
import { Duel, MyDuel } from '../models/Duel';
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

  public getMyDuels(am : ArenaMember)  {
    return this.http.get(`/api/users/${am.id!}/duels`).pipe(
      map((data : any) => {
        const duels = data as Duel[];
        let newData : any[] = [];

        const myId = am.id;

        for (const duel of duels) {
          let dd : MyDuel = {
            id: duel.id,
            duel_date: duel.duel_date,
            won: false,
            opponent_id: 0,
            opponent_pokemon_id: 0,
            my_pokemon_id: 0,
            arena: duel.arena
          }
          if (duel.user1 == myId) {
            dd.opponent_id = duel.user2;
            dd.opponent_pokemon_id = duel.pokemon2;
            dd.my_pokemon_id = duel.pokemon1;
            if (duel.winner) {
              dd.won = true;
            } else {
              dd.won = false;
            }
          } else if (duel.user2 == myId) {
            dd.opponent_id = duel.user1;
            dd.opponent_pokemon_id = duel.pokemon1;
            dd.my_pokemon_id = duel.pokemon2;
            if (duel.winner) {
              dd.won = false;
            } else {
              dd.won = true;
            }
          } else {
            console.error("something gone wrong idk")
          }

          console.log("DD", dd);
          
          newData.push(dd);
        }
        return newData;
      })
    )
  }

  public getPokemonDuels(pokemon_id : number) : Observable<Duel[]> {
    return this.http.get(`/api/pokemons/${pokemon_id}/duels`) as Observable<Duel[]>;
  }
}
