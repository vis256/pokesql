import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokedex} from "../shared/models/Pokedex";

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.scss']
})
export class PokedexEntryComponent implements OnInit {
  constructor(
    private route : ActivatedRoute,
    public user : UserService,
    public router : Router,
    public pokedex : PokedexService
  ) { }

  pokedexId : number | null = null;

  pokedexData : Pokedex = {
    Attacks: [],
    min_level: 0,
    name: "",
    number: 0,
    pokeball: "",
    primary_type: "",
    region: "",
    secondary_type: ""
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.pokedexId = parseInt(data.params.pokedexid);
    })

    // fetch data from backend
    this.pokedex.getPokedexEntry(this.pokedexId!).subscribe((data : any) => {
      this.pokedexData = data;
    });
  }

}
