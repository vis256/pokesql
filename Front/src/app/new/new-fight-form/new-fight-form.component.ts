import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArenaMember } from 'src/app/shared/models/ArenaMember';
import { Duel } from 'src/app/shared/models/Duel';
import { Pokemon } from 'src/app/shared/models/Pokemon';
import { UserInfo } from 'src/app/shared/models/UserInfo';
import { UserService } from 'src/app/shared/services';
import { ArenaService } from 'src/app/shared/services/arena.service';
import { DuelService } from 'src/app/shared/services/duel.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PokemonService } from 'src/app/shared/services/pokemon.service';

@Component({
  selector: 'app-new-fight-form',
  templateUrl: './new-fight-form.component.html',
  styleUrls: ['./new-fight-form.component.scss']
})
export class NewFightFormComponent implements OnInit {
  constructor(
    private arena : ArenaService,
    private route : ActivatedRoute,
    private duels : DuelService,
    public router : Router,
    private pokemon : PokemonService,
    private user : UserService,
    private error : ErrorService
  ) {
    this.getname = this.getname.bind(this);
    this.getMyUsr = this.getMyUsr.bind(this);
    this.loadPokemons = this.loadPokemons.bind(this);
  }

  formData : Duel = {
    id: 0,
    duel_date: undefined,
    winner: false,
    user1: 0,
    pokemon1: 0,
    user2: 0,
    pokemon2: 0,
    arena: ''
  }

  myArenaMember : ArenaMember = {
    usr: '',
    arena: ''
  }

  allArenaMembers : ArenaMember[] = [];

  opponentPokemons : Pokemon[] = [];
  myPokemons : Pokemon[] = [];

  allUsers : UserInfo[] = [];

  public getUsername(login : string) {
    return this.allUsers.find(e => e.login === login)!.username;
  }

  getMyUsr() {
    return this.myArenaMember.id;
  }

  loadPokemons($event : any) {
    console.log("loading", $event);
    this.pokemon.getUserPokemon($event.selectedItem.usr).subscribe(data => {
      this.opponentPokemons = data;
      console.log({opp_poks : data});
      
    })
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((data : any) => {
      const arenaMemberId = parseInt(data.params.arenaMemberID);

      this.arena.getArenaMember(arenaMemberId).subscribe(data => {
        this.myArenaMember = data;

        this.formData.user1 = arenaMemberId;
        this.formData.arena = this.myArenaMember.arena;
        
        console.log({XDDDD: this.formData});
        

        this.arena.getArenaMembers(this.formData.arena).subscribe(data => {
          this.allArenaMembers = data;
          console.log({data});
          
        })        
      })
    })

    this.user.getAllUsers().subscribe(data => {
      this.allUsers = data;
    })

    this.pokemon.getMyPokemon().subscribe(data => {
      this.myPokemons = data;
      console.log({my_poks : data});
      
    })
  }

  getname($event : any) {
    if ($event)
      return this.getUsername($event.usr)
    else
      return ''
  }

  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();

    this.duels.addDuel(this.formData).subscribe(
      data => { this.router.navigate([`/arena/${this.myArenaMember.id!}`]) },
      err => {this.error.displayError(err.error)}
    )
  }

}
