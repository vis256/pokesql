import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http : HttpClient
  ) { }

  public user : UserInfo = {
    login: '',
    username: '',
    is_professor: false
  };

  public isProfessor() {
    return this.user!.is_professor;
  }

  public loadCurrentUserData(login : string, callback : Function) : void {
    this.http.get(`api/users/${login}`).subscribe((data : any) => {
      this.user = data;
      callback();
    })
  }

  public getUserData(login : string) : Observable<UserInfo> {
    return this.http.get(`/api/users/${login}`) as Observable<UserInfo>;
  }

  public getAllUsers() : Observable<UserInfo[]> {
    return this.http.get('/api/users') as Observable<UserInfo[]>;
  }
}
