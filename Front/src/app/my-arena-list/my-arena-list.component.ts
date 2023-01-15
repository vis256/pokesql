import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { ArenaMember } from '../shared/models/ArenaMember';
import { ArenaService } from '../shared/services/arena.service';

@Component({
  selector: 'app-my-arena-list',
  templateUrl: './my-arena-list.component.html',
  styleUrls: ['./my-arena-list.component.scss']
})
export class MyArenaListComponent implements OnInit {

  constructor(
    public router : Router,
    private arena : ArenaService
  ) { }

  ngOnInit(): void {
    this.arena.getMemberships().subscribe(data => {
      this.myMemberships = data;
    });
  }

  myMemberships : ArenaMember[] = [];
}
