import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Arena } from '../shared/models/Arena';
import { ArenaMember } from '../shared/models/ArenaMember';
import { ArenaService } from '../shared/services/arena.service';

@Component({
  selector: 'app-arena-list',
  templateUrl: './arena-list.component.html',
  styleUrls: ['./arena-list.component.scss']
})
export class ArenaListComponent implements OnInit {
  constructor(
    public router : Router,
    private arena : ArenaService
  ) { }

  // FIXME: Remove garbage starting data

  ngOnInit(): void {
    this.arena.getAllArenas().subscribe(data => {
      this.items = data;
    });

    this.arena.getMemberships().subscribe(data => {
      this.membershipArenas = data;
    })
  }

  membershipArenas : ArenaMember[] = [
    {
      id : 1,
      join_date: '',
      usr : 'xd',
      score : 1,
      arena : 'Kanto Gym'
    }
  ]

  isMemberOf(arena : string) : boolean {
    return this.membershipArenas.find(elem => elem.arena == arena) !== undefined;
  }

  getArenaMemberId(arena : string) : number {
    return this.membershipArenas.find(elem => elem.arena == arena)!.id;
  }

  items : Arena[] = [
    {
      name : 'Kanto Gym',
      region : 'Kanto',
      leader: 1
    },
    {
      name : 'Unova Arena',
      region : 'Unova',
      leader: 2
    },
  ]

  joinArena(arena : string) {
    // TODO: Join arena
  }
}
