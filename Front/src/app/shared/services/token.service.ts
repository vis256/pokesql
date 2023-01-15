import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const STORAGE_KEY = 'POKESQL_JWT'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {

  }

  public AuthHeaders : HttpHeaders = new HttpHeaders();

  get isLoggedIn() {
  	return this.getToken() !== null;
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
