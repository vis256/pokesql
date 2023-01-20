import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import {AuthService, ScreenService, AppInfoService, UserService, TokenService} from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { NewPokedexEntryFormComponent } from './new/new-pokedex-entry-form/new-pokedex-entry-form.component';
import {DxFormModule} from "devextreme-angular/ui/form";
import {
  DxCheckBoxModule,
  DxDataGridModule,
  DxNumberBoxModule, DxPopupModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextBoxModule, DxTileViewModule, DxValidationSummaryModule, DxValidatorModule
} from "devextreme-angular";
import {DxButtonModule} from "devextreme-angular/ui/button";
import { PokedexListComponent } from './pokedex-list/pokedex-list.component';
import { PokedexEntryComponent } from './pokedex-entry/pokedex-entry.component';
import { OwnedPokemonListComponent } from './owned-pokemon-list/owned-pokemon-list.component';
import { OwnedPokemonEntryComponent } from './owned-pokemon-entry/owned-pokemon-entry.component';
import {DxListModule} from "devextreme-angular/ui/list";
import {DxScrollViewModule} from "devextreme-angular/ui/scroll-view";
import { TypeLabelComponent } from './shared/components/type-label/type-label.component';
import { PokedexComponent } from './pokedex/pokedex.component';
import { TypesListComponent } from './types-list/types-list.component';
import { RegionLabelComponent } from './shared/components/region-label/region-label.component';
import { NewPokemonEntryFormComponent } from './new/new-pokemon-entry-form/new-pokemon-entry-form.component';
import { PokeballListComponent } from './pokeball-list/pokeball-list.component';
import { AttackLabelComponent } from './shared/components/attack-label/attack-label.component';
import { AttackEntryComponent } from './attack-entry/attack-entry.component';
import { AttackListComponent } from './attack-list/attack-list.component';
import { ArenaListComponent } from './arena-list/arena-list.component';
import { ArenaEntryComponent } from './arena-entry/arena-entry.component';
import { ArenaDashboardComponent } from './arena-dashboard/arena-dashboard.component';
import { FightEntryComponent } from './fight-entry/fight-entry.component';
import { SexLabelComponent } from './shared/components/sex-label/sex-label.component';
import { NewPokeballEntryFormComponent } from './new/new-pokeball-entry-form/new-pokeball-entry-form.component';
import { MyArenaListComponent } from './my-arena-list/my-arena-list.component';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';
import { NewRegionArenaFormComponent } from './new/new-region-arena-form/new-region-arena-form.component';
import { NewAttackFormComponent } from './new/new-attack-form/new-attack-form.component';
import { NewTypeFormComponent } from './new/new-type-form/new-type-form.component';
import { EditTypeFormComponent } from './edit/edit-type-form/edit-type-form.component';
import { EditPokedexEntryFormComponent } from './edit/edit-pokedex-entry-form/edit-pokedex-entry-form.component';
import { EditAttackFormComponent } from './edit/edit-attack-form/edit-attack-form.component';


@NgModule({
  declarations: [
    AppComponent,
    NewPokedexEntryFormComponent,
    PokedexListComponent,
    PokedexEntryComponent,
    OwnedPokemonListComponent,
    OwnedPokemonEntryComponent,
    TypeLabelComponent,
    PokedexComponent,
    TypesListComponent,
    RegionLabelComponent,
    NewPokemonEntryFormComponent,
    PokeballListComponent,
    TypesListComponent,
    AttackLabelComponent,
    AttackEntryComponent,
    AttackListComponent,
    ArenaListComponent,
    ArenaEntryComponent,
    ArenaDashboardComponent,
    FightEntryComponent,
    SexLabelComponent,
    NewPokeballEntryFormComponent,
    MyArenaListComponent,
    NewRegionArenaFormComponent,
    NewAttackFormComponent,
    NewTypeFormComponent,
    EditTypeFormComponent,
    EditPokedexEntryFormComponent,
    EditAttackFormComponent
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
    DxListModule,
    DxDataGridModule,
    DxScrollViewModule,
    DxTileViewModule,
    DxPopupModule,
    DxValidatorModule,
    DxiValidationRuleModule,
    DxValidationSummaryModule,
    DxTagBoxModule
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
