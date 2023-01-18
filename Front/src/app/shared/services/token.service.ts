import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const STORAGE_KEY = 'POKESQL_JWT'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {

  }

  get isLoggedIn() {
  	return this.getToken() !== null;
  }

  public get AuthHeaders() : HttpHeaders {
    const t = this.getToken();
    if (t == null) return new HttpHeaders();

    return new HttpHeaders({
      'Authorization': t
    });
  }

  public getToken() {
  	return window.localStorage.getItem(STORAGE_KEY);
  }

  public setToken( token : string ) {
	  window.localStorage.setItem(STORAGE_KEY, token);
    this.AuthHeaders.set('Authorization', token);
  }

  public removeToken() {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
