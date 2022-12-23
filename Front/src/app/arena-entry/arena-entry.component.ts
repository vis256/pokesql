import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arena-entry',
  templateUrl: './arena-entry.component.html',
  styleUrls: ['./arena-entry.component.scss']
})
export class ArenaEntryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  recentFights = [
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-23T03:24:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Marcel'
    },
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-22T12:27:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Marcel'
    },
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-21T16:45:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Marcel'
    },
    {
      Rezultat : 'L',
      'Data walki' : new Date("2022-12-19T23:24:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Mścisław'
    },
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-17T01:28:00"),
      Przeciwnik : 'Emily',
      'Twój Pokemon' : 'Bulbasaur'
    },

  ]

}
