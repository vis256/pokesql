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


  async logIn(username: string, password: string, callback : Function) {

    try {
      console.log(username, password);

      // Send request
      this.http.post("api/login", {login : username, password}).subscribe((resp : any) => {
        console.log({if_u_see_this_maybe_this_works: resp})
        // this.token.setToken(resp.body.);
        this.router.navigate(['/']);

        this.user.setUserData("Ash Ketchup");
        callback && callback({
          isOk : true,
          data : this.user.user
        });

        this.router.navigate(['/']);
      })

    }
    catch {
        callback && callback({
          isOk : false,
          message : "Authentication failed"
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

  async createAccount(email: string, password: string) {
    try {
      // Send request
      console.log(email, password);

      this.router.navigate(['/create-account']);
      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to create account"
      };
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
