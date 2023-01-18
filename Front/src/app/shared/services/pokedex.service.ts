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

  public addNewPokedexEntry( newPokedexEntry : any ) {
    const d : Pokedex = {
      number: newPokedexEntry.number,
      name: newPokedexEntry.name,
      min_level: newPokedexEntry.min_level,
      region: newPokedexEntry.region.name,
      primary_type: newPokedexEntry.primary_type,
      secondary_type : newPokedexEntry.secondary_type
    }
    return this.http.post(`/api/pokedex/new`, d, {headers : this.token.AuthHeaders})
  }

  public updatePokedexEntry( pokedexEntry : Pokedex ) {
    return this.http.post(`/api/pokedex/${pokedexEntry.number}/update`, pokedexEntry, {headers : this.token.AuthHeaders});
  }
}
