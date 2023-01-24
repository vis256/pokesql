import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokemon} from "../shared/models/Pokemon";
import {findPokedex, Pokedex} from "../shared/models/Pokedex";
import { PokemonService } from '../shared/services/pokemon.service';
import { triggerHandler } from 'devextreme/events';

@Component({
  selector: 'app-owned-pokemon-list',
  templateUrl: './owned-pokemon-list.component.html',
  styleUrls: ['./owned-pokemon-list.component.scss']
})
export class OwnedPokemonListComponent implements OnInit {

  constructor(
    public router : Router,
    private pokedex : PokedexService,
    private pokemon : PokemonService
  ) { }

  ngOnInit(): void {
    // GET POKEDEX
    this.pokedex.getPokedexList().subscribe(data => {
      this.pokedexData = data;

      this.pokemon.getMyPokemon().subscribe(data => {
        let nd : any = data;
        nd.forEach((poke : any) => {
          const pkdxd = this.pokedexData.find(e => e.number == poke.pokedex_num)!
          poke.pokedex_name = pkdxd.name;
          poke.types = [
            pkdxd.primary_type,
            (pkdxd.secondary_type ? pkdxd.secondary_type : null)
          ]
        });
        this.pokemonList = nd;
      })
    })
  }

  pokemonList : any[] = [];
  pokedexData : Pokedex[] = [];

  itemClick($event : any) {
    console.log({$event});
    this.router.navigate([`/mypokemon/entry/${$event.data.id}`])
  }

  sexFilter = [
    {
      text: 'Mężczyzna',
      value: false
    }, 
    {
      text: 'Kobieta',
      value: true
    }, 

  ]
}
