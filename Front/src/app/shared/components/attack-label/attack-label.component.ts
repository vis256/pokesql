import {Component, Input, OnInit} from '@angular/core';
import {Attack} from "../../models/Attack";

const colors : any = {
  none: '#A8A77A',
  Normal: '#A8A77A',
  Fire: '#EE8130',
  Water: '#6390F0',
  Electric: '#F7D02C',
  Grass: '#7AC74C',
  Ice: '#96D9D6',
  Fighting: '#C22E28',
  Poison: '#A33EA1',
  Ground: '#E2BF65',
  Flying: '#A98FF3',
  Psychic: '#F95587',
  Bug: '#A6B91A',
  Rock: '#B6A136',
  Ghost: '#735797',
  Dragon: '#6F35FC',
  Dark: '#705746',
  Steel: '#B7B7CE',
  Fairy: '#D685AD',
};
@Component({
  selector: 'app-attack-label',
  templateUrl: './attack-label.component.html',
  styleUrls: ['./attack-label.component.scss']
})
export class AttackLabelComponent implements OnInit {

  constructor() { }

  colors = colors;

  @Input()
  name : string = '';

  attacks : any = {
    'Quick Attack': {
      name : 'Quick Attack',
      power : 80,
      type : 'Normal',
      hit_chance : 0.95
    },
    'Leaf Blade' : {
      name : 'Leaf Blade',
      power : 120,
      type : 'Grass',
      hit_chance : 0.9
    },
    'Harden' : {
      name : 'Harden',
      power : 0,
      type : 'Normal',
      hit_chance : 1
    },
'Absorb' : {
  name : 'Absorb',
  power : 20,
  type : 'Grass',
  hit_chance : 1
},
'Acid' : {
  name : 'Acid',
    power : 40,
  type : 'Poison',
  hit_chance : 1
},
'Aqua Cutter' : {
  name : 'Aqua Cutter',
    power : 70,
  type : 'Water',
  hit_chance : 1
},

'Aqua Jet' : {
  name : 'Aqua Jet',
    power : 40,
  type : 'Water',
  hit_chance : 1
},
'Aqua Ring' : {
  name : 'Aqua Ring',
    power : 0,
  type : 'Water',
  hit_chance : 1
},
'Aqua Tail' : {
  name : 'Aqua Tail',
    power : 90,
  type : 'Water',
  hit_chance : 0.9
}
  }

  attackData : Attack = {
    name: '',
    power : 0,
    type : '',
    hit_chance : 0
  }

  ngOnInit(): void {
    this.attackData = this.attacks[this.name];
  }

}
