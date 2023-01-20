import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Pokeball } from '../shared/models/Pokeball';
import {UserService} from "../shared/services";
import { ErrorService } from '../shared/services/error.service';
import { PokeballsService } from '../shared/services/pokeballs.service';

@Component({
  selector: 'app-pokeball-list',
  templateUrl: './pokeball-list.component.html',
  styleUrls: ['./pokeball-list.component.scss']
})
export class PokeballListComponent implements OnInit {
  constructor(
    public router : Router,
    public user : UserService,
    private pokeball : PokeballsService,
    private error : ErrorService
  ) { }

  items : Pokeball[] = []

  ids : any = {};

  ngOnInit(): void {
    this.pokeball.getAllPokeballs().subscribe(data => {
      this.items = data;

      let i = 1;
      for (const pkb of data) {
        this.ids[pkb.name] = `../../assets/sprites/pokeball/${i++}.png`;
        if (i > 5) i = 1;
      }
    })
  }

  deletePokeball(pokeball_name : string) {
    this.pokeball.deletePokeball(pokeball_name).subscribe(
      data => { this.ngOnInit() },
      err => { this.error.displayError(err.error) }
    )
  } 
}
