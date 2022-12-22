import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  constructor(public router : Router) { }

  ngOnInit(): void {
  }

  items = [
    {
      text : 'Gatunki Pokemon\'ów',
      background : "../assets/backgrounds/eevee.webp",
      route : '/pokedex/list'
    },
    {
      text : 'Rodzaje Pokeballi',
      background : "../assets/backgrounds/pokeballs.jpg",
      route : 'pokedex/pokeball/list'
    },
    {
      text : 'Typy',
      background : "../assets/backgrounds/types.jpg",
      route : 'pokedex/types/list'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
    {
      text : 'Test',
      background : "../assets/backgrounds/lab.jpg",
      route : 'mypokemon'
    },
  ]

}
