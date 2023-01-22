import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
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
  selector: 'app-edit-pokedex-entry-form',
  templateUrl: './edit-pokedex-entry-form.component.html',
  styleUrls: ['./edit-pokedex-entry-form.component.scss']
})
export class EditPokedexEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute,
    private pokedex : PokedexService,
    public arena : ArenaService,
    public pokeball : PokeballsService,
    private error : ErrorService,
    private types : TypesService,
    private attack : AttackService,
    private router : Router
  ) {
    this.secondaryTypeComparison = this.secondaryTypeComparison.bind(this);
    this.deletePokedex = this.deletePokedex.bind(this);
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

  originalPokeballs : Pokeball[] = [];

  originalAttacks : Attack[] = [];

  allRegions : Region[] = [];

  allPokeballs : Pokeball[] = [];

  allTypes : string[] = [];

  allAttacks : Attack[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.formData.number = data.params.pokedexid;

      this.pokedex.getPokedexEntry(this.formData.number).subscribe(data => {
        this.formData.number = data.number;
        this.formData.name = data.name;
        this.formData.min_level = data.min_level;
        this.formData.region = data.region;
        this.formData.primary_type = data.primary_type;
        this.formData.secondary_type = data.secondary_type;
      })
  
      this.attack.getAttacksForPokedex(this.formData.number).subscribe(data => {
        this.formData.attacks = data;
        this.originalAttacks = data;
      })

      this.pokeball.getPokeballsUsedForPokedex(this.formData.number).subscribe(data => {
        this.formData.pokeballs = data;
        this.originalPokeballs = data;
      })
    })

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
  }

  _primary_type : string | null = null;

  setPrimary($event : any) {
    this._primary_type = $event.value;
  }

  secondaryTypeComparison = () => {
    return this.formData.primary_type;
  }

  deletePokedex() {
    this.pokedex.deletePokedexEntry(this.formData.number).subscribe(
      data => {this.router.navigate(['/pokedex/list'])},
      err => {this.error.displayError(err.error)}
    )
  }

  onFormSubmit($event: any) {
    console.log({$event})
    console.log(this.formData);
    
    $event.preventDefault();

    this.pokedex.updatePokedexEntry(this.formData).subscribe(
      data => {
        console.log({data});

        for (const attack of this.originalAttacks) {
          this.attack.deleteAttackFromPokedex({attack : attack.name, pokedex_num : this.formData.number}).subscribe(
            data => {},
            err => {this.error.displayError(err.error)}
          )
        }

        for (const pokeball_e of this.originalPokeballs) {
          this.pokeball.deletePokedexPokeball({pokeball : pokeball_e.name, pokedex_num : this.formData.number}).subscribe(
            data => {},
            err => {this.error.displayError(err.error)}
          )
        }

        for (const pokeball_e of this.formData.pokeballs) {
          this.pokeball.addPokedexPokeballEntry(pokeball_e.name, this.formData.number).subscribe(
            data => {

            },
            err => {
              console.error({err});
              this.error.displayError(err.error)
            }
          )
        }

        for (const attack of this.formData.attacks) {
          this.attack.addAttackToPokedex({attack, pokedex_num : this.formData.number}).subscribe(
            data => {
              setTimeout(() => {
                this.router.navigate(['/pokedex/list'])
              }, 2000);
            },
            err => {
              console.error({err});
              this.error.displayError(err.error)
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
