import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import {DxDataGridModule, DxFormModule, DxTileViewModule} from 'devextreme-angular';
import {NewPokedexEntryFormComponent} from "./new/new-pokedex-entry-form/new-pokedex-entry-form.component";
import {HttpClientModule} from "@angular/common/http";
import {PokedexListComponent} from "./pokedex-list/pokedex-list.component";
import {PokedexEntryComponent} from "./pokedex-entry/pokedex-entry.component";
import {OwnedPokemonListComponent} from "./owned-pokemon-list/owned-pokemon-list.component";
import {DxScrollViewModule} from "devextreme-angular/ui/scroll-view";
import {PokedexComponent} from "./pokedex/pokedex.component";
import {DxListModule} from "devextreme-angular/ui/list";
import {NewPokemonEntryFormComponent} from "./new/new-pokemon-entry-form/new-pokemon-entry-form.component";
import {PokeballListComponent} from "./pokeball-list/pokeball-list.component";
import {TypesListComponent} from "./types-list/types-list.component";
import {OwnedPokemonEntryComponent} from "./owned-pokemon-entry/owned-pokemon-entry.component";
import {AttackListComponent} from "./attack-list/attack-list.component";
import {AttackEntryComponent} from "./attack-entry/attack-entry.component";
import {ArenaDashboardComponent} from "./arena-dashboard/arena-dashboard.component";
import {ArenaListComponent} from "./arena-list/arena-list.component";
import {ArenaEntryComponent} from "./arena-entry/arena-entry.component";
import {FightEntryComponent} from "./fight-entry/fight-entry.component";
import { NewPokeballEntryFormComponent } from './new/new-pokeball-entry-form/new-pokeball-entry-form.component';
import { MyArenaListComponent } from './my-arena-list/my-arena-list.component';
import { NewRegionArenaFormComponent } from './new/new-region-arena-form/new-region-arena-form.component';
import { NewAttackFormComponent } from './new/new-attack-form/new-attack-form.component';
import { NewTypeFormComponent } from './new/new-type-form/new-type-form.component';
import { EditTypeFormComponent } from './edit/edit-type-form/edit-type-form.component';
import { EditPokedexEntryFormComponent } from './edit/edit-pokedex-entry-form/edit-pokedex-entry-form.component';
import { EditAttackFormComponent } from './edit/edit-attack-form/edit-attack-form.component';
import { RegionListComponent } from './region-list/region-list.component';
import { NewFightFormComponent } from './new/new-fight-form/new-fight-form.component';

const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'newpokedex',
    component: NewPokedexEntryFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'pokedex/list',
    component: PokedexListComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'pokedex/new',
    component: NewPokedexEntryFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'pokedex/edit/:pokedexid',
    component: EditPokedexEntryFormComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path : 'pokedex/entry/:pokedexid',
    component : PokedexEntryComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex',
    component : PokedexComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'mypokemon',
    component : OwnedPokemonListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'mypokemon/new',
    component : NewPokemonEntryFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'mypokemon/entry/:pokemonID',
    component : OwnedPokemonEntryComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/pokeball/list',
    component : PokeballListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/pokeball/new',
    component : NewPokeballEntryFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/pokeball/:pokeballName',
    component : NewPokeballEntryFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/types/list',
    component : TypesListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/types/new',
    component : NewTypeFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/types/edit/:typeName',
    component : EditTypeFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/attacks/list',
    component : AttackListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/attacks/new',
    component : NewAttackFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/attacks/:attackName',
    component : AttackEntryComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'pokedex/attacks/:attackName/edit',
    component : EditAttackFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'myarena',
    component : MyArenaListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'arena/list',
    component : ArenaListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'arena/:arenaMemberID',
    component : ArenaEntryComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'arena/:arenaMemberID/newfight',
    component : NewFightFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path : 'fight/:id',
    component : FightEntryComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path: 'pokedex/regions/new',
    component : NewRegionArenaFormComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path: 'pokedex/regions/list',
    component : RegionListComponent,
    canActivate : [ AuthGuardService ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), HttpClientModule, DxDataGridModule, DxFormModule, DxTileViewModule, DxScrollViewModule, DxListModule ],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [
    HomeComponent,
    ProfileComponent,
    TasksComponent
  ]
})
export class AppRoutingModule { }
