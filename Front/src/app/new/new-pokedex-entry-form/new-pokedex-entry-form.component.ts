import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Pokedex} from "../../shared/models/Pokedex";
import {PokedexService} from "../../shared/services/pokedex.service";
import { Region } from 'src/app/shared/models/Region';
import { ArenaService } from 'src/app/shared/services/arena.service';
import { PokeballsService } from 'src/app/shared/services/pokeballs.service';

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
    public pokeball : PokeballsService
  ) {
    this.secondaryTypeComparison = this.secondaryTypeComparison.bind(this);
  }

  formData : Pokedex = {
    number: -1,
    name: '',
    min_level: 0,
    region: '',
    primary_type: '',
    secondary_type: '',
    pokeball: ''
  };

  allRegions : Region[] = [];

  ngOnInit(): void {
    // Load regions
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

    this.http.post("http://localhost:5000/newPokedexEntry", this.formData, {}).subscribe(resp => {
      console.log({resp})
    })
  }
}
