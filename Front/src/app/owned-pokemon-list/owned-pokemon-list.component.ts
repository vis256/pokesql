import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokemon} from "../shared/models/Pokemon";
import {Pokedex} from "../shared/models/Pokedex";

@Component({
  selector: 'app-owned-pokemon-list',
  templateUrl: './owned-pokemon-list.component.html',
  styleUrls: ['./owned-pokemon-list.component.scss']
})
export class OwnedPokemonListComponent implements OnInit {

  constructor(
    public router : Router,
    private pokedex : PokedexService
  ) { }

  ngOnInit(): void {
    this.pokedex.getPokedexList().subscribe(data => {
      this.pokedexData = data;
    })
  }

  pokemonList : Pokemon[] = [
    {
      number: 13,
      ID: 1,
      name: "Marcel"
    },    {
      number: 58,
      ID: 2,
      name: "Mścisław"
    },    {
      number: 1,
      ID: 3,
      name: ""
    },

  ];

  pokedexData? : Pokedex[];

  itemClick($event : any) {
    this.router.navigate([`/mypokemon/entry/${$event.itemData.ID}`])
    console.log({$event});
  }

}
