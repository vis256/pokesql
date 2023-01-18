import { Component, OnInit } from '@angular/core';
import { Attack } from 'src/app/shared/models/Attack';
import { AttackService } from 'src/app/shared/services/attack.service';
import { TypesService } from 'src/app/shared/services/types.service';

@Component({
  selector: 'app-new-attack-form',
  templateUrl: './new-attack-form.component.html',
  styleUrls: ['./new-attack-form.component.scss']
})
export class NewAttackFormComponent implements OnInit {

  constructor(
    public type : TypesService,
    private attack : AttackService
  ) { }

  formData : Attack = {
    name: '',
    power: 0,
    type: '',
    hit_chance: 0
  };

  ngOnInit(): void {
  }

  onFormSubmit($event: any) {
    console.log({$event})
    console.log(this.formData);
    
    $event.preventDefault();

    this.attack.addNewAttack(this.formData).subscribe(
      data => {
        console.log({data});
        
      },
      err => {
        console.log({err});
        
      }
    )
  }

}
