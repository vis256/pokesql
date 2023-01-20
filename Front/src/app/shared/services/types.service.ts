import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  public getAllTypesString() : Observable<string[]> {
    return this.http.get(`/api/types`).pipe(map((data : any) => {
      let r : string[] = [];
      for (const type of data) {
        r.push(type.name);
      }
      return r;
    }));
  }

  public deleteType(type_name : string) {
    return this.http.get(`/api/types/${type_name}/delete`, {headers : this.token.AuthHeaders});
  }

  public updateType(old_type_name : string, new_type : Type) {
    return this.http.post(`/api/types/${old_type_name}/update`, new_type, {headers : this.token.AuthHeaders})
  }
}
