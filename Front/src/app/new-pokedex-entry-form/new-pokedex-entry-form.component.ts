import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Pokedex} from "../shared/models/Pokedex";

@Component({
  selector: 'app-new-pokedex-entry-form',
  templateUrl: './new-pokedex-entry-form.component.html',
  styleUrls: ['./new-pokedex-entry-form.component.scss']
})
export class NewPokedexEntryFormComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route : ActivatedRoute
  ) { }

  formData : Pokedex = {
    ID: -1,
    Name: "",
    Types: ["", null],
    MinimalLevel: 0,
    Region: "",
    Pokeball: "",
    Attacks: [],
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      console.log({xd: data.params});
      if (data.params.pokedexid) {
        const pokedexid = parseInt(data.params.pokedexid);
        // TODO: fetch data to prefill form
        this.formData.ID = pokedexid;
        this.formData.Name = 'CHUJ';
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
