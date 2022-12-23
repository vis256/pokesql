import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokemon} from "../shared/models/Pokemon";
import {Pokedex} from "../shared/models/Pokedex";

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
    public pokedex : PokedexService
  ) { }

  pokemonData? : Pokemon;
  pokedexData? : Pokedex;

  pokemonID? : number;

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.pokemonID = parseInt(data.params.pokemonID);
    })

    this.pokemonData = {
      number: 13,
      ID: 1,
      name: "Marcel"
    },

    // fetch data from backend
    this.pokedex.getPokedexEntry(this.pokemonData.number).subscribe((data : any) => {
      this.pokedexData = data;
      this.pokedexData!.Attacks = [
        'Leaf Blade',
        'Harden',
        'Quick Attack'
      ]
    });
  }

}
