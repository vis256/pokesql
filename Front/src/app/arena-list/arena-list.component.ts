import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-arena-list',
  templateUrl: './arena-list.component.html',
  styleUrls: ['./arena-list.component.scss']
})
export class ArenaListComponent implements OnInit {

  constructor(
    public router : Router
  ) { }

  ngOnInit(): void {
  }


  items = [
    {
      text : 'Unova Arena',
      points : 11,
      background : "../assets/backgrounds/arena.jpg",
      route : 'arena/Unova'
    },
    {
      text : 'Kanto Gym',
      points : 3,
      background : "../assets/backgrounds/arena.jpg",
      route : 'arena/Unova'
    },
  ]

}
