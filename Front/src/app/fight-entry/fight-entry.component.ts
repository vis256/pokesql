import { Component, OnInit } from '@angular/core';
import {Pokedex} from "../shared/models/Pokedex";
import {PokedexService} from "../shared/services/pokedex.service";

@Component({
  selector: 'app-fight-entry',
  templateUrl: './fight-entry.component.html',
  styleUrls: ['./fight-entry.component.scss']
})
export class FightEntryComponent implements OnInit {

  constructor(
    private pokedex : PokedexService
  ) { }

  player1Pokemon = {
    number: 13,
    ID: 1,
    name: "Marcel",
    lvl : 13
  }

  player2Pokemon = {
    number : 134,
    ID : 14,
    name : "Majonez",
    lvl : 64
  }

  player1Pokedex : Pokedex = {
    min_level: 0, name: "", number: 0, primary_type: "", region: ""
  };
  player2Pokedex : Pokedex = {
    min_level: 0, name: "", number: 0, primary_type: "", region: ""
  }

  ngOnInit(): void {
    this.pokedex.getPokedexEntry(this.player1Pokemon.number).subscribe(data => {
      this.player1Pokedex = data;
    })

    this.pokedex.getPokedexEntry(this.player2Pokemon.number).subscribe(data => {
      this.player2Pokedex = data;
    })
  }

}
