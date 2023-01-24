import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Attack } from 'src/app/shared/models/Attack';
import { Type } from 'src/app/shared/models/Type';
import { AttackService } from 'src/app/shared/services/attack.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { TypesService } from 'src/app/shared/services/types.service';

@Component({
  selector: 'app-edit-attack-form',
  templateUrl: './edit-attack-form.component.html',
  styleUrls: ['./edit-attack-form.component.scss']
})
export class EditAttackFormComponent implements OnInit {

  constructor(
    public type : TypesService,
    private attack : AttackService,
    private error : ErrorService,
    private router : Router,
    private route : ActivatedRoute
  ) { }

  formData : Attack = {
    name: '',
    power: 0,
    type_: '',
    hit_chance: 0
  };

  originalName : string = '';

  types : string[] = [];

  deleteAttack() {
    this.attack.deleteAttack(this.originalName).subscribe(
      data => {this.router.navigate(['pokedex/attacks/list'])},
      err => {this.error.displayError(err.error)}
    )
  }

  ngOnInit(): void {
    this.type.getAllTypesString().subscribe(data => {
      this.types = data;
    })

    this.route.paramMap.subscribe((data : any) => {
      this.originalName = data.params.attackName;

      this.attack.getAttackByName(this.originalName).subscribe(data => {
        this.formData = data;
      })
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
