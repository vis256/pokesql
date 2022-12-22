import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Pokedex} from "../shared/models/Pokedex";
import {PokedexService} from "../shared/services/pokedex.service";

@Component({
  selector: 'app-new-pokedex-entry-form',
  templateUrl: './new-pokedex-entry-form.component.html',
  styleUrls: ['./new-pokedex-entry-form.component.scss']
})
export class NewPokedexEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute,
    private pokedex : PokedexService
  ) { }

  formData : Pokedex = {
    number: -1,
    name: "",
    min_level: 0,
    region: "",
    pokeball: "Great Ball",
    primary_type: "",
    secondary_type: ""
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      console.log({xd: data.params});
      if (data.params.pokedexid) {
        const pokedexid = parseInt(data.params.pokedexid);

        this.pokedex.getPokedexEntry(pokedexid!).subscribe((data : any) => {
          this.formData = data;
          this.formData.pokeball = 'Great Ball'
        });
      }
    })
  }

  submit($event: any) {
    console.log({data: this.formData})

    this.http.post("http://localhost:5000/newPokedexEntry", this.formData, {}).subscribe(resp => {
      console.log({resp})
    })
  }
}
