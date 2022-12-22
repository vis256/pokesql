import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-owned-pokemon-list',
  templateUrl: './owned-pokemon-list.component.html',
  styleUrls: ['./owned-pokemon-list.component.scss']
})
export class OwnedPokemonListComponent implements OnInit {

  constructor(
    public router : Router
  ) { }

  ngOnInit(): void {
  }

  pokemonList : any = [];

  itemClick($event : any) {
    console.log({$event});
  }

}
