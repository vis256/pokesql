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

  ngOnInit(): void {
    this.arena.getAllArenas().subscribe(data => {
      this.items = data;

      console.log({ALL_ARENAS : this.items});
      
    });

    this.arena.getMemberships().subscribe(data => {
      this.membershipArenas = data;
    })
  }

  membershipArenas : ArenaMember[] = []

  isMemberOf(arena : string) : boolean {
    return this.membershipArenas.find(elem => elem.arena == arena) !== undefined;
  }

  getArenaMemberId(arena : string) : number {
    return this.membershipArenas.find(elem => elem.arena == arena)!.id!;
  }

  items : Arena[] = [

  ]

  joinArena(arena : string) {
    this.arena.joinArena(arena).subscribe(data => {
      console.log({data});
      this.arena.getMemberships().subscribe(arenaData => {
        const a = arenaData.find(e => e.arena === arena);
        if (a) 
          this.router.navigate([`/arena/${a.id!}`]);
        
      })
    })
  }
}
