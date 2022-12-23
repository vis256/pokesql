import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../shared/services";

@Component({
  selector: 'app-pokeball-list',
  templateUrl: './pokeball-list.component.html',
  styleUrls: ['./pokeball-list.component.scss']
})
export class PokeballListComponent implements OnInit {

  constructor(
    public router : Router,
    public user : UserService
  ) { }

  ngOnInit(): void {
    // TODO: Fetch Pokeball data
  }


  items = [
    {
      text : 'Pokeball',
      background : "../assets/sprites/pokeball/pokeball.webp",
      route : '/pokedex/list'
    },
    {
      text : 'Great Ball',
      background : "../assets/sprites/pokeball/pokeball.webp",
      route : '/pokedex/list'
    },
    {
      text : 'Master Ball',
      background : "../assets/sprites/pokeball/pokeball.webp",
      route : '/pokedex/list'
    },
  ]
}
