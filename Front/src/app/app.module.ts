import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import {AuthService, ScreenService, AppInfoService, UserService, TokenService} from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { NewPokedexEntryFormComponent } from './new-pokedex-entry-form/new-pokedex-entry-form.component';
import {DxFormModule} from "devextreme-angular/ui/form";
import {DxCheckBoxModule, DxNumberBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {DxButtonModule} from "devextreme-angular/ui/button";
import { PokedexListComponent } from './pokedex-list/pokedex-list.component';
import { PokedexEntryComponent } from './pokedex-entry/pokedex-entry.component';
import { OwnedPokemonListComponent } from './owned-pokemon-list/owned-pokemon-list.component';
import { OwnedPokemonEntryComponent } from './owned-pokemon-entry/owned-pokemon-entry.component';
import {DxListModule} from "devextreme-angular/ui/list";

@NgModule({
  declarations: [
    AppComponent,
    NewPokedexEntryFormComponent,
    PokedexListComponent,
    PokedexEntryComponent,
    OwnedPokemonListComponent,
    OwnedPokemonEntryComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    DxFormModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxButtonModule,
    DxListModule
  ],
  providers: [
    AuthService,
    ScreenService,
    AppInfoService,
    UserService,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
