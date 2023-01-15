import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/UserInfo';

export interface User {
  name : string;
  login : string;
  isProfessor : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http : HttpClient
  ) { }

  public user? : User = {
    name : 'Not loaded',
    login: 'Not loaded',
    isProfessor : true
  };

  public isProfessor() {
    return this.user!.isProfessor;
  }

  public getUserData(login : string) : Observable<UserInfo> {
    return this.http.get(`/api/users/${login}`) as Observable<UserInfo>;
  }

  public getAllUsers() : Observable<UserInfo[]> {
    return this.http.get('/api/users') as Observable<UserInfo[]>;
  }
}
