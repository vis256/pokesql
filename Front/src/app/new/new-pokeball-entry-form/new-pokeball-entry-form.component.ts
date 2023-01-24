import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokeball } from 'src/app/shared/models/Pokeball';
import { ErrorService } from 'src/app/shared/services/error.service';
import { PokeballsService } from 'src/app/shared/services/pokeballs.service';

@Component({
  selector: 'app-new-pokeball-entry-form',
  templateUrl: './new-pokeball-entry-form.component.html',
  styleUrls: ['./new-pokeball-entry-form.component.scss']
})
export class NewPokeballEntryFormComponent implements OnInit {
  constructor(
    private router : Router,
    private pokeball : PokeballsService,
    private error : ErrorService
  ) { }

  formData : Pokeball = {
    name : ''
  }

  ngOnInit(): void {
  }

  onFormSubmit($event: any) {
    console.log({$event});
    console.log({data: this.formData})

    $event.preventDefault();

    this.pokeball.addNewPokeball(this.formData).subscribe(
      data => { this.router.navigate(['/pokedex/pokeball/list']) },
      err => {this.error.displayError(err.error)}
    )
  }

}
