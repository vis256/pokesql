import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Attack} from "../shared/models/Attack";

@Component({
  selector: 'app-attack-entry',
  templateUrl: './attack-entry.component.html',
  styleUrls: ['./attack-entry.component.scss']
})
export class AttackEntryComponent implements OnInit {
  constructor(
    private route : ActivatedRoute,
    public user : UserService,
    public router : Router,
    public pokedex : PokedexService
  ) { }

  attackData? : Attack;

  attackName? : string

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.attackName = data.params.attackName;
    })

    // TODO: Fetch attack data
    this.attackData = {
      name : 'Leaf Blade',
      power : 120,
      type : 'Grass',
      hit_chance : 0.9
    }
  }

}
