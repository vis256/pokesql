import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "./token.service";
import {UserService} from "./user.service";
import { catchError, throwError } from 'rxjs';
import { ErrorService } from './error.service';

const defaultPath = '/';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private http : HttpClient,
    private token : TokenService,
    private user : UserService,
    private error : ErrorService
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
    this.user.user.login = login;

    try {
      // Send request
      this.http.post("api/login", {login, password})
      .pipe(
        catchError((err : any) => {
          console.log({err});
          callback && callback({
            isOk : false,
            message: 'Złe dane logowania'
          });
          return throwError(err);
        })
      )
      .subscribe(
        (resp : any) => {
          console.log({if_u_see_this_maybe_this_works: resp})
          this.token.setToken(resp.token);
          this.user.loadCurrentUserData(login, () => {
            callback && callback({
              isOk : true,
              data : this.user.user
            });
          });
        }),
        (err : any) => {
          console.log({err});
          
          callback && callback({
            isOk : false,
            message: 'Złe dane logowania'
          });
        }
    }
    catch (err) {
      console.log({err});
      
      callback && callback({
        isOk : false,
        message : "Złe dane logowania"
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

      this.http.post('api/register', {login, password, username, is_professor}).subscribe(
        data => {
          callback && callback({
            isOk: true
          })
        },
        err => {
          console.error({err})
          this.error.displayError(err.error);

          callback && callback({
            isOk: false
          })
        }
      )


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

  async resetPassword(password: string, callback : Function) {
    try {
      // Send request
      const ud = {
        login : this.user.user.login,
        password,
        username : this.user.user.username,
        is_professor : this.user.user.is_professor
      };
      this.http.post(`api/users/${this.user.user.login}/update`, ud, {headers: this.token.AuthHeaders})
      .pipe(
        catchError((err : any) => {
          console.log({err});
          callback && callback({
            isOk : false,
            message: 'Zmiana hasła nie powiodła się'
          });
          return throwError(err);
        })
      )
      .subscribe(
        (resp : any) => {
          callback && callback({
            isOk : true
            
          });
        }),
        (err : any) => {
          console.log({err});
          
          callback && callback({
            isOk : false,
            message: 'Zmiana hasła nie powiodła się'
          });
        }
    }
    catch (err) {
      console.log({err});
      
      callback && callback({
        isOk : false,
        message : "Authentication failed: " + err
      })
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
