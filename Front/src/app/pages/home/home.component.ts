import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.scss' ]
})

export class HomeComponent {
  constructor(public router : Router) {}

  items = [
    {
      text : 'Pokedex',
      background : "../assets/backgrounds/lab.jpg",
      route : '/pokedex'
    },
    {
      text : 'Moje Pokemony',
      background : "../assets/backgrounds/town.webp",
      route : 'mypokemon'
    },
    {
      text : 'Moja Arena',
      background : "../assets/backgrounds/arena.jpg",
      route : '/myarena'
    },
    {
      text : 'Laboratorium',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
  ]
}
