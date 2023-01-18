import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../shared/services";
import {PokedexService} from "../shared/services/pokedex.service";
import {Pokedex} from "../shared/models/Pokedex";

@Component({
  selector: 'app-pokedex-list',
  templateUrl: './pokedex-list.component.html',
  styleUrls: ['./pokedex-list.component.scss']
})
export class PokedexListComponent implements OnInit {

  constructor(
    public router : Router,
    public user : UserService,
    private pokedex : PokedexService
  ) { }

  dataSource : Array<Pokedex> = [];

  ngOnInit(): void {
    this.pokedex.getPokedexList().subscribe((data : any) => {
      this.dataSource = data;
    });
  }

  itemClick($event: any) {
    this.router.navigate([`/pokedex/entry/${$event.itemData.number}`]);
  }
}




