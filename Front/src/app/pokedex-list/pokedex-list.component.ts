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

  dataSource : any[] = [];

  ngOnInit(): void {
    this.pokedex.getPokedexList().subscribe(data => {
      let nd : any[] = [];
      for (const pkdx of data) {
        const ne = {
          number : pkdx.number,
          name : pkdx.name,
          min_level : pkdx.min_level,
          region : pkdx.region,
          types : [
            pkdx.primary_type,
            (pkdx.secondary_type ? pkdx.secondary_type : null)
          ]
        }

        nd.push(ne);
      }
      this.dataSource = nd;
    });
  }

  itemClick($event: any) {
    this.router.navigate([`/pokedex/entry/${$event.data.number}`]);
  }
}




