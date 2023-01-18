import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services";
import {Router} from "@angular/router";
import {Attack} from "../shared/models/Attack";

@Component({
  selector: 'app-attack-list',
  templateUrl: './attack-list.component.html',
  styleUrls: ['./attack-list.component.scss']
})
export class AttackListComponent implements OnInit {

  constructor(
    public user : UserService,
    public router : Router
  ) { }

  attacks : Array<Attack> = [];

  click($event : any) {
    this.router.navigate([`/pokedex/attacks/${$event.itemData.name}`])
  }

  ngOnInit(): void {
    // TODO: Fetch data from backend
    this.attacks = [
      {
        name : 'Absorb',
        power : 20,
        type : 'Grass',
        hit_chance : 1
      },
      {
        name : 'Leaf Blade',
        power : 120,
        type : 'Grass',
        hit_chance : 0.9
      },
      {
        name : 'Harden',
        power : 0,
        type : 'Normal',
        hit_chance : 1
      },
      {
        name : 'Quick Attack',
        power : 80,
        type : 'Normal',
        hit_chance : 0.95
      },
      {
        name : 'Acid',
        power : 40,
        type : 'Poison',
        hit_chance : 1
      },
      {
        name : 'Aqua Cutter',
        power : 70,
        type : 'Water',
        hit_chance : 1
      },
            {
        name : 'Aqua Jet',
        power : 40,
        type : 'Water',
        hit_chance : 1
      },
            {
        name : 'Aqua Ring',
        power : 0,
        type : 'Water',
        hit_chance : 1
      },
            {
        name : 'Aqua Tail',
        power : 90,
        type : 'Water',
        hit_chance : 0.9
      },

    ]
  }
}
