import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Attack} from "../shared/models/Attack";
import { AttackService } from '../shared/services/attack.service';
import { Pokedex } from '../shared/models/Pokedex';

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
    public pokedex : PokedexService,
    private attack : AttackService
  ) { }

  attackData : Attack = {
    name: '',
    power: 0,
    type_: '',
    hit_chance: 0
  };

  attackName? : string

  pokedexEntries : Pokedex[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.attackName = data.params.attackName;
    })

    this.attack.getAttackByName(this.attackName!).subscribe(data => {
      console.log({data});
      
      this.attackData = data;
    });

    this.attack.getAllPokedexesWithAttack(this.attackName!).subscribe(data => {
      this.pokedexEntries = data;
    })
  }

}
