import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-owned-pokemon-list',
  templateUrl: './owned-pokemon-list.component.html',
  styleUrls: ['./owned-pokemon-list.component.scss']
})
export class OwnedPokemonListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  pokemonList : any = [];

  itemClick($event : any) {
    console.log({$event});
  }

}
