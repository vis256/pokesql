import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "./token.service";
import {UserService} from "./user.service";

const defaultPath = '/';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private http : HttpClient,
    private token : TokenService,
    private user : UserService
  ) { }


  get loggedIn(): boolean {
    return this.token.isLoggedIn;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  // login
  async logIn(login: string, password: string, callback : Function) {

    try {

      // Send request
      this.http.post("api/login", {login, password}).subscribe((resp : any) => {
        console.log({if_u_see_this_maybe_this_works: resp})
        this.token.setToken(resp.token);
        this.router.navigate(['/']);

        // FIXME: get user data and set isProfessor correctly
        // and i guess fit field naming to backend too
        this.user.user = {
          name : 'Ash Ketchup',
          login,
          isProfessor : true
        }
        callback && callback({
          isOk : true,
          data : this.user.user
        });

        this.router.navigate(['/']);
      })

    }
    catch (err) {
      console.log({err});
      
      callback && callback({
        isOk : false,
        message : "Authentication failed: " + err
      })
    }
  }

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this.user.user
      };
    }
    catch {
      return {
        isOk: false,
        data: null
      };
    }
  }

  async createAccount(login: string, password: string, username : string, is_professor : boolean, callback : Function) {
    try {
      // Send request
      console.log(login, password, username, is_professor);

      this.http.post('/api/register', {login, password, username, is_professor}).subscribe((data : any) => {
        this.router.navigate(['/login']);
      })

      callback && callback({
        isOk: true
      })
    }
    catch (err) {
      console.log({err});
      
      callback && callback({
        isOk: false,
        message: "Failed to create account: " + err
      })
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request
      console.log(email, recoveryCode);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    };
  }

  async resetPassword(email: string) {
    try {
      // Send request
      console.log(email);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  async logOut() {
    this.token.removeToken();
    this.router.navigate(['/login-form']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login-form',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode'
    ].includes(route.routeConfig?.path || defaultPath);

    if (isLoggedIn && isAuthForm) {
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return false;
    }

    if (!isLoggedIn && !isAuthForm) {
      this.router.navigate(['/login-form']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;
  }
}
