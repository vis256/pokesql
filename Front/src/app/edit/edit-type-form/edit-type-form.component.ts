import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Counter } from 'src/app/shared/models/Counter';
import { Type } from 'src/app/shared/models/Type';
import { TokenService } from 'src/app/shared/services';
import { ErrorService } from 'src/app/shared/services/error.service';
import { TypesService } from 'src/app/shared/services/types.service';

@Component({
  selector: 'app-edit-type-form',
  templateUrl: './edit-type-form.component.html',
  styleUrls: ['./edit-type-form.component.scss']
})
export class EditTypeFormComponent implements OnInit {
  constructor(
    private router : Router,
    private token : TokenService,
    private types : TypesService,
    private error : ErrorService,
    private route : ActivatedRoute
  ) {
    this.deleteType = this.deleteType.bind(this)
  }

  formData : any = {
    name : ''
  }

  oldtypename : string = ''

  allTypes : Type[] = []

  ngOnInit(): void {
    this.types.getAllTypes().subscribe(data => {
      this.allTypes = data;
    })

    this.route.paramMap.subscribe((data : any) => {
      this.oldtypename = data.params.typeName;
      this.formData.name = this.oldtypename
    })
  }


  deleteType() {
    console.log("deleting");
    this.types.deleteType(this.formData.name).subscribe(
      data => {this.router.navigate(['/pokedex/types/list'])},
      err => {this.error.displayError(err.error)}
    )
  }

  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();

    const newType : Type = {name : this.formData.name};

    this.types.updateType(this.oldtypename, newType).subscribe(
      data => {this.router.navigate(['/pokedex/types/list'])},
      err => {this.error.displayError(err.error)}
    )
  }
}
