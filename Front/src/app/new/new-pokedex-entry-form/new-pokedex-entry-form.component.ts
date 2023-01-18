import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Pokedex} from "../../shared/models/Pokedex";
import {PokedexService} from "../../shared/services/pokedex.service";
import { Region } from 'src/app/shared/models/Region';
import { ArenaService } from 'src/app/shared/services/arena.service';
import { PokeballsService } from 'src/app/shared/services/pokeballs.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Pokeball } from 'src/app/shared/models/Pokeball';
import { TypesService } from 'src/app/shared/services/types.service';
import { Attack } from 'src/app/shared/models/Attack';
import { AttackService } from 'src/app/shared/services/attack.service';

@Component({
  selector: 'app-new-pokedex-entry-form',
  templateUrl: './new-pokedex-entry-form.component.html',
  styleUrls: ['./new-pokedex-entry-form.component.scss']
})
export class NewPokedexEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute,
    private pokedex : PokedexService,
    public arena : ArenaService,
    public pokeball : PokeballsService,
    private error : ErrorService,
    private types : TypesService,
    private attack : AttackService
  ) {
    this.secondaryTypeComparison = this.secondaryTypeComparison.bind(this);
  }

  formData : any = {
    number: -1,
    name: '',
    min_level: 0,
    region: '',
    primary_type: '',
    secondary_type: '',
    pokeballs: [],
    attacks: []
  };

  allRegions : Region[] = [];

  allPokeballs : Pokeball[] = [];

  allTypes : string[] = [];

  allAttacks : Attack[] = [];

  ngOnInit(): void {
    // Load regions
    this.arena.getAllRegions().subscribe(data => {
      this.allRegions = data;
    })

    this.pokeball.getAllPokeballs().subscribe(data => {
      this.allPokeballs = data;
    })

    this.types.getAllTypesString().subscribe(data => {
      this.allTypes = data;
    });

    this.attack.getAllAttacks().subscribe(data => {
      this.allAttacks = data;
    })

    this.pokedex.getPokedexList().subscribe(data => {
      let max = -1;
      for (const pd of data) {
        if (pd.number > max) max = pd.number;
      }
      max++;
      this.formData.number = max;
    })
  }

  _primary_type : string | null = null;

  setPrimary($event : any) {
    this._primary_type = $event.value;
  }

  secondaryTypeComparison = () => {
    return this.formData.primary_type;
  }

  onFormSubmit($event: any) {
    console.log({$event})
    console.log(this.formData);
    
    $event.preventDefault();

    this.pokedex.addNewPokedexEntry(this.formData).subscribe(
      data => {
        console.log({data});

        for (const pokeball of this.formData.pokeballs) {
          console.log(pokeball);
          
          this.pokeball.addPokedexPokeballEntry(pokeball, this.formData.number).subscribe(
            data => {

            },
            err => {
              console.error({err});

            }
          )
        }

        for (const attack of this.formData.attacks) {
          this.attack.addAttackToPokedex({attack, pokedex_num : this.formData.number}).subscribe(
            data => {

            },
            err => {
              console.error({err});
              
            }
          )

        }
        
      },
      err => {
        console.log({err});
        this.error.displayError(err.error);
      }
    )
  }
}
