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
  attack : Attack = {
    name: '',
    power : 0,
    type_ : '',
    hit_chance : 0
  };

  get hitChanceInPercent() {
    return Math.floor( this.attack.hit_chance * 100 )
  }

  ngOnInit(): void {
  }

}
