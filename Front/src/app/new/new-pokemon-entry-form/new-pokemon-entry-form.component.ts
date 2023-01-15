import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {PokedexService} from "../../shared/services/pokedex.service";
import {Pokedex} from "../../shared/models/Pokedex";
import {Pokemon} from "../../shared/models/Pokemon";
import { UserService } from 'src/app/shared/services';
import { Pokeball } from 'src/app/shared/models/Pokeball';

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
    private user : UserService
  ) {
    this.checkMinLevel = this.checkMinLevel.bind(this);
    this.updateCurrentPokedex = this.updateCurrentPokedex.bind(this);
  }

  formData : Pokemon = {
    id: -1,
    name: '',
    level: 0,
    sex: false,
    pokedex_num: -1,
    pokeball: '',
    owner: this.user.user?.login!
  }

  currentPokedexData : Pokedex = {
    number: -1,
    name: "xd",
    min_level: -1,
    region: 'Unova',
    primary_type: 'Grass',
    secondary_type: 'Grass'
  };

  currentPokedexList : Array<Pokedex> = [

  ];

  ngOnInit(): void {
    // this.pokedex.getPokedexList().subscribe((data : any) => {
    //   this.currentPokedexList = data;
    // })
    this.currentPokedexList = [    {
      number: 1,
      name: "XD",
      min_level: 11,
      region: 'Unova',
      primary_type: 'Grass',
      secondary_type: 'Fire'
    },
    {
      number: 2,
      name: "XD2",
      min_level: 15,
      region: 'Kanto',
      primary_type: 'Normal'
    },]
  }

  updateCurrentPokedex($event : any) {
    console.log({this : this});
    
    this.currentPokedexData = $event.selectedItem;
  }

  checkMinLevel() {
    return this.currentPokedexData?.min_level;
  }

  pokedexDisplayExpr($event : any) {
    console.log({$event});
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

    this.http.post("http://localhost:5000/newPokedexEntry", this.formData, {}).subscribe(resp => {
      console.log({resp})
    })
  }
}
