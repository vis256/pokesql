import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent, ResetPasswordFormComponent, CreateAccountFormComponent, ChangePasswordFormComponent } from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import {DxDataGridModule, DxFormModule, DxTileViewModule} from 'devextreme-angular';
import {NewPokedexEntryFormComponent} from "./new-pokedex-entry-form/new-pokedex-entry-form.component";
import {HttpClientModule} from "@angular/common/http";
import {PokedexListComponent} from "./pokedex-list/pokedex-list.component";
import {PokedexEntryComponent} from "./pokedex-entry/pokedex-entry.component";
import {OwnedPokemonListComponent} from "./owned-pokemon-list/owned-pokemon-list.component";
import {DxScrollViewModule} from "devextreme-angular/ui/scroll-view";
import {PokedexComponent} from "./pokedex/pokedex.component";
import {DxListModule} from "devextreme-angular/ui/list";

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
    component: NewPokedexEntryFormComponent,
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
