import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/Pokemon';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(
    private http : HttpClient,
    private user : UserService
  ) { }

  public getMyPokemon() : Observable<Pokemon[]> {
    return this.http.get('/api/pokemons/' + this.user.user?.login) as Observable<Pokemon[]>;
  }

  public addNewPokemon(pokemon : Pokemon) : Observable<object> {
    return this.http.post(`/api/pokemons/${this.user.user?.login}/new`, pokemon);
  }
}