import { Injectable } from '@angular/core';

export interface User {
  name : string;
  login : string;
  isProfessor : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  public user? : User = {
    name : 'Not loaded',
    login: 'Not loaded',
    isProfessor : true
  };

  public isProfessor() {
    return this.user!.isProfessor;
  }
}
