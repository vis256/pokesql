import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {fromEvent, map, Observable} from 'rxjs';
import {Pokedex} from "../models/Pokedex";

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  constructor(
    private http : HttpClient
  ) { }

  public getPokedexList() : Observable<Pokedex[]> {
    return this.http.get('/api/pokedex') as Observable<Pokedex[]>
  }

  public getPokedexEntry(number : number) : Observable<Pokedex> {
    return this.http.get('/api/pokedex/' + number) as Observable<Pokedex>;
  }
}
