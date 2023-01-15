import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {fromEvent, map, Observable} from 'rxjs';
import {Pokedex} from "../models/Pokedex";
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  constructor(
    private http : HttpClient,
    private token : TokenService
  ) { }

  public getPokedexList() : Observable<Pokedex[]> {
    return this.http.get('/api/pokedex') as Observable<Pokedex[]>
  }

  public getPokedexEntry(id : number) : Observable<Pokedex> {
    return this.http.get(`/api/pokedex/${id}`) as Observable<Pokedex>;
  }

  public addNewPokedexEntry( newPokedexEntry : Pokedex ) {
    return this.http.post(`/api/pokedex/new`, newPokedexEntry, {headers : this.token.AuthHeaders})
  }
}
