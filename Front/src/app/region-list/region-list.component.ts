import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArenaRegion } from '../shared/models/ArenaRegion';
import { Region } from '../shared/models/Region';
import { UserService } from '../shared/services';
import { ArenaService } from '../shared/services/arena.service';
import { ErrorService } from '../shared/services/error.service';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss']
})
export class RegionListComponent implements OnInit {
  constructor(
    public router : Router,
    public user : UserService,
    private error : ErrorService,
    private arena : ArenaService
  ) { }

  items : Region[] = [];

  ngOnInit(): void {
    this.arena.getAllRegions().subscribe(data => {
      this.items = data;
    })
  }

  deleteRegion(regionName : string) {
    // FIXME: implement this
  }
}
