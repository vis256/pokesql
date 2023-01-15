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
    this.route.paramMap.subscribe((data : any) => {
      console.log({xd: data.params});
      if (data.params.arenaMemberID) {
        const arenaMemberID = parseInt(data.params.arenaMemberID);

        this.arena.getArenaMember(arenaMemberID).subscribe(data => {
          this.arenaData = data;
        })
      }
    })
  }

  arenaData? : ArenaMember;

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

}
