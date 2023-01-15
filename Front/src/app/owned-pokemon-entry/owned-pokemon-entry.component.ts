import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokemon} from "../shared/models/Pokemon";
import {Pokedex} from "../shared/models/Pokedex";
import { PokemonService } from '../shared/services/pokemon.service';

@Component({
  selector: 'app-owned-pokemon-entry',
  templateUrl: './owned-pokemon-entry.component.html',
  styleUrls: ['./owned-pokemon-entry.component.scss']
})
export class OwnedPokemonEntryComponent implements OnInit {
  constructor(
    private route : ActivatedRoute,
    public user : UserService,
    public router : Router,
    public pokedex : PokedexService,
    public pokemon : PokemonService
  ) { }

  pokemonData? : Pokemon;
  pokedexData? : Pokedex;

  pokemonID? : number;

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.pokemonID = parseInt(data.params.pokemonID);
    })

    this.pokemon.getMyPokemon().subscribe(data => {
      this.pokemonData = data.find(e => e.id === this.pokemonID)
    })

    // // fetch data from backend
    this.pokedex.getPokedexEntry(this.pokemonData!.pokedex_num!).subscribe((data : any) => {
      this.pokedexData = data;
    });
  }
}
