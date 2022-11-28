import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

const STORAGE_KEY = 'POKESQL_JWT'

export class TokenService {
  constructor() { 
		
  }

  get isLoggedIn() {
  	return getToken() !== null;
  }

  public getToken() {
  	return window.localStorage.getItem(STORAGE_KEY);
  }

  public setToken( token : string ) {
	window.localStorage.setItem(STORAGE_KEY, token);
  }
}
