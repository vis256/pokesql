import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-pokedex-entry-form',
  templateUrl: './new-pokedex-entry-form.component.html',
  styleUrls: ['./new-pokedex-entry-form.component.scss']
})
export class NewPokedexEntryFormComponent implements OnInit {
  constructor() { }

  formData : any;

  ngOnInit(): void {
  }

}
