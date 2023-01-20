import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services";
import {Router} from "@angular/router";
import { TypesService } from '../shared/services/types.service';
import { Type } from '../shared/models/Type';
import { Counter } from '../shared/models/Counter';
import { ErrorService } from '../shared/services/error.service';

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
    public type : TypesService,
    private error : ErrorService
  ) {
    this.validate = this.validate.bind(this);
  }

  types : Type[]= [];

  countered : any = {
  };

  formData : any = {
    counter : ''
  }

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

  showNewCounterPopup = false;

  currentType : string = ''
  popupVisible : boolean = false;

  betterType : string = ''

  click($event : any) {
    this.router.navigate([`/pokedex/types/edit/${$event}`])
  }

  validate($event : any) {
    const r : Type[] = this.countered[$event.value];
    let n : string[] = [];
    for (const t of r) {
      n.push(t.name);
    }
    const res = n.includes(this.betterType);
    console.log(this.countered[$event.value], $event.value, this.betterType, res);
    
    return !res;
  }

  comp = () => this.betterType;

  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();
    const worse = this.formData.counter;

    const cnt : Counter = {
      better_type: this.betterType,
      worse_type: worse
    }

    this.type.addNewCounter(cnt).subscribe(
      data => {
        this.ngOnInit();
        this.showNewCounterPopup = false;
      },
      err => {this.error.displayError(err.error)}
    );
  }

}
