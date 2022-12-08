import {Component, Input, OnInit} from '@angular/core';

const colors : any = {
  'Kanto' : '#7AC74C',
  'Johto' : '#EE8130',
  'Hoenn' : '#E2BF65',
  'Sinnoh' : '#6390F0',
  'Unova' : '#A8A77A',
  'Kalos' : '#6F35FC',
  'Alola' : '#A98FF3',
  'Galar' : '#96D9D6',
  'Paldea' : '#705746'
}

@Component({
  selector: 'app-region-label',
  templateUrl: './region-label.component.html',
  styleUrls: ['./region-label.component.scss']
})
export class RegionLabelComponent implements OnInit {

  constructor() { }

  color : string = '#fff';
  ngOnInit(): void {
    this.color = colors[this.region];
  }

  @Input()
  region : string = 'XD';
}
