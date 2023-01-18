import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokemon} from "../shared/models/Pokemon";
import {Pokedex} from "../shared/models/Pokedex";
import { PokemonService } from '../shared/services/pokemon.service';
import { Attack } from '../shared/models/Attack';
import { AttackService } from '../shared/services/attack.service';

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
    public pokemon : PokemonService,
    private attack : AttackService
  ) { }

  pokemonData? : Pokemon;
  pokedexData? : Pokedex;
  pokemonAttacks : Attack[] = [];

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

    this.attack.getAttacksForPokemon(this.pokemonID!).subscribe(data => {
      this.pokemonAttacks = data;
    });
  }
}
