import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokedex} from "../shared/models/Pokedex";
import {Pokemon} from "../shared/models/Pokemon";

@Component({
  selector: 'app-new-pokemon-entry-form',
  templateUrl: './new-pokemon-entry-form.component.html',
  styleUrls: ['./new-pokemon-entry-form.component.scss']
})
export class NewPokemonEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute,
    private pokedex : PokedexService
  ) { }

  formData : Pokemon = {
    id: -1,
    name: '',
    level: 0,
    sex: false,
    pokedex_num: -1,
    pokeball: '',
    owner: ''
  }

  currentPokedexData : Pokedex = {
    min_level: 0, name: "", number: 0, primary_type: "", region: ""
  }

  currentPokedexList : Array<Pokedex> = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      console.log({xd: data.params});
      if (data.params.pokedexid) {
        const pokedexid = parseInt(data.params.pokedexid);

        this.pokedex.getPokedexEntry(pokedexid!).subscribe((data : any) => {
          // this.formData = data;
        });
      }
    });

    this.pokedex.getPokedexList().subscribe((data : any) => {
      this.currentPokedexList = data;
    })
  }

  getPokedexData(number : number) {
    this.pokedex.getPokedexEntry(number).subscribe((data : any) => {
      this.currentPokedexData = data;
    });
  }

  submit($event: any) {
    console.log({data: this.formData})

    this.http.post("http://localhost:5000/newPokedexEntry", this.formData, {}).subscribe(resp => {
      console.log({resp})
    })
  }
}
