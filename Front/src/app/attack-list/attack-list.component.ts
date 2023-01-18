import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services";
import {Router} from "@angular/router";
import {Attack} from "../shared/models/Attack";
import { AttackService } from '../shared/services/attack.service';

@Component({
  selector: 'app-attack-list',
  templateUrl: './attack-list.component.html',
  styleUrls: ['./attack-list.component.scss']
})
export class AttackListComponent implements OnInit {

  constructor(
    public user : UserService,
    public router : Router,
    private attack : AttackService
  ) { }

  attacks : Attack[] = [];

  click($event : any) {
    this.router.navigate([`/pokedex/attacks/${$event.itemData.name}`])
  }

  ngOnInit(): void {
    this.attack.getAllAttacks().subscribe(data => {
      this.attacks = data;
    })
  }
}
