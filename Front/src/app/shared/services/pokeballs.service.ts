import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokeball } from '../models/Pokeball';
import { Pokedex } from '../models/Pokedex';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PokeballsService {
  constructor(
    private http : HttpClient,
    private user : UserService,
    private token : TokenService
  ) { }

  getAllPokeballs() : Observable<Pokeball[]> {
    return this.http.get('/api/pokeballs') as Observable<Pokeball[]>
  }

  getPokeballData(pokeballName : string) : Observable<Pokeball> {
    return this.http.get(`/api/pokeballs/${pokeballName}`) as Observable<Pokeball>
  }

  addNewPokeball(newPokeball : Pokeball) : Observable<object> {
    return this.http.post('/api/pokeballs/new', newPokeball, {headers : this.token.AuthHeaders})
  }

  addPokedexPokeballEntry(pokeball : string, pokedex_num : number) {
    return this.http.post('/api/pokedex/pokeballs/new', {pokeball, pokedex_num}, {headers : this.token.AuthHeaders});
  }

  getPokeballsUsedForPokedex(pokedex_num : number) : Observable<Pokeball[]> {
    return this.http.get(`/api/pokedex/${pokedex_num}/pokeballs`) as Observable<Pokeball[]>;
  }

  getAllPokedexesUsedByPokeball(pokeball_name : string) : Observable<Pokedex[]> {
    return this.http.get(`/api/pokeballs/${pokeball_name}/pokedex`) as Observable<Pokedex[]>;
  }

  deletePokeball(pokeball_name : string) {
    return this.http.get(`/api/pokeballs/${pokeball_name}/delete`, {headers : this.token.AuthHeaders});
  }

  deletePokedexPokeball(PokedexPokeball : {pokeball : string, pokedex_num : number}) {
    return this.http.post(`/api/pokedex/pokeballs/delete`, PokedexPokeball, {headers : this.token.AuthHeaders});
  }
}
