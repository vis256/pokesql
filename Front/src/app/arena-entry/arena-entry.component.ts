import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArenaMember } from '../shared/models/ArenaMember';
import { ArenaService } from '../shared/services/arena.service';

@Component({
  selector: 'app-arena-entry',
  templateUrl: './arena-entry.component.html',
  styleUrls: ['./arena-entry.component.scss']
})
export class ArenaEntryComponent implements OnInit {

  constructor(
    private arena : ArenaService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((data : any) => {
    //   console.log({xd: data.params});
    //   if (data.params.arenaMemberID) {
    //     const arenaMemberID = parseInt(data.params.arenaMemberID);

    //     this.arena.getArenaMember(arenaMemberID).subscribe(data => {
    //       this.arenaData = data;

    //       this.arena.getArenaMembers(this.arenaData!.arena).subscribe(data => {
    //         this.arenaMembers = data;
    //       })
    //     })
    //   }
    // })
  }

  arenaData? : ArenaMember;

  arenaMembers : ArenaMember[] = [
    {
      id : 1,
      join_date: new Date(2020, 12, 23),
      usr : 'xd234',
      score : 12,
      arena : 'xd'
    },    
    {
      id : 2,
      join_date: new Date(2020, 1, 22),
      usr : 'jasiu2345',
      score : 3,
      arena : 'xd'
    },
    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },    {
      id : 3,
      join_date: new Date(2020, 11, 21),
      usr : 'chujadefrgt',
      score : 1,
      arena : 'xd'
    },

  ];

  recentFights = [
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-23T03:24:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Marcel'
    },
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-22T12:27:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Marcel'
    },
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-21T16:45:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Marcel'
    },
    {
      Rezultat : 'L',
      'Data walki' : new Date("2022-12-19T23:24:00"),
      Przeciwnik : 'Rocket Member',
      'Twój Pokemon' : 'Mścisław'
    },
    {
      Rezultat : 'W',
      'Data walki' : new Date("2022-12-17T01:28:00"),
      Przeciwnik : 'Emily',
      'Twój Pokemon' : 'Bulbasaur'
    },

  ]

  askAgain : boolean = true;

  leaveArena() {
    // TODO: Leave arena
    console.log("Leaving arena");
    
  }

}
