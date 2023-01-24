import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
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
  selector: 'app-edit-pokemon-entry-form',
  templateUrl: './edit-pokemon-entry-form.component.html',
  styleUrls: ['./edit-pokemon-entry-form.component.scss']
})
export class EditPokemonEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute,
    private pokedex : PokedexService,
    private user : UserService,
    private pokemon : PokemonService,
    private error : ErrorService,
    private pokeball : PokeballsService,
    private attack : AttackService,
    private router : Router
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
  allPossibleAttacks : string[] = [];

  oldAttacks : Attack[] = [];

  pokemonID? : number;

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.pokemonID = parseInt(data.params.pokemonID);

      this.pokemon.getPokemonData(this.pokemonID!).subscribe(data => {
        let nd : any = data;
        nd.attacks = [];

        this.attack.getAttacksForPokemon(this.pokemonID!).subscribe(data => {
          for (const attack of data) {
            nd.attacks.push(attack.name);
          }
          this.oldAttacks = data;
          this.formData = nd;
        })
      })
    });

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
      for (const atk of data) {
        this.allPossibleAttacks.push(atk.name);
      }
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

  deletePokemon() {

  }

  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();

    console.log({pd : this.currentPokedexData});

    const newPokemon : any = {
      id: this.formData.id,
      name: (this.formData.name == '' ? null : this.formData.name),
      level: this.formData.level,
      sex: this.formData.sex,
      pokedex_num: this.formData.pokedex_num,
      pokeball: this.formData.pokeball,
      owner: this.formData.owner
    }
    

    this.pokemon.updatePokemon(newPokemon).subscribe(
      (data : any) => {
        // remove old attacks
        for (const oldAttack of this.oldAttacks) {
          this.attack.deleteAttackFromPokemon({attack : oldAttack.name, pokemon_id : this.formData.id}).subscribe(
            data => {},
            err => {this.error.displayError(err.error)}
          )
        }

        for (const attack of this.formData.attacks) {
          this.attack.addAttacksToPokemon({pokemon_id: this.formData.id, attack }).subscribe(
            data => {
              this.router.navigate(['/mypokemon'])
            },
            err => {this.error.displayError(err.error)}
          )
          
        }
        
      },
      err => {
        console.log(err);
        this.error.displayError(err.error)
      }
    );
  }
}
