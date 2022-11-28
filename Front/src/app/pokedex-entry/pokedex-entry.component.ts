import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.scss']
})
export class PokedexEntryComponent implements OnInit {
  constructor(
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {
      console.log({routeData : data})
    })
  }

}
