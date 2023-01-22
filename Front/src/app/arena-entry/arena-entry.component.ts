import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArenaMember } from '../shared/models/ArenaMember';
import { Duel } from '../shared/models/Duel';
import { UserInfo } from '../shared/models/UserInfo';
import { UserService } from '../shared/services';
import { ArenaService } from '../shared/services/arena.service';
import { DuelService } from '../shared/services/duel.service';
import { PokemonService } from '../shared/services/pokemon.service';

@Component({
  selector: 'app-arena-entry',
  templateUrl: './arena-entry.component.html',
  styleUrls: ['./arena-entry.component.scss']
})
export class ArenaEntryComponent implements OnInit {

  constructor(
    private arena : ArenaService,
    private route : ActivatedRoute,
    private duels : DuelService,
    public router : Router,
    private user : UserService,
    private pokemon : PokemonService
  ) { 
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      console.log({xd: data.params});
      if (data.params.arenaMemberID) {
        const arenaMemberID = parseInt(data.params.arenaMemberID);
        console.log({arenaMemberID});

        this.user.getAllUsers().subscribe(data => {
          this.allUsers = data;
        })

        this.arena.getArenaMember(arenaMemberID).subscribe(data => {
          this.arenaData = data;

          this.arena.getArenaMembers(data.arena).subscribe(data => {
            console.log({data});
            
            this.arenaMembers = data;
          })

          this.duels.getMyDuels(this.arenaData).subscribe(duelData => {
            const last = duelData.length
            for (const [index, duel] of duelData.entries()) {
              this.pokemon.getPokemonData(duel.my_pokemon_id).subscribe(data => {
                this.allPokemonData[duel.my_pokemon_id] = data;

                this.pokemon.getPokemonData(duel.opponent_pokemon_id).subscribe(data => {
                  this.allPokemonData[duel.opponent_pokemon_id] = data;

                  if (index === last-1) {
                    this.myFights = duelData;
                  }
                })
              })
            }
          })
        })
      }
    })
  }

  allUsers : UserInfo[] = [];

  public getUsername(login : string) {
    return this.allUsers.find(e => e.login === login)!.username;
  }

  public getUsernameFromId( id : number ) {
    return this.allUsers.find(e => e.login == (
      this.arenaMembers.find(e => e.id === id)!.usr
    ))!.username
  }

  arenaData : ArenaMember = {
    usr: '',
    arena: '',
    score: 0,
    id: 0,
    join_date: new Date()
  };

  arenaMembers : ArenaMember[] = [];

  myFights : any[] = []

  allPokemonData : any = {};
}
