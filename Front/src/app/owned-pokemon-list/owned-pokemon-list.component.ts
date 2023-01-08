import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokemon} from "../shared/models/Pokemon";
import {findPokedex, Pokedex} from "../shared/models/Pokedex";
import { PokemonService } from '../shared/services/pokemon.service';

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

  public pkdx(pokedex_num : number) {
    return findPokedex(this.pokedexData, pokedex_num);
  }

  ngOnInit(): void {
    // GET POKEDEX
    this.pokedex.getPokedexList().subscribe(data => {
      this.pokedexData = data;
    })

    // GET OWNED POKEMON
    this.pokemon.getMyPokemon().subscribe(data => {
      let i : any = data;
      i.forEach((e : any) => {
        const pd = this.pkdx(e.pokedex_num)!
        i.types = [ pd.primary_type ]
        if (pd.secondary_type) {
          i.types.push(pd.secondary_type);
        }
      })
      this.pokemonList = i;
    })
  }

  pokemonList : any[] = [];
  pokedexData : Pokedex[] = [];

  itemClick($event : any) {
    this.router.navigate([`/mypokemon/entry/${$event.itemData.id}`])
    console.log({$event});
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
