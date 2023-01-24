import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/Pokemon';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(
    private http : HttpClient,
    private user : UserService,
    private token : TokenService
  ) { }

  public getMyPokemon() : Observable<Pokemon[]> {
    return this.http.get('/api/pokemons/' + this.user.user?.login) as Observable<Pokemon[]>;
  }

  public addNewPokemon(pokemon : Pokemon) : Observable<object> {
    return this.http.post(`/api/pokemons/${this.user.user?.login}/new`, pokemon, {headers: this.token.AuthHeaders});
  }

  public getUserPokemon(login : string) : Observable<Pokemon[]> {
    return this.http.get(`/api/pokemons/${login}`) as Observable<Pokemon[]>;
  }

  public getPokemonData(pokemon_id : number) : Observable<Pokemon> {
    return this.http.get(`/api/pokemon/${pokemon_id}`) as Observable<Pokemon>;
  }

  public updatePokemon(pokemon : Pokemon) {
    return this.http.post(`/api/pokemons/${pokemon.id}/update`, pokemon, {headers : this.token.AuthHeaders});
  }
}
