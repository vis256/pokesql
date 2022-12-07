import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-region-label',
  templateUrl: './region-label.component.html',
  styleUrls: ['./region-label.component.scss']
})
export class RegionLabelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  @Input()
  region : string = 'XD';
}
