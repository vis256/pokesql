import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Counter } from 'src/app/shared/models/Counter';
import { Type } from 'src/app/shared/models/Type';
import { TokenService } from 'src/app/shared/services';
import { ErrorService } from 'src/app/shared/services/error.service';
import { TypesService } from 'src/app/shared/services/types.service';

@Component({
  selector: 'app-new-type-form',
  templateUrl: './new-type-form.component.html',
  styleUrls: ['./new-type-form.component.scss']
})
export class NewTypeFormComponent implements OnInit {
  constructor(
    private router : Router,
    private token : TokenService,
    private types : TypesService,
    private error : ErrorService
  ) { }

  formData : any = {
    name : '',
    worse : [],
    better : []
  }

  allTypes : Type[] = []

  ngOnInit(): void {
    this.types.getAllTypes().subscribe(data => {
      this.allTypes = data;
    })
  }

  checkTypesOverlapping = () => {
    return this.formData.worse.some((e : any) => this.formData.better.includes(e));
  }


  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();

    const newType : Type = {name : this.formData.name};

    this.types.createNewType(newType).subscribe(
      data => {
        // Add counters
        for (const worse of this.formData.worse) {
          const c : Counter = {
            better_type: newType.name,
            worse_type: worse
          }
          this.types.addNewCounter(c).subscribe(
            data => {},
            err => {this.error.displayError(err.error)}
          )
        }

        for (const better of this.formData.better) {
          const c : Counter = {
            better_type : better,
            worse_type : newType.name
          }
  
          this.types.addNewCounter(c).subscribe(
            data => {},
            err => {this.error.displayError(err.error)}
          )
        }

        this.router.navigate(['/pokedex/types/list']);
      },
      err => {
        this.error.displayError(err.error);
      }
    )
  }
}
