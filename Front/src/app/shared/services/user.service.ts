import { Injectable } from '@angular/core';

export interface User {
  name : string;
  isProfessor : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  public user? : User = {name : 'Not loaded', isProfessor : false};

  public setUserData(name : string, isProfessor : boolean) {
    this.user = { name, isProfessor};
  }

  public isProfessor() {
    return this.user!.isProfessor;
  }
}
