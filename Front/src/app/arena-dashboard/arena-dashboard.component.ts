import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-arena-dashboard',
  templateUrl: './arena-dashboard.component.html',
  styleUrls: ['./arena-dashboard.component.scss']
})
export class ArenaDashboardComponent implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
    this.router.navigate(['arena/list']);
  }

}
