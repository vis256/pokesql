import { Injectable } from '@angular/core';

export interface User {
  name : string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  public user? : User;

  public setUserData(name : string) {
    this.user = { name, };
  }
}
