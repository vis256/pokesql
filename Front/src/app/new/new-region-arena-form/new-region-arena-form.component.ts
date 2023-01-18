import { Component, OnInit } from '@angular/core';
import { ArenaRegion } from 'src/app/shared/models/ArenaRegion';
import { ArenaService } from 'src/app/shared/services/arena.service';

@Component({
  selector: 'app-new-region-arena-form',
  templateUrl: './new-region-arena-form.component.html',
  styleUrls: ['./new-region-arena-form.component.scss']
})
export class NewRegionArenaFormComponent implements OnInit {
  constructor(
    private arena : ArenaService
  ) { }

  formData : ArenaRegion = {
    region : '',
    arena : '',
    type: ''
  }

  types = ['Normal', 'Fire']
  
  ngOnInit(): void {
    // FIXME: Load type list
  }
  
  onFormSubmit($event : any) {
    $event.preventDefault();
    
    this.arena.addNewArena(this.formData);
  }

}
