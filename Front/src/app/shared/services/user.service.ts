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
  ) {
    const ud = window.localStorage.getItem("POKESQL_USERDATA");
    if (ud !== null) {
      this.user = JSON.parse(ud);
    }
  }

  public user : UserInfo = {
    login: 'Not loaded',
    username: 'Not loaded',
    is_professor: false
  };

  public isProfessor() {
    return this.user!.is_professor;
  }

  public loadCurrentUserData(login : string, callback : Function) : void {
    this.http.get(`api/users/${login}`).subscribe((data : any) => {
      this.user = data;
      this.user.login = login;
      window.localStorage.setItem("POKESQL_USERDATA", JSON.stringify(this.user));
      console.log("XD", this.user);
      
      callback();
    })
  }

  public getUserData(login : string) : Observable<UserInfo> {
    return this.http.get(`api/users/${login}`) as Observable<UserInfo>;
  }

  public getAllUsers() : Observable<UserInfo[]> {
    return this.http.get('api/users') as Observable<UserInfo[]>;
  }
}
