import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokeball } from '../models/Pokeball';
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
}
