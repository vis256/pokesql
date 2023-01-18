import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Attack } from '../models/Attack';

@Injectable({
  providedIn: 'root'
})
export class AttackService {
  constructor(
    private http : HttpClient,
    private token : TokenService
  ) { }

  public getAttacksForPokedex(pokedex_num : number) : Observable<Attack[]> {
    return this.http.get(`/api/`) as Observable<Attack[]>;
  }

  public addAttack(attack : Attack) {
    return this.http.post(``, attack, {headers : this.token.AuthHeaders});
  }

  public addAttackToPokedex() {
    return this.http.post(``, {})
  }

  public getAttacksForPokemon(pokemon_id : number) : Observable<Attack[]> {
    return this.http.get(``) as Observable<Attack[]>;
  }

  public getAllAttacks() : Observable<Attack[]> {
    return this.http.get('') as Observable<Attack[]>;
  }

  // public addAttacksToPokemon(attack)

  public getAttackByName(attackName : string) : Observable<Attack> {
    return this.http.get('') as Observable<Attack>;
  }
}
