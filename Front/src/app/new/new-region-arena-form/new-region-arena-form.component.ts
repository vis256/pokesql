import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArenaRegion } from 'src/app/shared/models/ArenaRegion';
import { ArenaService } from 'src/app/shared/services/arena.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { TypesService } from 'src/app/shared/services/types.service';

@Component({
  selector: 'app-new-region-arena-form',
  templateUrl: './new-region-arena-form.component.html',
  styleUrls: ['./new-region-arena-form.component.scss']
})
export class NewRegionArenaFormComponent implements OnInit {
  constructor(
    private arena : ArenaService,
    private router : Router,
    private error : ErrorService,
    private type : TypesService
  ) { }

  formData : ArenaRegion = {
    region : '',
    arena : '',
    type: ''
  }

  // FIXME: Implement this actually

  types : string[] = []
  
  ngOnInit(): void {
    this.type.getAllTypesString().subscribe( data => {
      this.types = data;
    })
  }
  
  onFormSubmit($event : any) {
    $event.preventDefault();
    
    this.arena.addNewArena(this.formData).subscribe(
      data => {this.router.navigate(['/pokedex/regions/list'])},
      err => {this.error.displayError(err.error)}
    );
  }

}
