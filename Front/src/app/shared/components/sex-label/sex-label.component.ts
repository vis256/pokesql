import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sex-label',
  templateUrl: './sex-label.component.html',
  styleUrls: ['./sex-label.component.scss']
})
export class SexLabelComponent {
  constructor() { }

  @Input()
  sex : boolean = true;
}
