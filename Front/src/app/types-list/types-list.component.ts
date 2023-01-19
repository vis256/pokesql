import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services";
import {Router} from "@angular/router";
import { TypesService } from '../shared/services/types.service';
import { Type } from '../shared/models/Type';

const colors : any = {
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
  selector: 'app-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.scss']
})
export class TypesListComponent implements OnInit {

  constructor(
    public user : UserService,
    public router : Router,
    public type : TypesService
  ) { }

  types : Type[]= [];

  countered : any = {

  };

  colors = colors;

  ngOnInit(): void {
    this.type.getAllTypes().subscribe(data => {
      this.types = data;

      for (const type of this.types) {
        this.type.getCountersWorse(type.name).subscribe(data => {
          this.countered[type.name] = data;
        })
      }
    })
  }

  currentType : string = ''
  popupVisible : boolean = false;

  click($event : any) {
    this.router.navigate([`/pokedex/types/edit/${$event.itemData.name}`])
  }

}
