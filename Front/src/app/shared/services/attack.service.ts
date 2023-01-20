import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Attack } from '../models/Attack';
import { UserService } from './user.service';
import { Pokedex } from '../models/Pokedex';

@Injectable({
  providedIn: 'root'
})
export class AttackService {
  constructor(
    private http : HttpClient,
    private token : TokenService,
    private user : UserService
  ) { }

  public getAttacksForPokedex(pokedex_num : number) : Observable<Attack[]> {
    return this.http.get(`/api/pokedex/${pokedex_num}/attacks`) as Observable<Attack[]>;
  }

  public addNewAttack(attack : Attack) {
    return this.http.post(`/api/attack/new`, attack, {headers : this.token.AuthHeaders});
  }

  public addAttackToPokedex(AttackPokedex : {attack : string, pokedex_num : number}) {
    return this.http.post(`/api/pokedex/attacks/new`, AttackPokedex, {headers: this.token.AuthHeaders});
  }

  public getAttacksForPokemon(pokemon_id : number) : Observable<Attack[]> {
    return this.http.get(`/api/pokemons/${pokemon_id}/attacks`) as Observable<Attack[]>;
  }

  public getAllAttacks() : Observable<Attack[]> {
    return this.http.get('/api/attacks') as Observable<Attack[]>;
  }

  public addAttacksToPokemon(PokemonAttack : {pokemon_id : number, attack : string}) {
    return this.http.post(`/api/pokemons/${this.user.user.login}/attacks/new`, PokemonAttack, {headers : this.token.AuthHeaders});
  }

  public getAttackByName(attackName : string) : Observable<Attack> {
    return this.http.get(`/api/attacks/${attackName}`) as Observable<Attack>;
  }

  public getAllPokedexesWithAttack(attackName : string) : Observable<Pokedex[]> {
    return this.http.get(`/api/attacks/pokedex/${attackName}`) as Observable<Pokedex[]>;
  }

  public deleteAttack(attackName : string) {
    return this.http.get(`/api/attack/${attackName}/delete`);
  }

  public updateAttack() {
    // FIXME: Implement this
  }
}
