import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Attack } from 'src/app/shared/models/Attack';
import { Type } from 'src/app/shared/models/Type';
import { AttackService } from 'src/app/shared/services/attack.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { TypesService } from 'src/app/shared/services/types.service';

@Component({
  selector: 'app-new-attack-form',
  templateUrl: './new-attack-form.component.html',
  styleUrls: ['./new-attack-form.component.scss']
})
export class NewAttackFormComponent implements OnInit {

  constructor(
    public type : TypesService,
    private attack : AttackService,
    private error : ErrorService,
    private router : Router
  ) { }

  formData : Attack = {
    name: '',
    power: 0,
    type_: '',
    hit_chance: 0
  };

  types : string[] = [];

  ngOnInit(): void {
    this.type.getAllTypesString().subscribe(data => {
      this.types = data;
    })
  }

  onFormSubmit($event: any) {
    console.log({$event})
    console.log(this.formData);
    
    $event.preventDefault();

    this.attack.addNewAttack(this.formData).subscribe(
      data => {
        console.log({data});
        this.router.navigate(['pokedex/attacks/list']);
      },
      err => {
        console.error({err});
        this.error.displayError(err.error);
      }
    )
  }

}
