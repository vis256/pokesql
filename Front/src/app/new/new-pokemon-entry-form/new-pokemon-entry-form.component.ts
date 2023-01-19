import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {PokedexService} from "../../shared/services/pokedex.service";
import {Pokedex} from "../../shared/models/Pokedex";
import {Pokemon} from "../../shared/models/Pokemon";
import { UserService } from 'src/app/shared/services';
import { Pokeball } from 'src/app/shared/models/Pokeball';
import { PokemonService } from 'src/app/shared/services/pokemon.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PokeballsService } from 'src/app/shared/services/pokeballs.service';
import { Attack } from 'src/app/shared/models/Attack';
import { AttackService } from 'src/app/shared/services/attack.service';

@Component({
  selector: 'app-new-pokemon-entry-form',
  templateUrl: './new-pokemon-entry-form.component.html',
  styleUrls: ['./new-pokemon-entry-form.component.scss']
})
export class NewPokemonEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute,
    private pokedex : PokedexService,
    private user : UserService,
    private pokemon : PokemonService,
    private error : ErrorService,
    private pokeball : PokeballsService,
    private attack : AttackService
  ) {
    this.checkMinLevel = this.checkMinLevel.bind(this);
    this.updateCurrentPokedex = this.updateCurrentPokedex.bind(this);
  }

  formData : any = {
    id: -1,
    name: '',
    level: 0,
    sex: false,
    pokedex_num: null,
    pokeball: '',
    owner: this.user.user?.login!,
    attacks : []
  }

  currentPokedexData : Pokedex = {
    number: -1,
    name: "xd",
    min_level: -1,
    region: 'Unova',
    primary_type: 'Grass',
    secondary_type: 'Grass'
  };

  currentPokedexList : Array<Pokedex> = [];
  allPossiblePokeballs : Pokeball[] = [];
  allPossibleAttacks : Attack[] = [];

  ngOnInit(): void {
    this.pokedex.getPokedexList().subscribe((data : any) => {
      this.currentPokedexList = data;
    })

  }

  updateCurrentPokedex($event : any) {
    console.log({this : this});
    
    this.currentPokedexData = $event.selectedItem;
    this.pokeball.getPokeballsUsedForPokedex($event.selectedItem.number).subscribe(data => {
      this.allPossiblePokeballs = data;
    })

    this.attack.getAttacksForPokedex($event.selectedItem.number).subscribe(data => {
      this.allPossibleAttacks = data;
    })

  }

  checkMinLevel() {
    return this.currentPokedexData?.min_level;
  }

  pokedexDisplayExpr($event : any) {
    if ($event == null) return ''

    return `
      #${$event.number} - ${$event.name}
    `
  }

  getSexLabel(value : boolean) {
    return !value ? 'Mężczyzna' : 'Kobieta';
  }

  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();

    console.log({pd : this.currentPokedexData});

    const newPokemon : Pokemon = {
      id: -1,
      name: this.formData.name,
      level: this.formData.level,
      sex: this.formData.sex,
      pokedex_num: this.formData.pokedex_num,
      pokeball: this.formData.pokeball,
      owner: this.formData.owner
    }
    

    this.pokemon.addNewPokemon(newPokemon).subscribe(
      data => {
        console.log(data);
        // TODO: Add attacks to pokemon
        // this.attack.addAttacksToPokemon()
        
      },
      err => {
        console.log(err);
        this.error.displayError(err.error)
      }
    );
  }
}
