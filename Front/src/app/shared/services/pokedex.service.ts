import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  constructor(
    private http : HttpClient
  ) { }

  public getPokedexList() {
    return this.http.get('/api/pokedex')
  }

  public getPokedexEntry(number : number) {
    return this.http.get('/api/pokedex/' + number);
  }
}
