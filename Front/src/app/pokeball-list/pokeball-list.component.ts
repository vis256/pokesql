import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Pokeball } from '../shared/models/Pokeball';
import {UserService} from "../shared/services";
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
    private pokeball : PokeballsService
  ) { }

  ngOnInit(): void {
    this.pokeball.getAllPokeballs().subscribe(data => {
      this.items = data;
    })
  }


  items : Pokeball[] = []
}
