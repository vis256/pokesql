import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokedex} from "../shared/models/Pokedex";
import { Attack } from '../shared/models/Attack';
import { AttackService } from '../shared/services/attack.service';

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
    public pokedex : PokedexService,
    private attack : AttackService
  ) { }

  pokedexId : number | null = null;

  pokedexData : Pokedex = {
    min_level: 0,
    name: "",
    number: 0,
    pokeball: "",
    primary_type: "",
    region: "",
    secondary_type: ""
  };

  pokedexAttacks : Attack[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.pokedexId = parseInt(data.params.pokedexid);
    })

    // fetch data from backend
    this.pokedex.getPokedexEntry(this.pokedexId!).subscribe((data : any) => {
      this.pokedexData = data;
    });

    this.attack.getAttacksForPokedex(this.pokedexId!).subscribe(data => {
      this.pokedexAttacks = data;
    })
  }

}
