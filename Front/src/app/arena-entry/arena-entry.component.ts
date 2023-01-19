import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArenaMember } from '../shared/models/ArenaMember';
import { Duel } from '../shared/models/Duel';
import { ArenaService } from '../shared/services/arena.service';
import { DuelService } from '../shared/services/duel.service';

@Component({
  selector: 'app-arena-entry',
  templateUrl: './arena-entry.component.html',
  styleUrls: ['./arena-entry.component.scss']
})
export class ArenaEntryComponent implements OnInit {

  constructor(
    private arena : ArenaService,
    private route : ActivatedRoute,
    private duels : DuelService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      console.log({xd: data.params});
      if (data.params.arenaMemberID) {
        const arenaMemberID = parseInt(data.params.arenaMemberID);

        this.arena.getArenaMember(arenaMemberID).subscribe(data => {
          this.arenaData = data;

          this.arena.getArenaMembers(this.arenaData!.arena).subscribe(data => {
            this.arenaMembers = data;
          })

          this.duels.getDuels(this.arenaData).subscribe(data => {
            this.myFights = data;
          })
        })
      }
    })
  }

  arenaData : ArenaMember = {
    usr: '',
    arena: '',
    score: 0,
    id: 0,
    join_date: new Date()
  };

  arenaMembers : ArenaMember[] = [];

  myFights : Duel[] = []

}
