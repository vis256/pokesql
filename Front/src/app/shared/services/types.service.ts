import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Counter } from '../models/Counter';
import { Type } from '../models/Type';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class TypesService {
  constructor(
    private http : HttpClient,
    private token : TokenService
  ) { }

  public getAllTypes() : Observable<Type[]> {
    return this.http.get(`/api/types`) as Observable<Type[]>;
  }

  public createNewType(newType : Type) {
    return this.http.post(`/api/types/new`, newType, {headers : this.token.AuthHeaders});
  }

  public getCountersWorse(typeName : string) : Observable<Type[]> {
    return this.http.get(`/api/counters/worse/${typeName}`) as Observable<Type[]>;
  }

  public getCountersBetter(typeName : string) : Observable<Type[]> {
    return this.http.get(`/api/counters/better/${typeName}`) as Observable<Type[]>;
  }

  public addNewCounter(newCounter : Counter) {
    return this.http.post(`/api/counters/new`, newCounter, {headers : this.token.AuthHeaders});
  }
}