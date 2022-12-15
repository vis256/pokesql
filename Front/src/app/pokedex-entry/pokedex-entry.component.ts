import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../shared/services";

@Component({
  selector: 'app-pokedex-entry',
  templateUrl: './pokedex-entry.component.html',
  styleUrls: ['./pokedex-entry.component.scss']
})
export class PokedexEntryComponent implements OnInit {
  constructor(
    private route : ActivatedRoute,
    public user : UserService,
    public router : Router
  ) { }

  pokedexId : number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      this.pokedexId = parseInt(data.params.pokedexid);
    })

    // fetch data from backend
  }

}
